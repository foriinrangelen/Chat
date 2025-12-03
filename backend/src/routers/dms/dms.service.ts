// src/routers/dms/dms.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { CreateDmDto } from './dto/create-dm.dto';
import { SendDmDto } from './dto/send-dm.dto';

@Injectable()
export class DmsService {
	/**
	 * 내 DM 목록 조회
	 */
	async getMyDms(userId: number) {
		const dms = await prisma.dMs.findMany({
			where: {
				OR: [{ senderId: userId }, { receiverId: userId }],
			},
			include: {
				Sender: {
					select: {
						id: true,
						nickname: true,
						email: true,
						avatar: true,
						isOnline: true,
					},
				},
				Receiver: {
					select: {
						id: true,
						nickname: true,
						email: true,
						avatar: true,
						isOnline: true,
					},
				},
				Messages: {
					orderBy: { createdAt: 'desc' },
					take: 1,
				},
			},
			orderBy: { updatedAt: 'desc' },
		});

		return dms.map((dm) => {
			const otherUser = dm.senderId === userId ? dm.Receiver : dm.Sender;
			const lastMessage = dm.Messages[0];
			return {
				id: dm.id,
				user: otherUser,
				lastMessage: lastMessage?.content || null,
				lastMessageAt: lastMessage?.createdAt || dm.createdAt,
			};
		});
	}

	/**
	 * DM 생성 또는 기존 DM 조회
	 */
	async createOrGetDm(userId: number, dto: CreateDmDto) {
		// 자기 자신에게 DM 불가
		if (userId === dto.receiverId) {
			throw new ForbiddenException('자신에게 DM을 보낼 수 없습니다.');
		}

		// 상대방 존재 확인
		const receiver = await prisma.user.findUnique({
			where: { id: dto.receiverId, deletedAt: null },
		});

		if (!receiver) {
			throw new NotFoundException('사용자를 찾을 수 없습니다.');
		}

		// 기존 DM이 있는지 확인
		let dm = await prisma.dMs.findFirst({
			where: {
				OR: [
					{ senderId: userId, receiverId: dto.receiverId },
					{ senderId: dto.receiverId, receiverId: userId },
				],
			},
		});

		// 없으면 새로 생성
		if (!dm) {
			dm = await prisma.dMs.create({
				data: {
					senderId: userId,
					receiverId: dto.receiverId,
				},
			});
		}

		return { id: dm.id };
	}

	/**
	 * DM 상세 조회
	 */
	async getDm(dmId: number, userId: number) {
		const dm = await prisma.dMs.findUnique({
			where: { id: dmId },
			include: {
				Sender: {
					select: {
						id: true,
						nickname: true,
						email: true,
						avatar: true,
						isOnline: true,
					},
				},
				Receiver: {
					select: {
						id: true,
						nickname: true,
						email: true,
						avatar: true,
						isOnline: true,
					},
				},
			},
		});

		if (!dm) {
			throw new NotFoundException('DM을 찾을 수 없습니다.');
		}

		// 참여자인지 확인
		if (dm.senderId !== userId && dm.receiverId !== userId) {
			throw new ForbiddenException('접근 권한이 없습니다.');
		}

		const otherUser = dm.senderId === userId ? dm.Receiver : dm.Sender;

		return {
			id: dm.id,
			user: otherUser,
			createdAt: dm.createdAt,
		};
	}

	/**
	 * DM 메시지 조회
	 */
	async getMessages(dmId: number, userId: number, page = 1, limit = 50) {
		const dm = await prisma.dMs.findUnique({
			where: { id: dmId },
		});

		if (!dm) {
			throw new NotFoundException('DM을 찾을 수 없습니다.');
		}

		// 참여자인지 확인
		if (dm.senderId !== userId && dm.receiverId !== userId) {
			throw new ForbiddenException('접근 권한이 없습니다.');
		}

		const messages = await prisma.dMMessage.findMany({
			where: { directMessageId: dmId },
			include: {
				User: {
					select: {
						id: true,
						nickname: true,
						email: true,
						avatar: true,
						isOnline: true,
					},
				},
				ReplyTo: {
					include: {
						User: { select: { id: true, nickname: true } },
					},
				},
			},
			orderBy: { createdAt: 'desc' },
			skip: (page - 1) * limit,
			take: limit,
		});

		return messages.reverse().map((msg) => ({
			id: msg.id,
			content: msg.content,
			user: msg.User,
			isEdited: msg.isEdited,
			replyTo: msg.ReplyTo
				? {
						id: msg.ReplyTo.id,
						content: msg.ReplyTo.content,
						userName: msg.ReplyTo.User.nickname,
					}
				: null,
			createdAt: msg.createdAt,
			updatedAt: msg.updatedAt,
		}));
	}

	/**
	 * DM 메시지 전송
	 */
	async sendMessage(dmId: number, userId: number, dto: SendDmDto) {
		const dm = await prisma.dMs.findUnique({
			where: { id: dmId },
		});

		if (!dm) {
			throw new NotFoundException('DM을 찾을 수 없습니다.');
		}

		// 참여자인지 확인
		if (dm.senderId !== userId && dm.receiverId !== userId) {
			throw new ForbiddenException('접근 권한이 없습니다.');
		}

		const message = await prisma.dMMessage.create({
			data: {
				content: dto.content,
				directMessageId: dmId,
				userId: userId,
				replyToId: dto.replyToId,
			},
			include: {
				User: {
					select: {
						id: true,
						nickname: true,
						email: true,
						avatar: true,
						isOnline: true,
					},
				},
				ReplyTo: {
					include: {
						User: { select: { id: true, nickname: true } },
					},
				},
			},
		});

		// DM 업데이트 시간 갱신
		await prisma.dMs.update({
			where: { id: dmId },
			data: { updatedAt: new Date() },
		});

		return {
			id: message.id,
			content: message.content,
			user: message.User,
			isEdited: message.isEdited,
			replyTo: message.ReplyTo
				? {
						id: message.ReplyTo.id,
						content: message.ReplyTo.content,
						userName: message.ReplyTo.User.nickname,
					}
				: null,
			createdAt: message.createdAt,
		};
	}

	/**
	 * DM 메시지 수정
	 */
	async editMessage(messageId: number, userId: number, content: string) {
		const message = await prisma.dMMessage.findUnique({
			where: { id: messageId },
		});

		if (!message) {
			throw new NotFoundException('메시지를 찾을 수 없습니다.');
		}

		if (message.userId !== userId) {
			throw new ForbiddenException('본인의 메시지만 수정할 수 있습니다.');
		}

		const updated = await prisma.dMMessage.update({
			where: { id: messageId },
			data: { content, isEdited: true },
			include: {
				User: {
					select: {
						id: true,
						nickname: true,
						email: true,
						avatar: true,
						isOnline: true,
					},
				},
			},
		});

		return {
			id: updated.id,
			content: updated.content,
			user: updated.User,
			isEdited: updated.isEdited,
			createdAt: updated.createdAt,
			updatedAt: updated.updatedAt,
		};
	}

	/**
	 * DM 메시지 삭제
	 */
	async deleteMessage(messageId: number, userId: number) {
		const message = await prisma.dMMessage.findUnique({
			where: { id: messageId },
		});

		if (!message) {
			throw new NotFoundException('메시지를 찾을 수 없습니다.');
		}

		if (message.userId !== userId) {
			throw new ForbiddenException('본인의 메시지만 삭제할 수 있습니다.');
		}

		await prisma.dMMessage.delete({
			where: { id: messageId },
		});

		return { message: '메시지가 삭제되었습니다.' };
	}
}
