import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {
	@ApiProperty({ example: '공지사항', description: '채널 이름' })
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ example: 1, description: '워크스페이스 ID' })
	@IsNumber()
	@IsNotEmpty()
	workspaceId: number;

	@ApiProperty({ example: false, description: '비공개 여부', required: false })
	@IsBoolean()
	@IsOptional()
	private?: boolean;
}

