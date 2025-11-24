import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// @Token() JWT 토큰을 반환하는 데코레이터입니다.
// data 는 @User() 에서 ()안에 들어오는 값
export const Token = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	// 현재 실행 컨텍스트를 HTTP로 전환하고, 기본 Response 기능에 local 객체가 합쳐진(교차 타입) 응답 객체를 가져옵니다.
	const response = ctx.switchToHttp().getResponse<Response & { local: { jwt: string } }>();

	// 응답 객체 내부의 local 프로퍼티에 저장해둔 jwt 값을 꺼냅니다.
	const token = response.local.jwt;

	// 최종적으로 컨트롤러의 파라미터 자리에 이 JWT 토큰 문자열을 반환(주입)해 줍니다.
	return token;
});
