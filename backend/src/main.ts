import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

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
