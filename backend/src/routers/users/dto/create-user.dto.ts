import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({ example: 'user@example.com', description: '이메일' })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ example: '홍길동', description: '닉네임' })
	@IsString()
	@IsNotEmpty()
	nickname: string;

	@ApiProperty({ example: 'password123!', description: '비밀번호 (최소 8자)' })
	@IsString()
	@MinLength(8)
	@IsNotEmpty()
	password: string;
}

