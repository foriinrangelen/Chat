import { atom } from "jotai";

export type Friend = {
  id: number;
  name: string;
  isOnline: boolean;
};

export type Channel = {
  id: number;
  name: string;
  serverId: number;
};

export type Server = {
  id: number;
  name: string;
  icon: string; // URL or initial
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

// Mock Data
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

export const MOCK_SERVERS: Server[] = [
  { id: 1, name: "프론트엔드 스터디", icon: "프" },
  { id: 2, name: "백엔드팀", icon: "백" },
  { id: 3, name: "디자인팀", icon: "디" },
  { id: 4, name: "데이터베이스팀", icon: "데" },
  { id: 5, name: "인프라팀", icon: "인" },
  { id: 6, name: "모바일팀", icon: "모" },
  { id: 7, name: "데이터베이스팀", icon: "데" },
  { id: 8, name: "인프라팀", icon: "인" },
  { id: 9, name: "모바일팀", icon: "모" },
  { id: 10, name: "데이터베이스팀", icon: "데" },
  { id: 11, name: "인프라팀", icon: "인" },
  { id: 12, name: "모바일팀", icon: "모" },
];

export const MOCK_CHANNELS: Channel[] = [
  { id: 101, name: "일반", serverId: 1 },
  { id: 102, name: "공지사항", serverId: 1 },
  { id: 103, name: "질문", serverId: 1 },
  { id: 201, name: "백엔드-일반", serverId: 2 },
  { id: 301, name: "디자인-피드백", serverId: 3 },
];

export const MOCK_DMS: DirectMessage[] = [
  { id: 1, userName: "김철수", isOnline: true },
  { id: 2, userName: "이영희", isOnline: false },
  { id: 3, userName: "박민수", isOnline: true },
  { id: 4, userName: "윤서연", isOnline: false },
  { id: 5, userName: "한소희", isOnline: true },
  { id: 6, userName: "이선진", isOnline: true },
];

export const MOCK_FRIEND_REQUESTS: FriendRequest[] = [
  { id: 1, name: "정다은", message: "안녕하세요! 친구 추가 부탁드립니다." },
  { id: 2, name: "강민호", message: "같이 스터디하실래요?" },
  { id: 3, name: "윤서연", message: "반갑습니다~" },
];

// Atoms
export const selectedServerAtom = atom<Server | null>(null); // null이면 친구/DM 화면
export const friendRequestCountAtom = atom(MOCK_FRIEND_REQUESTS.length);
