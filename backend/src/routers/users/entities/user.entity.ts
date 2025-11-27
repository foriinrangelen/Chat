import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '../../../generated/prisma/models/User'; // Prisma가 생성한 인터페이스
// import { Exclude } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString, Length, Matches } from 'class-validator';

// 'implements User'를 쓰면 Prisma 모델과 필드가 일치하는지 체크해줘서 좋습니다.
export class UserEntity implements UserModel {
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
	// @Exclude() // 중요: 응답(Response)으로 나갈 때 비밀번호 필드를 자동으로 제외합니다.
	password: string;

	@ApiProperty({ description: '해싱된 리프레시 토큰', required: false, nullable: true })
	hashedRefreshToken: string | null;

	@ApiProperty({ description: '생성일' })
	@IsDate()
	createdAt: Date;

	@ApiProperty({ description: '수정일' })
	@IsDate()
	updatedAt: Date;

	@ApiProperty({ description: '삭제일', required: false, nullable: true })
	@IsDate()
	deletedAt: Date | null;
}
