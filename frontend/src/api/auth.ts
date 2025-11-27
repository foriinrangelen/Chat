// frontend/src/api/auth.ts
import { apiClient } from "./client";
import type { SignupRequest, LoginRequest, AuthResponse } from "@/types/auth";

/**
 * 회원가입 API
 */
export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/signup", data);
  return response.data;
};

/**
 * 로그인 API
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);
  return response.data;
};

/**
 * 로그아웃 API (추후 백엔드 활성화 시 사용)
 */
export const logout = async (): Promise<void> => {
  await apiClient.get("/auth/logout");
};

/**
 * 토큰 갱신 API (추후 백엔드 활성화 시 사용)
 */
export const refreshTokens = async (): Promise<AuthResponse> => {
  const response = await apiClient.get<AuthResponse>("/auth/refresh");
  return response.data;
};
