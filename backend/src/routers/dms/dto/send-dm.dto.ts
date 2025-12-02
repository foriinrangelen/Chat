import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendDmDto {
	@ApiProperty({ example: '안녕하세요!', description: 'DM 내용' })
	@IsString()
	@IsNotEmpty()
	content: string;
}

