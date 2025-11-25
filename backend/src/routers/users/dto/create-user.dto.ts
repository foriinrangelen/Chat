import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({
		example: 'user@example.com',
		description: '이메일',
		required: true,
	})
	@IsEmail()
	@IsNotEmpty()
	public email!: string;

	@ApiProperty({
		example: 'nickname123',
		description: '닉네임',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	@Length(1, 20)
	public nickname!: string;

	@ApiProperty({
		example: 'StrongPass1!',
		description: '비밀번호',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	@Length(8, 30)
	// 최소 하나의 영문자, 숫자, 특수문자 포함 (선택사항이지만 현대적 보안에 권장)
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
		message: '비밀번호는 최소 8자, 하나 이상의 문자, 숫자 및 특수문자를 포함해야 합니다.',
	})
	public password!: string;
}
