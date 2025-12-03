// src/routers/dms/dto/create-dm.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDmDto {
	@ApiProperty({ example: 2, description: '상대방 사용자 ID' })
	@IsNumber()
	@IsNotEmpty()
	receiverId: number;
}
