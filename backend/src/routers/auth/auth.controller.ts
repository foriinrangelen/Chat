import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JoinDto } from './dto/join.dto';
import { LoginDto } from './dto/login.dto';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { prisma } from '../../lib/prisma';
import { User } from '../../decorators/user.decorator';
import type { JwtPayload, JwtPayloadWithRefreshToken } from '../../common/types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiOperation({ summary: '회원가입' })
	@Post('signup')
	signup(@Body() joinDto: JoinDto) {
		return this.authService.signup(joinDto);
	}

	@ApiOperation({ summary: '로그인' })
	@Post('login')
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: '로그아웃' })
	@UseGuards(AccessTokenGuard)
	@Post('logout')
	logout(@User() user: JwtPayload) {
		return this.authService.logout(user.sub);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: '토큰 재발급' })
	@UseGuards(RefreshTokenGuard)
	@Post('refresh')
	refreshTokens(@User() user: JwtPayloadWithRefreshToken) {
		return this.authService.refreshTokens(user.sub, user.refreshToken);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: '현재 사용자 정보 조회' })
	@UseGuards(AccessTokenGuard)
	@Get('me')
	async getMe(@User() user: JwtPayload) {
		const userData = await prisma.user.findUnique({
			where: { id: user.sub },
			select: {
				id: true,
				email: true,
				nickname: true,
				createdAt: true,
			},
		});
		return userData;
	}
}
