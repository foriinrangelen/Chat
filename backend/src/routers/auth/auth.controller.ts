// import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JoinDto } from './dto/join.dto';
import { LoginDto } from './dto/login.dto';
// import { AccessTokenGuard } from './guards/accessToken.guard';
// import { RefreshTokenGuard } from './guards/refreshToken.guard';
// import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiOperation({ summary: '회원가입' })
	@Post('signup')
	signup(@Body() JoinDto: JoinDto) {
		console.log('AuthController');
		return this.authService.signup(JoinDto);
	}

	@ApiOperation({ summary: '로그인' })
	@Post('login')
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	// @ApiBearerAuth()
	// @ApiOperation({ summary: '로그아웃' })
	// @UseGuards(AccessTokenGuard)
	// @Get('logout')
	// logout(@Req() req: Request) {
	// 	const userId = req.user['sub'];
	// 	return this.authService.logout(userId);
	// }

	// @ApiBearerAuth()
	// @ApiOperation({ summary: '토큰 재발급' })
	// @UseGuards(RefreshTokenGuard)
	// @Get('refresh')
	// refreshTokens(@Req() req: Request) {
	// 	const userId = req.user['sub'];
	// 	const refreshToken = req.user['refreshToken'];
	// 	return this.authService.refreshTokens(userId, refreshToken);
	// }
}
