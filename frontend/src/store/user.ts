import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// =============================================================================
// Types
// =============================================================================

export type User = {
  id: number;
  email: string;
  nickname: string;
  avatar?: string;
  statusMessage?: string;
  isOnline: boolean;
  lastSeenAt?: string;
  createdAt: string;
};

export type UserSettings = {
  theme: "light" | "dark" | "system";
  notifications: {
    sound: boolean;
    desktop: boolean;
    messages: boolean;
    friendRequests: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    allowFriendRequests: boolean;
  };
};

// =============================================================================
// Mock Data (개발용 - 프로덕션에서는 API로 대체)
// =============================================================================
// 
// 📌 아래 Mock 데이터들은 개발/테스트 용도입니다.
// 실제 프로덕션 환경에서는 로그인 후 /api/auth/me에서 사용자 정보를 가져옵니다.
// 
// 현재 사용자 정보 API: GET /api/auth/me
// =============================================================================

// -----------------------------------------------------------------------------
// 현재 로그인한 사용자 목업 데이터
// API: GET /api/auth/me
// -----------------------------------------------------------------------------
// export const MOCK_CURRENT_USER: User = {
//   id: 1,
//   email: "user@example.com",
//   nickname: "나",
//   avatar: undefined,
//   statusMessage: "열심히 코딩 중! 🚀",
//   isOnline: true,
//   lastSeenAt: new Date().toISOString(),
//   createdAt: "2024-01-01T00:00:00.000Z",
// };

// =============================================================================
// Default Settings (기본 설정값)
// =============================================================================

export const DEFAULT_SETTINGS: UserSettings = {
  theme: "light",
  notifications: {
    sound: true,
    desktop: true,
    messages: true,
    friendRequests: true,
  },
  privacy: {
    showOnlineStatus: true,
    allowFriendRequests: true,
  },
};

// =============================================================================
// Atoms
// =============================================================================
// 
// 📌 currentUserAtom은 로그인 후 /api/auth/me 응답으로 설정됩니다.
// 로그아웃 시 null로 초기화합니다.
// 
// 예시 (useAuth.ts에서):
// const { data: user } = useQuery({
//   queryKey: ['me'],
//   queryFn: () => getMe(),
//   enabled: isAuthenticated,
// });
// 
// useEffect(() => {
//   if (user) setCurrentUser(user);
// }, [user]);
// =============================================================================

// 현재 로그인한 사용자 (초기값: null - 로그인 전)
export const currentUserAtom = atom<User | null>(null);

// 사용자 설정 (localStorage에 저장)
export const userSettingsAtom = atomWithStorage<UserSettings>(
  "userSettings",
  DEFAULT_SETTINGS
);

// 로딩 상태
export const isUserLoadingAtom = atom(false);
