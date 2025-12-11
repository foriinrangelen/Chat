// common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();
		const err = exception.getResponse() as string | { message: string | string[]; error: string };

		// 에러 메시지 추출 (string일 수도, object일 수도 있음)
		const message = typeof err === 'string' ? err : err.message;

		response.status(status).json({
			success: false,
			code: status,
			data: message, // 혹은 error.message 등 팀 내 규칙에 따라
			timestamp: new Date().toISOString(),
		});
	}
}
