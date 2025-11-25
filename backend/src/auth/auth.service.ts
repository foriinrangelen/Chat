// import { ForbiddenException, Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { ForbiddenException, Injectable, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../routers/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
	) {}

	/**
	 * 회원가입
	 */
	async signup(dto: CreateUserDto) {
		// 이메일 중복 체크
		const userExists = await prisma.user.findUnique({
			where: { email: dto.email },
		});
		if (userExists) {
			throw new ConflictException('이미 존재하는 이메일입니다.');
		}

		// 비밀번호 해싱
		const hashedPassword = await this.hashData(dto.password);

		// 유저 생성
		const newUser = await prisma.user.create({
			data: {
				email: dto.email,
				nickname: dto.nickname,
				password: hashedPassword,
			},
		});

		// 토큰 발급
		const tokens = await this.getTokens(newUser.id, newUser.email);

		// Refresh Token 해싱 후 저장
		await this.updateRefreshToken(newUser.id, tokens.refreshToken);

		return tokens;
	}

	/**
	 * 로그인
	 */
	async login(dto: LoginDto) {
		const user = await prisma.user.findUnique({ where: { email: dto.email } });

		if (!user) throw new ForbiddenException('이메일 또는 비밀번호가 올바르지 않습니다.');

		const passwordMatches = await bcrypt.compare(dto.password, user.password);

		if (!passwordMatches) throw new ForbiddenException('이메일 또는 비밀번호가 올바르지 않습니다.');

		const tokens = await this.getTokens(user.id, user.email);

		await this.updateRefreshToken(user.id, tokens.refreshToken);

		return tokens;
	}

	/**
	 * 로그아웃 (Refresh Token 삭제)
	 */
	async logout(userId: number) {
		// hashedRefreshToken 필드를 null로 업데이트 (Prisma 스키마에 해당 필드가 있어야 함)
		// 스키마 업데이트가 반영되었는지 확인 필요 (hashedRefreshToken)
		await prisma.user.updateMany({
			where: { id: userId, hashedRefreshToken: { not: null } },
			data: { hashedRefreshToken: null },
		});
	}

	/**
	 * 토큰 재발급
	 */
	async refreshTokens(userId: number, refreshToken: string) {
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user || !user.hashedRefreshToken) {
			throw new ForbiddenException('Access Denied');
		}

		const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

		if (!refreshTokenMatches) {
			throw new ForbiddenException('Access Denied');
		}

		const tokens = await this.getTokens(user.id, user.email);
		await this.updateRefreshToken(user.id, tokens.refreshToken);

		return tokens;
	}

	/**
	 * 비밀번호 해싱
	 */
	async hashData(data: string) {
		return bcrypt.hash(data, 10);
	}

	/**
	 * Access, Refresh 토큰 생성
	 */
	async getTokens(userId: number, email: string) {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{
					sub: userId,
					email,
				},
				{
					secret: this.configService.get<string>('JWT_ACCESS_SECRET') || 'access-secret',
					expiresIn: '15m',
				},
			),
			this.jwtService.signAsync(
				{
					sub: userId,
					email,
				},
				{
					secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret',
					expiresIn: '7d',
				},
			),
		]);

		return {
			accessToken,
			refreshToken,
		};
	}

	/**
	 * Refresh Token 해싱 및 DB 저장
	 */
	async updateRefreshToken(userId: number, refreshToken: string) {
		const hash = await this.hashData(refreshToken);
		await prisma.user.update({
			where: { id: userId },
			data: { hashedRefreshToken: hash },
		});
	}
}
