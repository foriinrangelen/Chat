import { atom } from "jotai";

// =============================================================================
// Types
// =============================================================================

export type MessageReaction = {
  emoji: string;
  users: number[]; // user IDs
};

export type MessageAttachment = {
  id: number;
  type: "image" | "file";
  name: string;
  url: string;
  size?: number;
};

export type Message = {
  id: number;
  content: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  isOnline: boolean;
  timestamp: string;
  date: string; // YYYY-MM-DD 형식
  edited?: boolean;
  editedAt?: string;
  reactions: MessageReaction[];
  attachments: MessageAttachment[];
  replyTo?: {
    id: number;
    userName: string;
    content: string;
  };
};

export type TypingUser = {
  userId: number;
  userName: string;
  timestamp: number;
};

// =============================================================================
// Mock Data (개발용 - 프로덕션에서는 API로 대체)
// =============================================================================
// 
// 📌 아래 Mock 데이터들은 개발/테스트 용도입니다.
// 실제 프로덕션 환경에서는 백엔드 API를 통해 데이터를 가져옵니다.
// 
// 채널 메시지 API:
// - GET /api/channels/text-channels/:textChannelId/messages
// - POST /api/channels/text-channels/:textChannelId/messages
// 
// DM 메시지 API:
// - GET /api/dms/:dmId/messages
// - POST /api/dms/:dmId/messages
// =============================================================================

// -----------------------------------------------------------------------------
// 날짜 헬퍼 함수
// -----------------------------------------------------------------------------
// const getDateString = (daysAgo: number): string => {
//   const date = new Date();
//   date.setDate(date.getDate() - daysAgo);
//   return date.toISOString().split("T")[0];
// };
//
// const TODAY = getDateString(0);
// const YESTERDAY = getDateString(1);
// const TWO_DAYS_AGO = getDateString(2);

// -----------------------------------------------------------------------------
// 메시지 목업 데이터
// API: GET /api/channels/text-channels/:id/messages
//      GET /api/dms/:id/messages
// -----------------------------------------------------------------------------
// export const MOCK_MESSAGES: Message[] = [
//   {
//     id: 1,
//     content: "안녕하세요! 반갑습니다. 😊",
//     userId: 2,
//     userName: "김철수",
//     isOnline: true,
//     timestamp: "10:23",
//     date: TWO_DAYS_AGO,
//     reactions: [{ emoji: "👍", users: [1, 3] }],
//     attachments: [],
//   },
//   {
//     id: 2,
//     content: "반가워요~ 오늘 날씨가 좋네요!",
//     userId: 3,
//     userName: "이영희",
//     isOnline: false,
//     timestamp: "10:25",
//     date: TWO_DAYS_AGO,
//     reactions: [],
//     attachments: [],
//   },
//   {
//     id: 3,
//     content: "네, 정말 좋은 날씨네요. 다들 어떻게 지내시나요?",
//     userId: 4,
//     userName: "박민수",
//     isOnline: true,
//     timestamp: "15:27",
//     date: YESTERDAY,
//     reactions: [{ emoji: "❤️", users: [2] }],
//     attachments: [],
//   },
//   {
//     id: 4,
//     content: "저는 오늘 프로젝트 마무리 중이에요",
//     userId: 5,
//     userName: "최지은",
//     isOnline: true,
//     timestamp: "15:30",
//     date: YESTERDAY,
//     edited: true,
//     editedAt: "15:32",
//     reactions: [],
//     attachments: [],
//   },
//   {
//     id: 5,
//     content: "회의 자료 공유드립니다!",
//     userId: 2,
//     userName: "김철수",
//     isOnline: true,
//     timestamp: "09:35",
//     date: TODAY,
//     reactions: [{ emoji: "🙏", users: [1, 3, 4, 5] }],
//     attachments: [
//       {
//         id: 1,
//         type: "file",
//         name: "회의자료.pdf",
//         url: "#",
//         size: 1024 * 1024 * 2.5, // 2.5MB
//       },
//     ],
//   },
//   {
//     id: 6,
//     content: "",
//     userId: 3,
//     userName: "이영희",
//     isOnline: false,
//     timestamp: "14:40",
//     date: TODAY,
//     reactions: [{ emoji: "😍", users: [2, 4] }],
//     attachments: [
//       {
//         id: 2,
//         type: "image",
//         name: "스크린샷.png",
//         url: "https://picsum.photos/400/300",
//       },
//     ],
//   },
// ];

// 자주 사용하는 이모지
export const QUICK_REACTIONS = ["👍", "❤️", "😊", "🎉", "🔥", "👀", "🙏", "💯"];

// =============================================================================
// Atoms
// =============================================================================
// 
// 📌 메시지는 채널/DM별로 캐싱됩니다.
// key 형식: "channel-{channelId}-{textChannelId}" 또는 "dm-{dmId}"
// 
// 프로덕션에서는 React Query를 사용하여 서버 상태를 관리하는 것을 권장합니다.
// 이 atom은 실시간 메시지(WebSocket)를 위한 로컬 캐시로 활용할 수 있습니다.
// =============================================================================

// 채널/DM별 메시지 저장
// 초기값: 빈 객체 (API에서 로드)
export const messagesAtom = atom<Record<string, Message[]>>({});

// 타이핑 중인 사용자
export const typingUsersAtom = atom<Record<string, TypingUser[]>>({});

// 메시지 검색어
export const messageSearchQueryAtom = atom("");

// 답장 대상 메시지
export const replyToMessageAtom = atom<Message | null>(null);

// 수정 중인 메시지
export const editingMessageAtom = atom<Message | null>(null);

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * 채널/DM의 룸 키 생성
 * - 채널: "channel-{channelId}-{textChannelId}"
 * - DM: "dm-{dmId}"
 */
export const getRoomKey = (
  type: "channel" | "dm",
  channelId?: number,
  workspaceId?: number,
  dmId?: number
): string => {
  if (type === "channel" && channelId && workspaceId) {
    return `channel-${channelId}-${workspaceId}`;
  }
  if (type === "dm" && dmId) {
    return `dm-${dmId}`;
  }
  return "default";
};

/**
 * 파일 크기 포맷팅
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
