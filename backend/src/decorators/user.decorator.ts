import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../routers/users/entities/user.entity';

// @User() 문법으로 사용할 수 있는 커스텀 파라미터 데코레이터를 생성합니다.
export const User = createParamDecorator<string>((data: unknown, ctx: ExecutionContext) => {
	// 현재 실행 컨텍스트를 HTTP로 전환하고, 기본 Request 기능에 UserEntity가 합쳐진(교차 타입) 객체를 가져옵니다.
	const request = ctx.switchToHttp().getRequest<Request & { user: UserEntity }>();

	// 요청 객체 내부에서 user 프로퍼티(Passport Guard가 인증 후 저장한 정보)를 꺼냅니다.
	const { user } = request;

	// 최종적으로 컨트롤러의 파라미터 자리에 이 user 객체를 반환(주입)해 줍니다.
	return user;
});

// =================================================================
// 1. HTTP 모드로 전환 (가장 많이 사용)
// =================================================================
// 용도: REST API, MVC 패턴, GraphQL(HTTP 기반)
// const http = ctx.switchToHttp();
// const req = http.getRequest(); // Express의 Request 객체
// const res = http.getResponse(); // Express의 Response 객체
// const next = http.getNext(); // Next 함수

// =================================================================
// 2. WebSocket 모드로 전환
// =================================================================
// 용도: 실시간 채팅, 알림, Socket.io, ws 어댑터 사용 시
// const ws = ctx.switchToWs();
// const client = ws.getClient(); // 연결된 소켓 클라이언트 객체 (socket)
// const payload = ws.getData(); // 소켓을 통해 전송된 실제 데이터 (message body)

// =================================================================
// 3. RPC(Remote Procedure Call) 모드로 전환
// =================================================================
// 용도: 마이크로서비스 간 통신 (TCP, Redis, Kafka, gRPC, RabbitMQ 등)
// const rpc = ctx.switchToRpc();
// const rpcData = rpc.getData(); // 전달받은 데이터 (Payload)
// const context = rpc.getContext(); // 메타데이터 (패킷 정보, 채널 정보 등)

// =================================================================
// +) 현재 실행 환경 확인하기
// =================================================================
// 현재 요청이 HTTP인지, WS인지, RPC인지 문자열로 반환 ('http' | 'ws' | 'rpc')
// 하나의 데코레이터를 여러 환경에서 공용으로 쓸 때 분기 처리에 유용함
// const type = ctx.getType();

// => ctx라는 하나의 객체로 http, ws, rpc 모드로 전환하고 각 모드에서 필요한 정보를 가져올 수 있다
// => 즉 각 환경간 데이터 교환이 쉽고 편리해진다
