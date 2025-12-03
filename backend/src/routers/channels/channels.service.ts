// src/routers/channels/channels.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChannelsService {
	/**
	 * 내 채널 목록 조회
	 */
	async getMyChannels(userId: number) {
		const channels = await prisma.channel.findMany({
			where: {
				deletedAt: null,
				Members: { some: { userId } },
			},
			include: {
				_count: { select: { Members: true, Workspaces: true } },
				Owner: { select: { id: true, nickname: true } },
			},
			orderBy: { createdAt: 'asc' },
		});

		return channels.map((ch) => ({
			id: ch.id,
			name: ch.name,
			description: ch.description,
			icon: ch.icon,
			iconType: ch.iconType,
			iconColor: ch.iconColor,
			ownerId: ch.ownerId,
			ownerName: ch.Owner.nickname,
			memberCount: ch._count.Members,
			workspaceCount: ch._count.Workspaces,
			createdAt: ch.createdAt,
		}));
	}

	/**
	 * 채널 생성
	 */
	async createChannel(userId: number, dto: CreateChannelDto) {
		const channel = await prisma.$transaction(async (tx) => {
			// 채널 생성
			const ch = await tx.channel.create({
				data: {
					name: dto.name,
					description: dto.description,
					icon: dto.icon,
					iconType: dto.iconType || 'initial',
					iconColor: dto.iconColor,
					ownerId: userId,
				},
			});

			// 생성자를 채널 멤버로 추가 (owner 역할)
			await tx.channelMember.create({
				data: {
					channelId: ch.id,
					userId: userId,
					role: 'owner',
				},
			});

			// 기본 워크스페이스 "일반" 생성
			await tx.workspace.create({
				data: {
					name: '일반',
					channelId: ch.id,
				},
			});

			return ch;
		});

		return {
			id: channel.id,
			name: channel.name,
			description: channel.description,
			icon: channel.icon,
			iconType: channel.iconType,
			iconColor: channel.iconColor,
			ownerId: channel.ownerId,
			createdAt: channel.createdAt,
		};
	}

	/**
	 * 채널 상세 조회
	 */
	async getChannel(channelId: number, userId: number) {
		const channel = await prisma.channel.findUnique({
			where: { id: channelId, deletedAt: null },
			include: {
				Owner: { select: { id: true, nickname: true, email: true } },
				Members: {
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
				},
				Workspaces: {
					orderBy: { createdAt: 'asc' },
				},
			},
		});

		if (!channel) {
			throw new NotFoundException('채널을 찾을 수 없습니다.');
		}

		// 멤버인지 확인
		const isMember = channel.Members.some((m) => m.userId === userId);
		if (!isMember) {
			throw new ForbiddenException('채널에 접근 권한이 없습니다.');
		}

		return {
			id: channel.id,
			name: channel.name,
			description: channel.description,
			icon: channel.icon,
			iconType: channel.iconType,
			iconColor: channel.iconColor,
			ownerId: channel.ownerId,
			owner: channel.Owner,
			members: channel.Members.map((m) => ({
				...m.User,
				role: m.role,
				joinedAt: m.createdAt,
			})),
			workspaces: channel.Workspaces.map((ws) => ({
				id: ws.id,
				name: ws.name,
				createdAt: ws.createdAt,
			})),
			createdAt: channel.createdAt,
		};
	}

	/**
	 * 채널 참가
	 */
	async joinChannel(channelId: number, userId: number) {
		const channel = await prisma.channel.findUnique({
			where: { id: channelId, deletedAt: null },
		});

		if (!channel) {
			throw new NotFoundException('채널을 찾을 수 없습니다.');
		}

		// 이미 멤버인지 확인
		const existing = await prisma.channelMember.findUnique({
			where: { channelId_userId: { channelId, userId } },
		});

		if (existing) {
			return { message: '이미 참가한 채널입니다.' };
		}

		await prisma.channelMember.create({
			data: { channelId, userId, role: 'member' },
		});

		return { message: '채널에 참가했습니다.' };
	}

	/**
	 * 채널 나가기
	 */
	async leaveChannel(channelId: number, userId: number) {
		const channel = await prisma.channel.findUnique({
			where: { id: channelId },
		});

		if (!channel) {
			throw new NotFoundException('채널을 찾을 수 없습니다.');
		}

		// 방장은 나갈 수 없음
		if (channel.ownerId === userId) {
			throw new ForbiddenException('채널 방장은 채널을 나갈 수 없습니다. 채널을 삭제하거나 방장을 위임하세요.');
		}

		await prisma.channelMember.delete({
			where: { channelId_userId: { channelId, userId } },
		});

		return { message: '채널에서 나갔습니다.' };
	}

	// =========================================================================
	// 워크스페이스 관련
	// =========================================================================

	/**
	 * 채널의 워크스페이스 목록 조회
	 */
	async getWorkspaces(channelId: number, userId: number) {
		// 멤버인지 확인
		const member = await prisma.channelMember.findUnique({
			where: { channelId_userId: { channelId, userId } },
		});

		if (!member) {
			throw new ForbiddenException('채널에 접근 권한이 없습니다.');
		}

		const workspaces = await prisma.workspace.findMany({
			where: { channelId },
			orderBy: { createdAt: 'asc' },
		});

		return workspaces.map((ws) => ({
			id: ws.id,
			name: ws.name,
			channelId: ws.channelId,
			createdAt: ws.createdAt,
		}));
	}

	/**
	 * 워크스페이스 생성
	 */
	async createWorkspace(channelId: number, userId: number, dto: CreateWorkspaceDto) {
		// 멤버인지 확인
		const member = await prisma.channelMember.findUnique({
			where: { channelId_userId: { channelId, userId } },
		});

		if (!member) {
			throw new ForbiddenException('채널에 접근 권한이 없습니다.');
		}

		// owner나 admin만 워크스페이스 생성 가능
		if (member.role !== 'owner' && member.role !== 'admin') {
			throw new ForbiddenException('워크스페이스를 생성할 권한이 없습니다.');
		}

		const workspace = await prisma.workspace.create({
			data: {
				name: dto.name,
				channelId: channelId,
			},
		});

		return {
			id: workspace.id,
			name: workspace.name,
			channelId: workspace.channelId,
			createdAt: workspace.createdAt,
		};
	}

	// =========================================================================
	// 메시지 관련
	// =========================================================================

	/**
	 * 워크스페이스 메시지 조회
	 */
	async getMessages(workspaceId: number, userId: number, page = 1, limit = 50) {
		const workspace = await prisma.workspace.findUnique({
			where: { id: workspaceId },
			include: { Channel: true },
		});

		if (!workspace) {
			throw new NotFoundException('워크스페이스를 찾을 수 없습니다.');
		}

		// 채널 멤버인지 확인
		const member = await prisma.channelMember.findUnique({
			where: { channelId_userId: { channelId: workspace.channelId, userId } },
		});

		if (!member) {
			throw new ForbiddenException('접근 권한이 없습니다.');
		}

		const messages = await prisma.workspaceMessage.findMany({
			where: { textChannelId: workspaceId },
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
	 * 워크스페이스 메시지 전송
	 */
	async sendMessage(workspaceId: number, userId: number, dto: SendMessageDto) {
		const workspace = await prisma.workspace.findUnique({
			where: { id: workspaceId },
			include: { Channel: true },
		});

		if (!workspace) {
			throw new NotFoundException('워크스페이스를 찾을 수 없습니다.');
		}

		// 채널 멤버인지 확인
		const member = await prisma.channelMember.findUnique({
			where: { channelId_userId: { channelId: workspace.channelId, userId } },
		});

		if (!member) {
			throw new ForbiddenException('접근 권한이 없습니다.');
		}

		const message = await prisma.workspaceMessage.create({
			data: {
				content: dto.content,
				textChannelId: workspaceId,
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
	 * 메시지 수정
	 */
	async editMessage(messageId: number, userId: number, content: string) {
		const message = await prisma.workspaceMessage.findUnique({
			where: { id: messageId },
		});

		if (!message) {
			throw new NotFoundException('메시지를 찾을 수 없습니다.');
		}

		if (message.userId !== userId) {
			throw new ForbiddenException('본인의 메시지만 수정할 수 있습니다.');
		}

		const updated = await prisma.workspaceMessage.update({
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
	 * 메시지 삭제
	 */
	async deleteMessage(messageId: number, userId: number) {
		const message = await prisma.workspaceMessage.findUnique({
			where: { id: messageId },
			include: {
				Workspace: {
					include: { Channel: true },
				},
			},
		});

		if (!message) {
			throw new NotFoundException('메시지를 찾을 수 없습니다.');
		}

		// 본인 메시지이거나 채널 방장인 경우 삭제 가능
		const isOwner = message.Workspace.Channel.ownerId === userId;
		if (message.userId !== userId && !isOwner) {
			throw new ForbiddenException('메시지를 삭제할 권한이 없습니다.');
		}

		await prisma.workspaceMessage.delete({
			where: { id: messageId },
		});

		return { message: '메시지가 삭제되었습니다.' };
	}
}
