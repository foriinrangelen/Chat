import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { AuthModule } from './routers/auth/auth.module';
import { ChannelsModule } from './routers/channels/channels.module';
import { DmsModule } from './routers/dms/dms.module';
import { FriendsModule } from './routers/friends/friends.module';
import { ChatModule } from './gateways/chat/chat.module';

// // 같이 외부에서 비밀키 가져올때 사용
// const getEnv = async() => {
// 	const secretKey axios = await axios.get('https://api.example.com/env');
// 	return {
// 		databaseUrl: secretKey.data
// 	};
// };

@Module({
	// imports: [ConfigModule.forRoot({ isGlobal: true, load: [getEnv] })],

	// imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, WorkspacesModule, ChannelsModule, DmsModule],
	// imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env.${process.env.NODE_ENV || 'development'}` }), UsersModule, WorkspacesModule, ChannelsModule, DmsModule],
	imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, ChannelsModule, DmsModule, FriendsModule, ChatModule],
	// nest g co board 로 Controller로 생성하면 자동으로 model 안에 Controllers 배열안에 추가
	// 만약 module이 만들어져 있었더라면 imports 배열안에 BoardModule이 추가가되고 Controllers배열안에는 추가 X
	// 그래서 항상 controller를 먼저 생성할 것인지 module을 먼저 생성할 것인지 생각하기
	// 기본적으로 module을 먼저 생성해야 깔끔
	// 한번에 설치 nest g res users
	controllers: [AppController],
	// providers: [AppService, ConfigService],
	providers: [AppService],
	// 에서 providers의 원형은
	// providers: [
	// 	{
	// 		provide: APP_FILTER,
	// 		useClass: AllExceptionsFilter,
	// useClass 는 클래스를 사용하여 객체를 생성하는 방식
	// useFactory 는 함수를 사용하여 객체를 생성하는 방식
	// useValue 는 값을 사용하여 객체를 생성하는 방식
	// 	},
	// ], 의 형태(reflect metadata 사용)

	// 커스텀해보기
	// providers: [
	// 	{
	// 		provide: 'CUSTOM_KEY',
	// 		useValue: 'CUSTOM_VALUE',
	// 	},
	// ]
})

// 만든 middleware를 전역적으로 사용하기 위해 AppModule에 등록해줘야하며
// 등록하기 위해서는 NestModule을 구현 해야한다
export class AppModule implements NestModule {
	// 이 configure() method를 필수적으로 구현해줘야 한다
	configure(consumer: MiddlewareConsumer) {
		// .forRoutes('*'); : 어디에 적용할지 *은 전체 라우터, 특정경로라면 특정경로에만 등록
		// ex ) consumer.apply(LoggingMiddleware).forRoutes('board');
		// 여러개의 middleware를 등록하고싶다면 apply()에 추가
		consumer.apply(LoggingMiddleware).forRoutes('*');
	}
}
