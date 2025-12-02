import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { CreateChannelDto } from './dto/create-channel.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChannelsService {
	/**
	 * 워크스페이스의 채널 목록 조회
	 */
	async getChannels(workspaceId: number, userId: number) {
		// 멤버인지 확인
		const member = await prisma.workspaceMember.findUnique({
			where: { workspaceId_userId: { workspaceId, userId } },
		});

		if (!member) {
			throw new ForbiddenException('워크스페이스에 접근 권한이 없습니다.');
		}

		const channels = await prisma.channel.findMany({
			where: {
				workspaceId,
				OR: [{ private: false }, { Members: { some: { userId } } }],
			},
			include: {
				_count: { select: { Members: true } },
			},
			orderBy: { createdAt: 'asc' },
		});

		return channels.map((ch) => ({
			id: ch.id,
			name: ch.name,
			private: ch.private,
			memberCount: ch._count.Members,
			createdAt: ch.createdAt,
		}));
	}

	/**
	 * 채널 생성
	 */
	async createChannel(userId: number, dto: CreateChannelDto) {
		// 워크스페이스 멤버인지 확인
		const member = await prisma.workspaceMember.findUnique({
			where: { workspaceId_userId: { workspaceId: dto.workspaceId, userId } },
		});

		if (!member) {
			throw new ForbiddenException('워크스페이스에 접근 권한이 없습니다.');
		}

		const channel = await prisma.$transaction(async (tx) => {
			const ch = await tx.channel.create({
				data: {
					name: dto.name,
					workspaceId: dto.workspaceId,
					private: dto.private || false,
				},
			});

			// 생성자를 채널 멤버로 추가
			await tx.channelMember.create({
				data: {
					channelId: ch.id,
					userId: userId,
				},
			});

			return ch;
		});

		return channel;
	}

	/**
	 * 채널 상세 조회
	 */
	async getChannel(channelId: number, userId: number) {
		const channel = await prisma.channel.findUnique({
			where: { id: channelId },
			include: {
				Workspace: true,
				Members: {
					include: {
						User: { select: { id: true, nickname: true, email: true } },
					},
				},
			},
		});

		if (!channel) {
			throw new NotFoundException('채널을 찾을 수 없습니다.');
		}

		// 워크스페이스 멤버인지 확인
		const wsMember = await prisma.workspaceMember.findUnique({
			where: { workspaceId_userId: { workspaceId: channel.workspaceId, userId } },
		});

		if (!wsMember) {
			throw new ForbiddenException('접근 권한이 없습니다.');
		}

		return {
			id: channel.id,
			name: channel.name,
			private: channel.private,
			workspaceId: channel.workspaceId,
			workspaceName: channel.Workspace.name,
			members: channel.Members.map((m) => m.User),
			createdAt: channel.createdAt,
		};
	}

	/**
	 * 채널 메시지 조회
	 */
	async getMessages(channelId: number, userId: number, page = 1, limit = 50) {
		const channel = await prisma.channel.findUnique({
			where: { id: channelId },
		});

		if (!channel) {
			throw new NotFoundException('채널을 찾을 수 없습니다.');
		}

		// 워크스페이스 멤버인지 확인
		const wsMember = await prisma.workspaceMember.findUnique({
			where: { workspaceId_userId: { workspaceId: channel.workspaceId, userId } },
		});

		if (!wsMember) {
			throw new ForbiddenException('접근 권한이 없습니다.');
		}

		const messages = await prisma.channelChat.findMany({
			where: { channelId },
			include: {
				User: { select: { id: true, nickname: true, email: true } },
			},
			orderBy: { createdAt: 'desc' },
			skip: (page - 1) * limit,
			take: limit,
		});

		return messages.reverse().map((msg) => ({
			id: msg.id,
			content: msg.content,
			user: msg.User,
			createdAt: msg.createdAt,
		}));
	}

	/**
	 * 메시지 전송
	 */
	async sendMessage(channelId: number, userId: number, dto: SendMessageDto) {
		const channel = await prisma.channel.findUnique({
			where: { id: channelId },
		});

		if (!channel) {
			throw new NotFoundException('채널을 찾을 수 없습니다.');
		}

		// 워크스페이스 멤버인지 확인
		const wsMember = await prisma.workspaceMember.findUnique({
			where: { workspaceId_userId: { workspaceId: channel.workspaceId, userId } },
		});

		if (!wsMember) {
			throw new ForbiddenException('접근 권한이 없습니다.');
		}

		const message = await prisma.channelChat.create({
			data: {
				content: dto.content,
				channelId: channelId,
				userId: userId,
			},
			include: {
				User: { select: { id: true, nickname: true, email: true } },
			},
		});

		return {
			id: message.id,
			content: message.content,
			user: message.User,
			createdAt: message.createdAt,
		};
	}

	/**
	 * 채널 참가
	 */
	async joinChannel(channelId: number, userId: number) {
		const channel = await prisma.channel.findUnique({
			where: { id: channelId },
		});

		if (!channel) {
			throw new NotFoundException('채널을 찾을 수 없습니다.');
		}

		// 워크스페이스 멤버인지 확인
		const wsMember = await prisma.workspaceMember.findUnique({
			where: { workspaceId_userId: { workspaceId: channel.workspaceId, userId } },
		});

		if (!wsMember) {
			throw new ForbiddenException('워크스페이스에 먼저 참가해주세요.');
		}

		// 이미 멤버인지 확인
		const existing = await prisma.channelMember.findUnique({
			where: { channelId_userId: { channelId, userId } },
		});

		if (existing) {
			return { message: '이미 참가한 채널입니다.' };
		}

		await prisma.channelMember.create({
			data: { channelId, userId },
		});

		return { message: '채널에 참가했습니다.' };
	}
}

