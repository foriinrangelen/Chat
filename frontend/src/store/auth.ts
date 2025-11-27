// frontend/src/store/auth.ts
import { atomWithStorage } from "jotai/utils";

/**
 * 인증 상태 Atom
 */
export const isAuthenticatedAtom = atomWithStorage<boolean>(
  "isAuthenticated",
  false
);

/**
 * Access Token Atom
 */
export const accessTokenAtom = atomWithStorage<string | null>(
  "accessToken",
  null
);

/**
 * Refresh Token Atom
 */
export const refreshTokenAtom = atomWithStorage<string | null>(
  "refreshToken",
  null
);

/**
 * 모든 인증 토큰 초기화 (로그아웃 시 사용)
 */
export const clearAuthTokens = () => {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
