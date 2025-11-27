// frontend/src/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useNavigate } from "@tanstack/react-router";
import { login, signup } from "@api/auth";
import {
  isAuthenticatedAtom,
  accessTokenAtom,
  refreshTokenAtom,
  clearAuthTokens,
} from "@/store/auth";
import type { LoginRequest, SignupRequest, AuthResponse } from "@/types/auth";

/**
 * 로그인 Mutation Hook
 */
export const useLogin = () => {
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setRefreshToken = useSetAtom(refreshTokenAtom);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response: AuthResponse) => {
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setIsAuthenticated(true);
      navigate({ to: "/" });
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
    },
  });
};

/**
 * 회원가입 Mutation Hook
 */
export const useSignup = () => {
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setRefreshToken = useSetAtom(refreshTokenAtom);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SignupRequest) => signup(data),
    onSuccess: (response: AuthResponse) => {
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setIsAuthenticated(true);
      navigate({ to: "/" });
    },
    onError: (error) => {
      console.error("회원가입 실패:", error);
    },
  });
};

/**
 * 로그아웃 Hook
 */
export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthTokens();
    navigate({ to: "/AuthenticationForm" });
  };

  return { logout: handleLogout };
};
