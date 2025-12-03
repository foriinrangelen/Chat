// src/routers/users/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
	@ApiProperty({ example: 1, description: '사용자 ID' })
	id: number;

	@ApiProperty({ example: 'user@example.com', description: '이메일' })
	email: string;

	@ApiProperty({ example: 'nickname123', description: '닉네임' })
	nickname: string;

	@ApiProperty({ example: 'https://example.com/avatar.jpg', description: '프로필 이미지 URL', required: false })
	avatar?: string;

	@ApiProperty({ example: '열심히 코딩 중!', description: '상태 메시지', required: false })
	statusMessage?: string;

	@ApiProperty({ example: true, description: '온라인 상태' })
	isOnline: boolean;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '마지막 접속 시간', required: false })
	lastSeenAt?: Date;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '생성일' })
	createdAt: Date;
}

export class UserBasicResponseDto {
	@ApiProperty({ example: 1, description: '사용자 ID' })
	id: number;

	@ApiProperty({ example: 'nickname123', description: '닉네임' })
	nickname: string;

	@ApiProperty({ example: 'user@example.com', description: '이메일' })
	email: string;

	@ApiProperty({ example: 'https://example.com/avatar.jpg', description: '프로필 이미지 URL', required: false })
	avatar?: string;

	@ApiProperty({ example: true, description: '온라인 상태' })
	isOnline: boolean;

	@ApiProperty({ example: '열심히 코딩 중!', description: '상태 메시지', required: false })
	statusMessage?: string;
}
