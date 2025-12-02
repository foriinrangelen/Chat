import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
	@ApiProperty({ example: '작업이 성공적으로 완료되었습니다.', description: '성공 메시지' })
	message: string;
}

export class ErrorResponseDto {
	@ApiProperty({ example: 400, description: 'HTTP 상태 코드' })
	statusCode: number;

	@ApiProperty({ example: '잘못된 요청입니다.', description: '에러 메시지' })
	message: string | string[];

	@ApiProperty({ example: 'Bad Request', description: '에러 타입', required: false })
	error?: string;
}

export class IdResponseDto {
	@ApiProperty({ example: 1, description: '생성된 리소스 ID' })
	id: number;
}

