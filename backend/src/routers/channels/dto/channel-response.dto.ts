// src/routers/channels/dto/channel-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ChannelResponseDto {
	@ApiProperty({ example: 1, description: '채널 ID' })
	id: number;

	@ApiProperty({ example: '프론트엔드 스터디', description: '채널 이름' })
	name: string;

	@ApiProperty({ example: 'React, Vue, Angular 스터디 그룹', description: '채널 설명', required: false })
	description?: string;

	@ApiProperty({ example: 'react', description: '아이콘', required: false })
	icon?: string;

	@ApiProperty({ example: 'language', description: '아이콘 타입', required: false })
	iconType?: string;

	@ApiProperty({ example: '#61DAFB', description: '아이콘 색상', required: false })
	iconColor?: string;

	@ApiProperty({ example: 1, description: '방장 ID' })
	ownerId: number;

	@ApiProperty({ example: 'nickname123', description: '방장 닉네임', required: false })
	ownerName?: string;

	@ApiProperty({ example: 5, description: '멤버 수' })
	memberCount: number;

	@ApiProperty({ example: 3, description: '텍스트 채널 수', required: false })
	textChannelCount?: number;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '생성일' })
	createdAt: Date;
}

export class TextChannelResponseDto {
	@ApiProperty({ example: 1, description: '텍스트 채널 ID' })
	id: number;

	@ApiProperty({ example: '일반', description: '텍스트 채널 이름' })
	name: string;

	@ApiProperty({ example: 1, description: '채널 ID' })
	channelId: number;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '생성일' })
	createdAt: Date;
}

export class ChannelMessageResponseDto {
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
