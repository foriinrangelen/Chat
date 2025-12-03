// src/routers/friends/friends.service.ts
import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';

@Injectable()
export class FriendsService {
	/**
	 * 내 친구 목록 조회
	 */
	async getMyFriends(userId: number) {
		const friendships = await prisma.friendship.findMany({
			where: {
				status: 'ACCEPTED',
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
						statusMessage: true,
					},
				},
				Receiver: {
					select: {
						id: true,
						nickname: true,
						email: true,
						avatar: true,
						isOnline: true,
						statusMessage: true,
					},
				},
			},
			orderBy: { updatedAt: 'desc' },
		});

		return friendships.map((f) => {
			const friend = f.senderId === userId ? f.Receiver : f.Sender;
			return {
				id: f.id,
				friendId: friend.id,
				name: friend.nickname,
				email: friend.email,
				avatar: friend.avatar,
				isOnline: friend.isOnline,
				statusMessage: friend.statusMessage,
			};
		});
	}

	/**
	 * 받은 친구 요청 목록 조회
	 */
	async getReceivedRequests(userId: number) {
		const requests = await prisma.friendship.findMany({
			where: {
				receiverId: userId,
				status: 'PENDING',
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
			},
			orderBy: { createdAt: 'desc' },
		});

		return requests.map((r) => ({
			id: r.id,
			senderId: r.Sender.id,
			name: r.Sender.nickname,
			email: r.Sender.email,
			avatar: r.Sender.avatar,
			message: r.message,
			createdAt: r.createdAt,
		}));
	}

	/**
	 * 보낸 친구 요청 목록 조회
	 */
	async getSentRequests(userId: number) {
		const requests = await prisma.friendship.findMany({
			where: {
				senderId: userId,
				status: 'PENDING',
			},
			include: {
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
			orderBy: { createdAt: 'desc' },
		});

		return requests.map((r) => ({
			id: r.id,
			receiverId: r.Receiver.id,
			name: r.Receiver.nickname,
			email: r.Receiver.email,
			avatar: r.Receiver.avatar,
			message: r.message,
			createdAt: r.createdAt,
		}));
	}

	/**
	 * 친구 요청 보내기
	 */
	async sendFriendRequest(userId: number, dto: SendFriendRequestDto) {
		// 자기 자신에게 요청 불가
		if (userId === dto.receiverId) {
			throw new ForbiddenException('자신에게 친구 요청을 보낼 수 없습니다.');
		}

		// 상대방 존재 확인
		const receiver = await prisma.user.findUnique({
			where: { id: dto.receiverId, deletedAt: null },
		});

		if (!receiver) {
			throw new NotFoundException('사용자를 찾을 수 없습니다.');
		}

		// 이미 친구 관계가 있는지 확인
		const existing = await prisma.friendship.findFirst({
			where: {
				OR: [
					{ senderId: userId, receiverId: dto.receiverId },
					{ senderId: dto.receiverId, receiverId: userId },
				],
			},
		});

		if (existing) {
			if (existing.status === 'ACCEPTED') {
				throw new ConflictException('이미 친구입니다.');
			}
			if (existing.status === 'PENDING') {
				throw new ConflictException('이미 친구 요청이 진행 중입니다.');
			}
			if (existing.status === 'BLOCKED') {
				throw new ForbiddenException('차단된 사용자입니다.');
			}
		}

		const friendship = await prisma.friendship.create({
			data: {
				senderId: userId,
				receiverId: dto.receiverId,
				message: dto.message,
				status: 'PENDING',
			},
		});

		return { id: friendship.id, message: '친구 요청을 보냈습니다.' };
	}

	/**
	 * 친구 요청 수락
	 */
	async acceptFriendRequest(userId: number, requestId: number) {
		const request = await prisma.friendship.findUnique({
			where: { id: requestId },
		});

		if (!request) {
			throw new NotFoundException('친구 요청을 찾을 수 없습니다.');
		}

		if (request.receiverId !== userId) {
			throw new ForbiddenException('해당 요청을 수락할 권한이 없습니다.');
		}

		if (request.status !== 'PENDING') {
			throw new ConflictException('이미 처리된 요청입니다.');
		}

		await prisma.friendship.update({
			where: { id: requestId },
			data: { status: 'ACCEPTED' },
		});

		return { message: '친구 요청을 수락했습니다.' };
	}

	/**
	 * 친구 요청 거절
	 */
	async rejectFriendRequest(userId: number, requestId: number) {
		const request = await prisma.friendship.findUnique({
			where: { id: requestId },
		});

		if (!request) {
			throw new NotFoundException('친구 요청을 찾을 수 없습니다.');
		}

		if (request.receiverId !== userId) {
			throw new ForbiddenException('해당 요청을 거절할 권한이 없습니다.');
		}

		if (request.status !== 'PENDING') {
			throw new ConflictException('이미 처리된 요청입니다.');
		}

		await prisma.friendship.delete({
			where: { id: requestId },
		});

		return { message: '친구 요청을 거절했습니다.' };
	}

	/**
	 * 친구 삭제
	 */
	async removeFriend(userId: number, friendshipId: number) {
		const friendship = await prisma.friendship.findUnique({
			where: { id: friendshipId },
		});

		if (!friendship) {
			throw new NotFoundException('친구 관계를 찾을 수 없습니다.');
		}

		if (friendship.senderId !== userId && friendship.receiverId !== userId) {
			throw new ForbiddenException('해당 친구를 삭제할 권한이 없습니다.');
		}

		await prisma.friendship.delete({
			where: { id: friendshipId },
		});

		return { message: '친구를 삭제했습니다.' };
	}

	/**
	 * 사용자 차단
	 */
	async blockUser(userId: number, targetUserId: number) {
		if (userId === targetUserId) {
			throw new ForbiddenException('자신을 차단할 수 없습니다.');
		}

		// 기존 친구 관계 찾기
		const existing = await prisma.friendship.findFirst({
			where: {
				OR: [
					{ senderId: userId, receiverId: targetUserId },
					{ senderId: targetUserId, receiverId: userId },
				],
			},
		});

		if (existing) {
			// 기존 관계가 있으면 BLOCKED로 업데이트
			await prisma.friendship.update({
				where: { id: existing.id },
				data: {
					status: 'BLOCKED',
					senderId: userId, // 차단한 사람을 sender로
					receiverId: targetUserId,
				},
			});
		} else {
			// 없으면 새로 생성
			await prisma.friendship.create({
				data: {
					senderId: userId,
					receiverId: targetUserId,
					status: 'BLOCKED',
				},
			});
		}

		return { message: '사용자를 차단했습니다.' };
	}

	/**
	 * 차단 해제
	 */
	async unblockUser(userId: number, targetUserId: number) {
		const blocked = await prisma.friendship.findFirst({
			where: {
				senderId: userId,
				receiverId: targetUserId,
				status: 'BLOCKED',
			},
		});

		if (!blocked) {
			throw new NotFoundException('차단된 사용자를 찾을 수 없습니다.');
		}

		await prisma.friendship.delete({
			where: { id: blocked.id },
		});

		return { message: '차단을 해제했습니다.' };
	}

	/**
	 * 차단 목록 조회
	 */
	async getBlockedUsers(userId: number) {
		const blocked = await prisma.friendship.findMany({
			where: {
				senderId: userId,
				status: 'BLOCKED',
			},
			include: {
				Receiver: {
					select: {
						id: true,
						nickname: true,
						email: true,
						avatar: true,
					},
				},
			},
			orderBy: { updatedAt: 'desc' },
		});

		return blocked.map((b) => ({
			id: b.id,
			userId: b.Receiver.id,
			name: b.Receiver.nickname,
			email: b.Receiver.email,
			avatar: b.Receiver.avatar,
			blockedAt: b.updatedAt,
		}));
	}
}

