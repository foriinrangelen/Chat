import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// CORS 설정 추가
	app.enableCors({
		origin: true, // 개발 환경: 모든 도메인 허용
		credentials: true,
	});

	// 글로벌 prefix 설정 (Swagger 제외)
	app.setGlobalPrefix('api', {
		exclude: ['docs'], // Swagger 경로 제외
	});
	// 전역 필터 등록
	app.useGlobalFilters(new HttpExceptionFilter());

	// dto들 전역으로 한번에 검증하기위해 등록
	app.useGlobalPipes(
		new ValidationPipe({
			// 요청 데이터를 자동으로 변환
			transform: true,
			// 요청 데이터에서 정의되지 않은 속성을 제거
			whitelist: true,
			// 요청 데이터에서 정의되지 않은 속성이 있으면 에러 발생
			forbidNonWhitelisted: true,
		}),
	);
	// 스웨거 추가
	//prettier-ignore
	const config = new DocumentBuilder()
		.setTitle('RealTime Chat API')
		.setDescription('The RealTime Chat API description')
		.setVersion('1.0')
		.addCookieAuth('connect.sid')
		.addTag('auth')
		.addTag('users')
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, documentFactory);

	console.log(`Application is running on port ${process.env.PORT ?? 3000}`);
	await app.listen(process.env.PORT ?? 3000);
}
// bootstrap();
void bootstrap();
