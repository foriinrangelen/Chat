import { ApiProperty } from '@nestjs/swagger';

export class ChannelResponseDto {
	@ApiProperty({ example: 1, description: '채널 ID' })
	id: number;

	@ApiProperty({ example: '일반', description: '채널 이름' })
	name: string;

	@ApiProperty({ example: false, description: '비공개 여부' })
	private: boolean;

	@ApiProperty({ example: 10, description: '멤버 수' })
	memberCount: number;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '생성일시' })
	createdAt: Date;
}

export class ChannelDetailResponseDto {
	@ApiProperty({ example: 1, description: '채널 ID' })
	id: number;

	@ApiProperty({ example: '일반', description: '채널 이름' })
	name: string;

	@ApiProperty({ example: false, description: '비공개 여부' })
	private: boolean;

	@ApiProperty({ example: 1, description: '워크스페이스 ID' })
	workspaceId: number;

	@ApiProperty({ example: '프론트엔드 스터디', description: '워크스페이스 이름' })
	workspaceName: string;

	@ApiProperty({ type: [Object], description: '멤버 목록' })
	members: MemberDto[];

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '생성일시' })
	createdAt: Date;
}

export class MemberDto {
	@ApiProperty({ example: 1, description: '사용자 ID' })
	id: number;

	@ApiProperty({ example: '홍길동', description: '닉네임' })
	nickname: string;

	@ApiProperty({ example: 'user@example.com', description: '이메일' })
	email: string;
}

export class MessageResponseDto {
	@ApiProperty({ example: 1, description: '메시지 ID' })
	id: number;

	@ApiProperty({ example: '안녕하세요!', description: '메시지 내용' })
	content: string;

	@ApiProperty({ type: MemberDto, description: '작성자 정보' })
	user: MemberDto;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '생성일시' })
	createdAt: Date;
}

