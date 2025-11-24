import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// 모든 라우트에 /api 접두사 추가
	// 글로벌 prefix 설정 (Swagger 제외)
	app.setGlobalPrefix('api', {
		exclude: ['docs'], // Swagger 경로 제외
	});
	// 스웨거 추가
	//prettier-ignore
	const config = new DocumentBuilder()
	.setTitle('Cats example').setDescription('The cats API description')
	.setVersion('1.0')
	.addCookieAuth('connect.sid')
	.addTag('cats')
	.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, documentFactory);

	console.log(`Application is running on port ${process.env.PORT ?? 3000}`);
	await app.listen(process.env.PORT ?? 3000);
}
// bootstrap();
void bootstrap();
