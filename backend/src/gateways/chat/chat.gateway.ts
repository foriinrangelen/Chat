import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface AuthenticatedSocket extends Socket {
	userId?: number;
	nickname?: string;
}

@WebSocketGateway({
	cors: {
		origin: '*',
		credentials: true,
	},
	namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private logger = new Logger('ChatGateway');
	private connectedUsers = new Map<number, string>(); // userId -> socketId

	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
	) {}

	afterInit() {
		this.logger.log('WebSocket Gateway initialized');
	}

	async handleConnection(client: AuthenticatedSocket) {
		try {
			// JWT 토큰 검증
			const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];

			if (!token) {
				this.logger.warn(`Client ${client.id} connected without token`);
				client.disconnect();
				return;
			}

			const payload = this.jwtService.verify(token, {
				secret: this.configService.get<string>('JWT_ACCESS_SECRET') || 'access-secret',
			});

			const userId = payload.sub;
			client.userId = userId;

			// 유저 정보 가져오기
			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: { id: true, nickname: true },
			});

			if (!user) {
				client.disconnect();
				return;
			}

			client.nickname = user.nickname;

			// 연결된 사용자 목록에 추가
			this.connectedUsers.set(userId, client.id);

			// 온라인 상태 업데이트
			await prisma.user.update({
				where: { id: userId },
				data: { isOnline: true },
			});

			// 모든 클라이언트에게 온라인 상태 알림
			this.server.emit('userOnline', { userId, nickname: user.nickname });

			this.logger.log(`Client connected: ${client.id} (User: ${user.nickname})`);
		} catch (error) {
			this.logger.error(`Connection error: ${error}`);
			client.disconnect();
		}
	}

	async handleDisconnect(client: AuthenticatedSocket) {
		if (client.userId) {
			// 연결된 사용자 목록에서 제거
			this.connectedUsers.delete(client.userId);

			// 오프라인 상태 업데이트
			await prisma.user.update({
				where: { id: client.userId },
				data: { isOnline: false, lastSeenAt: new Date() },
			});

			// 모든 클라이언트에게 오프라인 상태 알림
			this.server.emit('userOffline', { userId: client.userId });

			this.logger.log(`Client disconnected: ${client.id} (User: ${client.nickname})`);
		}
	}

	// 채널 입장
	@SubscribeMessage('joinChannel')
	async handleJoinChannel(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { channelId: number }) {
		const roomName = `channel:${data.channelId}`;
		client.join(roomName);
		this.logger.log(`User ${client.nickname} joined channel ${data.channelId}`);
		return { success: true, room: roomName };
	}

	// 채널 퇴장
	@SubscribeMessage('leaveChannel')
	async handleLeaveChannel(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { channelId: number }) {
		const roomName = `channel:${data.channelId}`;
		client.leave(roomName);
		this.logger.log(`User ${client.nickname} left channel ${data.channelId}`);
		return { success: true };
	}

	// 채널 메시지 전송
	@SubscribeMessage('sendChannelMessage')
	async handleChannelMessage(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { channelId: number; content: string }) {
		if (!client.userId) return;

		try {
			// 메시지 저장
			const message = await prisma.channelMessage.create({
				data: {
					content: data.content,
					channelId: data.channelId,
					userId: client.userId,
				},
				include: {
					User: { select: { id: true, nickname: true } },
				},
			});

			const messageData = {
				id: message.id,
				content: message.content,
				user: {
					id: message.User.id,
					nickname: message.User.nickname,
				},
				channelId: data.channelId,
				createdAt: message.createdAt,
			};

			// 채널의 모든 사용자에게 메시지 브로드캐스트
			const roomName = `channel:${data.channelId}`;
			this.server.to(roomName).emit('newChannelMessage', messageData);

			return { success: true, message: messageData };
		} catch (error) {
			this.logger.error(`Error sending channel message: ${error}`);
			return { success: false, error: 'Failed to send message' };
		}
	}

	// DM 방 입장
	@SubscribeMessage('joinDM')
	async handleJoinDM(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { dmId: number }) {
		const roomName = `dm:${data.dmId}`;
		client.join(roomName);
		this.logger.log(`User ${client.nickname} joined DM ${data.dmId}`);
		return { success: true, room: roomName };
	}

	// DM 퇴장
	@SubscribeMessage('leaveDM')
	async handleLeaveDM(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { dmId: number }) {
		const roomName = `dm:${data.dmId}`;
		client.leave(roomName);
		this.logger.log(`User ${client.nickname} left DM ${data.dmId}`);
		return { success: true };
	}

	// DM 메시지 전송
	@SubscribeMessage('sendDMMessage')
	async handleDMMessage(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { dmId: number; content: string }) {
		if (!client.userId) return;

		try {
			// 메시지 저장
			const message = await prisma.dMMessage.create({
				data: {
					content: data.content,
					directMessageId: data.dmId,
					userId: client.userId,
				},
				include: {
					User: { select: { id: true, nickname: true } },
				},
			});

			// DM 업데이트 시간 갱신
			await prisma.directMessage.update({
				where: { id: data.dmId },
				data: { updatedAt: new Date() },
			});

			const messageData = {
				id: message.id,
				content: message.content,
				user: {
					id: message.User.id,
					nickname: message.User.nickname,
				},
				dmId: data.dmId,
				createdAt: message.createdAt,
			};

			// DM 방의 모든 사용자에게 메시지 브로드캐스트
			const roomName = `dm:${data.dmId}`;
			this.server.to(roomName).emit('newDMMessage', messageData);

			return { success: true, message: messageData };
		} catch (error) {
			this.logger.error(`Error sending DM message: ${error}`);
			return { success: false, error: 'Failed to send message' };
		}
	}

	// 타이핑 상태 알림
	@SubscribeMessage('typing')
	handleTyping(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { roomType: 'channel' | 'dm'; roomId: number; isTyping: boolean }) {
		const roomName = `${data.roomType}:${data.roomId}`;
		client.to(roomName).emit('userTyping', {
			userId: client.userId,
			nickname: client.nickname,
			isTyping: data.isTyping,
		});
	}

	// 온라인 사용자 목록 요청
	@SubscribeMessage('getOnlineUsers')
	handleGetOnlineUsers() {
		return {
			success: true,
			users: Array.from(this.connectedUsers.keys()),
		};
	}
}
