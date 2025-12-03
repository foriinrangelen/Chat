// src/routers/users/entities/user.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UserEntity {
	@ApiProperty({ description: 'ID', example: 1 })
	@IsNumber()
	id: number;

	@ApiProperty({
		example: 'user@example.com',
		description: '이메일',
		required: true,
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		example: 'nickname123',
		description: '닉네임',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	@Length(1, 20)
	nickname: string;

	@ApiProperty({
		example: 'StrongPass1!',
		description: '비밀번호',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	@Length(8, 30)
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
		message: '비밀번호는 최소 8자, 하나 이상의 문자, 숫자 및 특수문자를 포함해야 합니다.',
	})
	password: string;

	@ApiProperty({ description: '프로필 이미지 URL', required: false, nullable: true })
	@IsString()
	@IsOptional()
	avatar: string | null;

	@ApiProperty({ description: '상태 메시지', required: false, nullable: true })
	@IsString()
	@IsOptional()
	@Length(0, 100)
	statusMessage: string | null;

	@ApiProperty({ description: '해싱된 리프레시 토큰', required: false, nullable: true })
	hashedRefreshToken: string | null;

	@ApiProperty({ description: '온라인 상태', default: false })
	@IsBoolean()
	isOnline: boolean;

	@ApiProperty({ description: '마지막 접속 시간', required: false, nullable: true })
	@IsDate()
	@IsOptional()
	lastSeenAt: Date | null;

	@ApiProperty({ description: '생성일' })
	@IsDate()
	createdAt: Date;

	@ApiProperty({ description: '수정일' })
	@IsDate()
	updatedAt: Date;

	@ApiProperty({ description: '삭제일', required: false, nullable: true })
	@IsDate()
	@IsOptional()
	deletedAt: Date | null;
}
