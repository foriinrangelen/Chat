import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateChannelDto {
	@ApiProperty({ example: '공지사항 (수정)', description: '채널 이름', required: false })
	@IsString()
	@IsOptional()
	name?: string;

	@ApiProperty({ example: true, description: '비공개 여부', required: false })
	@IsBoolean()
	@IsOptional()
	private?: boolean;
}

