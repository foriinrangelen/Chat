import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
	@ApiProperty({ example: '안녕하세요!', description: '메시지 내용' })
	@IsString()
	@IsNotEmpty()
	content: string;
}

