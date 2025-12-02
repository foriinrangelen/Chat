import { atom } from "jotai";

// =============================================================================
// Types
// =============================================================================

export type Friend = {
  id: number;
  name: string;
  isOnline: boolean;
};

export type Channel = {
  id: number;
  name: string;
  icon: string;
  description?: string;
  ownerId: number; // 방장 ID
  iconType?: "initial" | "language" | "custom";
  iconColor?: string;
  customImage?: string;
};

export type Workspace = {
  id: number;
  name: string;
  channelId: number;
};

export type DirectMessage = {
  id: number;
  userName: string;
  isOnline: boolean;
};

export type FriendRequest = {
  id: number;
  name: string;
  message: string;
};

// =============================================================================
// Mock Data
// =============================================================================

// 현재 로그인한 사용자 ID (임시)
export const CURRENT_USER_ID = 1;

export const MOCK_FRIENDS: Friend[] = [
  { id: 1, name: "김철수", isOnline: true },
  { id: 2, name: "이영희", isOnline: false },
  { id: 3, name: "박민수", isOnline: true },
  { id: 4, name: "최지은", isOnline: true },
];

export const MOCK_ALL_FRIENDS: Friend[] = [
  { id: 1, name: "김철수", isOnline: true },
  { id: 2, name: "이영희", isOnline: false },
  { id: 3, name: "박민수", isOnline: true },
  { id: 4, name: "최지은", isOnline: true },
  { id: 5, name: "한소희", isOnline: false },
];

// 채널 초기 데이터
export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 1,
    name: "프론트엔드 스터디",
    icon: "react",
    description: "React, Vue, Angular 스터디 그룹",
    ownerId: 1,
    iconType: "language",
    iconColor: "#61DAFB",
  },
  {
    id: 2,
    name: "백엔드팀",
    icon: "nestjs",
    description: "NestJS, Spring Boot 개발팀",
    ownerId: 1,
    iconType: "language",
    iconColor: "#E0234E",
  },
  {
    id: 3,
    name: "디자인팀",
    icon: "디",
    description: "UI/UX 디자인 협업",
    ownerId: 2,
    iconType: "initial",
    iconColor: "#be4bdb",
  },
  {
    id: 4,
    name: "데브옵스",
    icon: "docker",
    description: "CI/CD, 인프라 관리",
    ownerId: 3,
    iconType: "language",
    iconColor: "#2496ED",
  },
];

// 워크스페이스 초기 데이터
export const INITIAL_WORKSPACES: Workspace[] = [
  // 프론트엔드 스터디 (channelId: 1)
  { id: 101, name: "일반", channelId: 1 },
  { id: 102, name: "공지사항", channelId: 1 },
  { id: 103, name: "질문-답변", channelId: 1 },
  { id: 104, name: "코드-리뷰", channelId: 1 },

  // 백엔드팀 (channelId: 2)
  { id: 201, name: "일반", channelId: 2 },
  { id: 202, name: "공지사항", channelId: 2 },
  { id: 203, name: "API-설계", channelId: 2 },
  { id: 204, name: "데이터베이스", channelId: 2 },

  // 디자인팀 (channelId: 3)
  { id: 301, name: "일반", channelId: 3 },
  { id: 302, name: "피드백", channelId: 3 },
  { id: 303, name: "리소스-공유", channelId: 3 },

  // 데브옵스 (channelId: 4)
  { id: 401, name: "일반", channelId: 4 },
  { id: 402, name: "배포-알림", channelId: 4 },
  { id: 403, name: "장애-대응", channelId: 4 },
];

export const MOCK_DMS: DirectMessage[] = [
  { id: 1, userName: "김철수", isOnline: true },
  { id: 2, userName: "이영희", isOnline: false },
  { id: 3, userName: "박민수", isOnline: true },
  { id: 4, userName: "윤서연", isOnline: false },
  { id: 5, userName: "한소희", isOnline: true },
];

export const MOCK_FRIEND_REQUESTS: FriendRequest[] = [
  { id: 1, name: "정다은", message: "안녕하세요! 친구 추가 부탁드립니다." },
  { id: 2, name: "강민호", message: "같이 스터디하실래요?" },
  { id: 3, name: "윤서연", message: "반갑습니다~" },
];

// =============================================================================
// Atoms
// =============================================================================

export const channelsAtom = atom<Channel[]>(INITIAL_CHANNELS);
export const selectedChannelAtom = atom<Channel | null>(null);
export const selectedWorkspaceAtom = atom<Workspace | null>(null);
export const friendRequestCountAtom = atom(MOCK_FRIEND_REQUESTS.length);
export const workspacesAtom = atom<Workspace[]>(INITIAL_WORKSPACES);

// =============================================================================
// Helper Functions
// =============================================================================

// 채널 ID로 채널 가져오기 (atom 기반)
export const getChannelById = (
  channels: Channel[],
  channelId: number
): Channel | undefined => {
  return channels.find((ch) => ch.id === channelId);
};

// 현재 사용자가 채널의 방장인지 확인
export const isChannelOwner = (channel: Channel): boolean => {
  return channel.ownerId === CURRENT_USER_ID;
};

// 워크스페이스 ID로 워크스페이스 가져오기 (atom 기반)
export const getWorkspaceById = (
  workspaces: Workspace[],
  workspaceId: number
): Workspace | undefined => {
  return workspaces.find((ws) => ws.id === workspaceId);
};

// 채널 ID로 워크스페이스 목록 가져오기 (atom 기반)
export const getWorkspacesByChannelId = (
  workspaces: Workspace[],
  channelId: number
): Workspace[] => {
  return workspaces.filter((ws) => ws.channelId === channelId);
};

// 기존 호환성을 위한 alias
export const selectedServerAtom = selectedChannelAtom;
export const MOCK_CHANNELS = INITIAL_CHANNELS;
export const MOCK_SERVERS = INITIAL_CHANNELS;
export const MOCK_WORKSPACES = INITIAL_WORKSPACES;
