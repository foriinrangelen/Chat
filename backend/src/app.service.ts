import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
	// constructor(@Inject('CUSTOM_KEY') private readonly customKey: string) {}
	// 같이 커스텀 프로바이더 사용가능
	// constructor(private readonly configService: ConfigService) {}
	constructor() {}
	getHello(): string {
		// this.configService.get('환경변수명') 으로 가져올 수 있게된다
		// 테스트에 용이(nest에서 전체를 사용가능)
		// console.log(this.configService.get('DATABASE_URL'));
		return 'Hello World!';
		// return `Hello World! ${process.env.DATABASE_URL}`;
	}
}
