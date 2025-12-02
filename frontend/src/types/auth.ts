// frontend/src/types/auth.ts

/** 회원가입 요청 DTO */
export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

/** 로그인 요청 DTO */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 인증 응답 (토큰) */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

/** API 에러 응답 */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

/** 사용자 정보 */
export interface User {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
}

