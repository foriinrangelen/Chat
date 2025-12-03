// src/routers/dms/dto/send-dm.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendDmDto {
	@ApiProperty({ example: '안녕하세요!', description: '메시지 내용' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(2000)
	content: string;

	@ApiProperty({ example: 1, description: '답장 대상 메시지 ID', required: false })
	@IsNumber()
	@IsOptional()
	replyToId?: number;
}

export class EditDmMessageDto {
	@ApiProperty({ example: '수정된 메시지 내용', description: '수정할 메시지 내용' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(2000)
	content: string;
}
