import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
	@ApiProperty({ example: 1, description: '사용자 ID' })
	id: number;

	@ApiProperty({ example: 'user@example.com', description: '이메일' })
	email: string;

	@ApiProperty({ example: '홍길동', description: '닉네임' })
	nickname: string;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '생성일시' })
	createdAt: Date;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '수정일시' })
	updatedAt: Date;
}

export class UserProfileResponseDto {
	@ApiProperty({ example: 1, description: '사용자 ID' })
	id: number;

	@ApiProperty({ example: 'user@example.com', description: '이메일' })
	email: string;

	@ApiProperty({ example: '홍길동', description: '닉네임' })
	nickname: string;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '생성일시' })
	createdAt: Date;

	@ApiProperty({ type: [Object], description: '참여 중인 워크스페이스 목록' })
	workspaces: WorkspaceInfoDto[];
}

export class WorkspaceInfoDto {
	@ApiProperty({ example: 1, description: '워크스페이스 ID' })
	id: number;

	@ApiProperty({ example: '프론트엔드 스터디', description: '워크스페이스 이름' })
	name: string;

	@ApiProperty({ example: 'frontend-study', description: '워크스페이스 URL' })
	url: string;
}

