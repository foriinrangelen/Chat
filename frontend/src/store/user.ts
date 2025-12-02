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
// Mock Data - 현재 로그인한 사용자
// =============================================================================

export const MOCK_CURRENT_USER: User = {
  id: 1,
  email: "user@example.com",
  nickname: "나",
  avatar: undefined,
  statusMessage: "열심히 코딩 중! 🚀",
  isOnline: true,
  lastSeenAt: new Date().toISOString(),
  createdAt: "2024-01-01T00:00:00.000Z",
};

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

export const currentUserAtom = atom<User | null>(MOCK_CURRENT_USER);
export const userSettingsAtom = atomWithStorage<UserSettings>(
  "userSettings",
  DEFAULT_SETTINGS
);

// 로딩 상태
export const isUserLoadingAtom = atom(false);

