// frontend/src/api/auth.ts
import { apiClient } from "./client";
import type { SignupRequest, LoginRequest, AuthResponse, User } from "@/types/auth";

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
 * 로그아웃 API
 */
export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

/**
 * 토큰 갱신 API
 */
export const refreshTokens = async (): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/refresh");
  return response.data;
};

/**
 * 현재 사용자 정보 조회 API
 */
export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
};
