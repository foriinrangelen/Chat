import { atom } from "jotai";

// =============================================================================
// Types
// =============================================================================

export type NotificationType =
  | "message"
  | "friend_request"
  | "friend_accepted"
  | "channel_invite"
  | "mention"
  | "system";

export type Notification = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: {
    channelId?: number;
    workspaceId?: number;
    userId?: number;
    messageId?: number;
  };
};

// =============================================================================
// Mock Data
// =============================================================================

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "message",
    title: "새 메시지",
    message: "김철수님이 메시지를 보냈습니다.",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5분 전
    data: { userId: 2, channelId: 1, workspaceId: 101 },
  },
  {
    id: 2,
    type: "friend_request",
    title: "친구 요청",
    message: "정다은님이 친구 요청을 보냈습니다.",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30분 전
    data: { userId: 10 },
  },
  {
    id: 3,
    type: "mention",
    title: "멘션",
    message: "박민수님이 회의에서 나를 언급했습니다.",
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
    data: { channelId: 1, workspaceId: 101, messageId: 50 },
  },
  {
    id: 4,
    type: "channel_invite",
    title: "채널 초대",
    message: "AI 스터디 채널에 초대되었습니다.",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    data: { channelId: 5 },
  },
  {
    id: 5,
    type: "friend_accepted",
    title: "친구 수락",
    message: "이영희님이 친구 요청을 수락했습니다.",
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    data: { userId: 3 },
  },
];

// =============================================================================
// Atoms
// =============================================================================

export const notificationsAtom = atom<Notification[]>(MOCK_NOTIFICATIONS);

// 읽지 않은 알림 개수 (파생 atom)
export const unreadCountAtom = atom((get) => {
  const notifications = get(notificationsAtom);
  return notifications.filter((n) => !n.read).length;
});

// 알림 추가
export const addNotificationAtom = atom(
  null,
  (get, set, notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    const notifications = get(notificationsAtom);
    const newNotification: Notification = {
      ...notification,
      id: Math.max(...notifications.map((n) => n.id), 0) + 1,
      read: false,
      createdAt: new Date().toISOString(),
    };
    set(notificationsAtom, [newNotification, ...notifications]);
  }
);

// 알림 읽음 처리
export const markAsReadAtom = atom(null, (get, set, notificationId: number) => {
  const notifications = get(notificationsAtom);
  set(
    notificationsAtom,
    notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
  );
});

// 모든 알림 읽음 처리
export const markAllAsReadAtom = atom(null, (get, set) => {
  const notifications = get(notificationsAtom);
  set(
    notificationsAtom,
    notifications.map((n) => ({ ...n, read: true }))
  );
});

// 알림 삭제
export const removeNotificationAtom = atom(
  null,
  (get, set, notificationId: number) => {
    const notifications = get(notificationsAtom);
    set(
      notificationsAtom,
      notifications.filter((n) => n.id !== notificationId)
    );
  }
);

