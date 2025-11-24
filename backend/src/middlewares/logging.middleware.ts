// logging.middleware.ts
import { Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// NestJS에서는 Middleware를 만들기위해 NestMiddleware를 implements 해서 구현해야한다
export class LoggingMiddleware implements NestMiddleware {
	// private readonly logger = new Logger();

	// new Logger('')에 HTTP 넣게되면 HTTP 태그가 붙어서 로그를 출력할 때 태그가 붙어서 출력된다
	// nest에서는 console.log() 대신 Logger.log()를 주로 사용한다
	private readonly logger = new Logger('HTTP');
	// ✅이 use method를 구현해야한다✅
	use(request: Request, response: Response, next: NextFunction): void {
		const { ip, method, originalUrl } = request;
		// request.get('') - 헤더에서 가져오기
		// const userAgent = request.get('user-agent') || '-';
		const startTime = Date.now();

		// response.on('finish') - 응답이 완료되었을 때 실행
		// 마지막으로 비동기로 실행된다 (next() 실행 후 실행)
		response.on('finish', (): void => {
			const { statusCode } = response;
			const contentLength = response.get('content-length');
			const endTime = Date.now();
			const responseTime = endTime - startTime;
			// this.logger.log(`${method} ${originalUrl} - ${statusCode} ${contentLength ?? ''} ${userAgent} ${ip} - ${responseTime}ms`);
			this.logger.log(`${method} ${originalUrl} ${statusCode} - ${contentLength || ''} ${ip} - ${responseTime}ms`);
		});

		next();
	}
}
