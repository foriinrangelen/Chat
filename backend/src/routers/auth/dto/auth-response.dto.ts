import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
	@ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Access Token' })
	accessToken: string;

	@ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Refresh Token' })
	refreshToken: string;
}

export class UserResponseDto {
	@ApiProperty({ example: 1, description: '사용자 ID' })
	id: number;

	@ApiProperty({ example: 'user@example.com', description: '이메일' })
	email: string;

	@ApiProperty({ example: '홍길동', description: '닉네임' })
	nickname: string;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '생성일시' })
	createdAt: Date;
}

