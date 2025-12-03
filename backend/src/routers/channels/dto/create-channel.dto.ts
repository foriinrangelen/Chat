// src/routers/channels/dto/create-channel.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateChannelDto {
	@ApiProperty({ example: '프론트엔드 스터디', description: '채널 이름' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	name: string;

	@ApiProperty({ example: 'React, Vue, Angular 스터디 그룹', description: '채널 설명', required: false })
	@IsString()
	@IsOptional()
	@MaxLength(200)
	description?: string;

	@ApiProperty({ example: 'react', description: '아이콘 (언어 코드, 이니셜, URL)', required: false })
	@IsString()
	@IsOptional()
	icon?: string;

	@ApiProperty({ example: 'language', description: '아이콘 타입 (initial/language/custom)', required: false })
	@IsString()
	@IsOptional()
	iconType?: string;

	@ApiProperty({ example: '#61DAFB', description: '아이콘 배경색', required: false })
	@IsString()
	@IsOptional()
	iconColor?: string;
}
