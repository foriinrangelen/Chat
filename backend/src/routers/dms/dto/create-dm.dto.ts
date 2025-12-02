import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDmDto {
	@ApiProperty({ example: 1, description: '워크스페이스 ID' })
	@IsNumber()
	@IsNotEmpty()
	workspaceId: number;

	@ApiProperty({ example: 2, description: '상대방 사용자 ID' })
	@IsNumber()
	@IsNotEmpty()
	receiverId: number;
}

