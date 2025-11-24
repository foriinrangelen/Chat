import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				password: true,
			},
		});
	}

	async join(email: string, nickname: string, password: string) {
		const user = await this.prisma.user.findUnique({
			where: { email },
		});
		if (user) {
			throw new ForbiddenException('이미 존재하는 사용자입니다');
		}
		const hashedPassword = await bcrypt.hash(password, 12);
		try {
			return await this.prisma.$transaction(async (tx) => {
				const returned = await tx.user.create({
					data: {
						email,
						nickname,
						password: hashedPassword,
					},
				});
				await tx.workspaceMember.create({
					data: {
						UserId: returned.id,
						WorkspaceId: 1,
					},
				});
				await tx.channelMember.create({
					data: {
						UserId: returned.id,
						ChannelId: 1,
					},
				});
				return true;
			});
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
