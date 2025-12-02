import { ApiProperty } from '@nestjs/swagger';

export class DMUserDto {
	@ApiProperty({ example: 1, description: '사용자 ID' })
	id: number;

	@ApiProperty({ example: '홍길동', description: '닉네임' })
	nickname: string;

	@ApiProperty({ example: 'user@example.com', description: '이메일' })
	email: string;
}

export class DMResponseDto {
	@ApiProperty({ example: 1, description: 'DM ID' })
	id: number;

	@ApiProperty({ type: DMUserDto, description: '상대방 정보' })
	user: DMUserDto;

	@ApiProperty({ example: '안녕하세요!', description: '마지막 메시지', nullable: true })
	lastMessage: string | null;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '마지막 메시지 시간' })
	lastMessageAt: Date;
}

export class DMMessageResponseDto {
	@ApiProperty({ example: 1, description: '메시지 ID' })
	id: number;

	@ApiProperty({ example: '안녕하세요!', description: '메시지 내용' })
	content: string;

	@ApiProperty({ type: DMUserDto, description: '작성자 정보' })
	user: DMUserDto;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '생성일시' })
	createdAt: Date;
}

export class DMCreateResponseDto {
	@ApiProperty({ example: 1, description: 'DM ID' })
	id: number;

	@ApiProperty({ example: 1, description: '워크스페이스 ID' })
	workspaceId: number;

	@ApiProperty({ example: 1, description: '발신자 ID' })
	senderId: number;

	@ApiProperty({ example: 2, description: '수신자 ID' })
	receiverId: number;
}

