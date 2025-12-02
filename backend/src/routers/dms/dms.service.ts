import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { CreateDmDto } from './dto/create-dm.dto';
import { SendDmDto } from './dto/send-dm.dto';

@Injectable()
export class DmsService {
	/**
	 * 내 DM 목록 조회
	 */
	async getMyDms(userId: number, workspaceId: number) {
		// 워크스페이스 멤버인지 확인
		const member = await prisma.workspaceMember.findUnique({
			where: { workspaceId_userId: { workspaceId, userId } },
		});

		if (!member) {
			throw new ForbiddenException('워크스페이스에 접근 권한이 없습니다.');
		}

		const dms = await prisma.dM.findMany({
			where: {
				workspaceId,
				OR: [{ senderId: userId }, { receiverId: userId }],
			},
			include: {
				Sender: { select: { id: true, nickname: true, email: true } },
				Receiver: { select: { id: true, nickname: true, email: true } },
				Chats: {
					orderBy: { createdAt: 'desc' },
					take: 1,
				},
			},
			orderBy: { updatedAt: 'desc' },
		});

		return dms.map((dm) => {
			const otherUser = dm.senderId === userId ? dm.Receiver : dm.Sender;
			return {
				id: dm.id,
				user: otherUser,
				lastMessage: dm.Chats[0]?.content || null,
				lastMessageAt: dm.Chats[0]?.createdAt || dm.createdAt,
			};
		});
	}

	/**
	 * DM 생성 또는 기존 DM 조회
	 */
	async createOrGetDm(userId: number, dto: CreateDmDto) {
		// 워크스페이스 멤버인지 확인
		const member = await prisma.workspaceMember.findUnique({
			where: { workspaceId_userId: { workspaceId: dto.workspaceId, userId } },
		});

		if (!member) {
			throw new ForbiddenException('워크스페이스에 접근 권한이 없습니다.');
		}

		// 상대방도 워크스페이스 멤버인지 확인
		const receiverMember = await prisma.workspaceMember.findUnique({
			where: { workspaceId_userId: { workspaceId: dto.workspaceId, userId: dto.receiverId } },
		});

		if (!receiverMember) {
			throw new NotFoundException('상대방이 워크스페이스에 없습니다.');
		}

		// 기존 DM이 있는지 확인
		let dm = await prisma.dM.findFirst({
			where: {
				workspaceId: dto.workspaceId,
				OR: [
					{ senderId: userId, receiverId: dto.receiverId },
					{ senderId: dto.receiverId, receiverId: userId },
				],
			},
		});

		// 없으면 새로 생성
		if (!dm) {
			dm = await prisma.dM.create({
				data: {
					workspaceId: dto.workspaceId,
					senderId: userId,
					receiverId: dto.receiverId,
				},
			});
		}

		return dm;
	}

	/**
	 * DM 메시지 조회
	 */
	async getMessages(dmId: number, userId: number, page = 1, limit = 50) {
		const dm = await prisma.dM.findUnique({
			where: { id: dmId },
		});

		if (!dm) {
			throw new NotFoundException('DM을 찾을 수 없습니다.');
		}

		// 참여자인지 확인
		if (dm.senderId !== userId && dm.receiverId !== userId) {
			throw new ForbiddenException('접근 권한이 없습니다.');
		}

		const messages = await prisma.dMChat.findMany({
			where: { dmId },
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
	 * DM 메시지 전송
	 */
	async sendMessage(dmId: number, userId: number, dto: SendDmDto) {
		const dm = await prisma.dM.findUnique({
			where: { id: dmId },
		});

		if (!dm) {
			throw new NotFoundException('DM을 찾을 수 없습니다.');
		}

		// 참여자인지 확인
		if (dm.senderId !== userId && dm.receiverId !== userId) {
			throw new ForbiddenException('접근 권한이 없습니다.');
		}

		const message = await prisma.dMChat.create({
			data: {
				content: dto.content,
				dmId: dmId,
				userId: userId,
			},
			include: {
				User: { select: { id: true, nickname: true, email: true } },
			},
		});

		// DM 업데이트 시간 갱신
		await prisma.dM.update({
			where: { id: dmId },
			data: { updatedAt: new Date() },
		});

		return {
			id: message.id,
			content: message.content,
			user: message.User,
			createdAt: message.createdAt,
		};
	}
}
