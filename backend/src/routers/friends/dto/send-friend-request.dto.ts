// src/routers/friends/dto/send-friend-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendFriendRequestDto {
	@ApiProperty({ example: 2, description: '친구 요청 받을 사용자 ID' })
	@IsNumber()
	@IsNotEmpty()
	receiverId: number;

	@ApiProperty({ example: '안녕하세요! 친구 추가 부탁드립니다.', description: '친구 요청 메시지', required: false })
	@IsString()
	@IsOptional()
	@MaxLength(200)
	message?: string;
}

