import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		// [구역 A: 전처리]
		// 여기에 작성된 코드는 컨트롤러가 실행되기 "전"에 실행됩니다.
		console.log('Before Controller Execution');
		// 1. next.handle(): 컨트롤러의 메서드를 실행시킵니다.
		//    이 시점에서 컨트롤러 로직이 수행되고 결과값이 Observable(스트림) 형태로 나옵니다.
		return next.handle().pipe(
			// [구역 B: 후처리]
			// pipe() 내부의 연산자들은 컨트롤러가 값을 리턴한 "후"에 실행됩니다.
			// 2. pipe & map: RxJS 연산자를 사용하여 "나가는 데이터"를 조작합니다.
			// data: unknown - 임시, 나중에 수정
			map((data: unknown) =>
				// 3. 삼항 연산자 로직:
				//    - 데이터가 undefined면 -> null로 변경
				//    - 데이터가 값이 있으면 -> 원래 값(data) 그대로 전달
				data === undefined ? null : data,
			),
		);
	}
}

// 미들웨어는 미들웨어는 구조상 "컨트롤러보다 무조건 앞"에 실행되는 구조
// (res.on('finish') 같은걸로 끝나는 시점은 알 수 있지만 데이터조작은 불가능)
// 인터셉터란 메인컨트롤러가 있으면 컨트롤러 실행전이나 실행후에 특정동작을 넣어줄 수 있음
// => 일반적으로 컨트롤러에서 return 한데이터를 한번더 가공할때 사용?

//요청 > [인터셉터 진입] > [컨트롤러] > [인터셉터 탈출] > 응답
//       (1. 전처리)     (데이터 리턴)    (2. 후처리)

// 인터셉터는 관점 지향 프로그래밍 (AOP) 기법 에서 영감을 받은 여러 가지 유용한 기능을 갖추고 있습니다 .
// 이를 통해 다음과 같은 작업을 수행할 수 있습니다.
// 1. 메서드 실행 전/후에 추가 로직을 바인딩합니다.
// 2. 함수에서 반환된 결과를 변환합니다.
// 3. 함수에서 발생한 예외를 변환합니다.
// 4. 기본 기능 동작을 확장합니다
// 5. 특정 조건(예: 캐싱 목적)에 따라 함수를 완전히 재정의합니다.

// 인터셉터 사용 예시( 데이터 흐름에서의 작업 예시 )
// A > B > C > D
// A > E > D
// A > G > H > D
// A > I > D
// 같은 상황에서 A 와 D 같이 중복되는 부분을 인터셉터로 처리하면 좋다
