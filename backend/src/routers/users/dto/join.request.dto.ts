import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// userEntity에서 회원가입에 필요한 필드만 가져와서 새로 만들기
export class JoinRequestDto {
	@IsEmail()
	@ApiProperty({ example: 'example@example.com', description: '이메일' })
	public email: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: 'example', description: '닉네임' })
	public nickname: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: 'password', description: '비밀번호' })
	public password: string;
}
