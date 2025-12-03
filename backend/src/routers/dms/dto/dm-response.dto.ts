// src/routers/dms/dto/dm-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class DMResponseDto {
	@ApiProperty({ example: 1, description: 'DM ID' })
	id: number;

	@ApiProperty({ description: '상대방 사용자 정보' })
	user: {
		id: number;
		nickname: string;
		email: string;
		avatar?: string;
		isOnline: boolean;
		statusMessage?: string;
	};

	@ApiProperty({ example: '안녕하세요!', description: '마지막 메시지', required: false })
	lastMessage?: string;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '마지막 메시지 시간' })
	lastMessageAt: Date;
}

export class DMDetailResponseDto {
	@ApiProperty({ example: 1, description: 'DM ID' })
	id: number;

	@ApiProperty({ description: '상대방 사용자 정보' })
	user: {
		id: number;
		nickname: string;
		email: string;
		avatar?: string;
		isOnline: boolean;
		statusMessage?: string;
	};

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '생성일' })
	createdAt: Date;
}

export class DMMessageResponseDto {
	@ApiProperty({ example: 1, description: '메시지 ID' })
	id: number;

	@ApiProperty({ example: '안녕하세요!', description: '메시지 내용' })
	content: string;

	@ApiProperty({ description: '작성자 정보' })
	user: {
		id: number;
		nickname: string;
		email: string;
		avatar?: string;
		isOnline: boolean;
	};

	@ApiProperty({ example: false, description: '수정 여부' })
	isEdited: boolean;

	@ApiProperty({ description: '답장 대상 메시지 정보', required: false })
	replyTo?: {
		id: number;
		content: string;
		userName: string;
	};

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '생성일' })
	createdAt: Date;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '수정일', required: false })
	updatedAt?: Date;
}
