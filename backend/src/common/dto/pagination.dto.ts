import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
	@ApiProperty({ example: 1, description: '페이지 번호', required: false, default: 1 })
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@IsOptional()
	page?: number = 1;

	@ApiProperty({ example: 50, description: '페이지당 항목 수', required: false, default: 50 })
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	@IsOptional()
	limit?: number = 50;
}

export class PaginatedResponseDto<T> {
	@ApiProperty({ description: '데이터 목록' })
	data: T[];

	@ApiProperty({ example: 100, description: '전체 항목 수' })
	total: number;

	@ApiProperty({ example: 1, description: '현재 페이지' })
	page: number;

	@ApiProperty({ example: 50, description: '페이지당 항목 수' })
	limit: number;

	@ApiProperty({ example: 2, description: '전체 페이지 수' })
	totalPages: number;
}

