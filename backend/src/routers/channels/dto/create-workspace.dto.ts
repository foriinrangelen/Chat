// src/routers/channels/dto/create-workspace.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateWorkspaceDto {
	@ApiProperty({ example: '공지사항', description: '워크스페이스 이름' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	name: string;
}

