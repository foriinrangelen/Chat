import { atom } from "jotai";

// =============================================================================
// Types
// =============================================================================

export type Friend = {
  id: number;
  name: string;
  isOnline: boolean;
  avatar?: string;
  statusMessage?: string;
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
  avatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
};

export type FriendRequest = {
  id: number;
  name: string;
  message: string;
  avatar?: string;
  createdAt?: string;
};

export type BlockedUser = {
  id: number;
  name: string;
  blockedAt: string;
};

// =============================================================================
// Mock Data (개발용 - 프로덕션에서는 API로 대체)
// =============================================================================
// 
// 📌 아래 Mock 데이터들은 개발/테스트 용도입니다.
// 실제 프로덕션 환경에서는 백엔드 API를 통해 데이터를 가져옵니다.
// - Friends API: GET /api/friends
// - Channels API: GET /api/channels
// - DMs API: GET /api/dms
// - Friend Requests API: GET /api/friends/requests/received
// 
// 백엔드 연동 시 아래 주석을 해제하지 말고, 
// useQuery 등을 사용하여 API에서 데이터를 가져오세요.
// =============================================================================

// 현재 로그인한 사용자 ID
// TODO: 실제로는 로그인 후 토큰에서 추출하거나 /api/auth/me에서 가져옴
export const CURRENT_USER_ID = 1;

// -----------------------------------------------------------------------------
// 친구 목업 데이터
// API: GET /api/friends
// -----------------------------------------------------------------------------
// export const INITIAL_FRIENDS: Friend[] = [
//   { id: 1, name: "김철수", isOnline: true, statusMessage: "열심히 코딩 중!" },
//   { id: 2, name: "이영희", isOnline: false, statusMessage: "회의 중" },
//   { id: 3, name: "박민수", isOnline: true },
//   { id: 4, name: "최지은", isOnline: true, statusMessage: "점심 먹는 중 🍔" },
// ];

// -----------------------------------------------------------------------------
// 친구 요청 목업 데이터
// API: GET /api/friends/requests/received
// -----------------------------------------------------------------------------
// export const INITIAL_FRIEND_REQUESTS: FriendRequest[] = [
//   {
//     id: 1,
//     name: "정다은",
//     message: "안녕하세요! 친구 추가 부탁드립니다.",
//     createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//   },
//   {
//     id: 2,
//     name: "강민호",
//     message: "같이 스터디하실래요?",
//     createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
//   },
//   {
//     id: 3,
//     name: "윤서연",
//     message: "반갑습니다~",
//     createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
//   },
// ];

// -----------------------------------------------------------------------------
// 차단 사용자 목업 데이터
// API: GET /api/friends/blocked
// -----------------------------------------------------------------------------
// export const INITIAL_BLOCKED_USERS: BlockedUser[] = [];

// -----------------------------------------------------------------------------
// 채널 목업 데이터 (Discord의 "서버" 개념)
// API: GET /api/channels
// -----------------------------------------------------------------------------
// export const INITIAL_CHANNELS: Channel[] = [
//   {
//     id: 1,
//     name: "프론트엔드 스터디",
//     icon: "react",
//     description: "React, Vue, Angular 스터디 그룹",
//     ownerId: 1,
//     iconType: "language",
//     iconColor: "#61DAFB",
//   },
//   {
//     id: 2,
//     name: "백엔드팀",
//     icon: "nestjs",
//     description: "NestJS, Spring Boot 개발팀",
//     ownerId: 1,
//     iconType: "language",
//     iconColor: "#E0234E",
//   },
//   {
//     id: 3,
//     name: "디자인팀",
//     icon: "디",
//     description: "UI/UX 디자인 협업",
//     ownerId: 2,
//     iconType: "initial",
//     iconColor: "#be4bdb",
//   },
//   {
//     id: 4,
//     name: "데브옵스",
//     icon: "docker",
//     description: "CI/CD, 인프라 관리",
//     ownerId: 3,
//     iconType: "language",
//     iconColor: "#2496ED",
//   },
// ];

// -----------------------------------------------------------------------------
// 워크스페이스 목업 데이터 (Discord의 "텍스트 채널" 개념)
// API: GET /api/channels/:channelId/text-channels
// -----------------------------------------------------------------------------
// export const INITIAL_WORKSPACES: Workspace[] = [
//   // 프론트엔드 스터디 (channelId: 1)
//   { id: 101, name: "일반", channelId: 1 },
//   { id: 102, name: "공지사항", channelId: 1 },
//   { id: 103, name: "질문-답변", channelId: 1 },
//   { id: 104, name: "코드-리뷰", channelId: 1 },
//
//   // 백엔드팀 (channelId: 2)
//   { id: 201, name: "일반", channelId: 2 },
//   { id: 202, name: "공지사항", channelId: 2 },
//   { id: 203, name: "API-설계", channelId: 2 },
//   { id: 204, name: "데이터베이스", channelId: 2 },
//
//   // 디자인팀 (channelId: 3)
//   { id: 301, name: "일반", channelId: 3 },
//   { id: 302, name: "피드백", channelId: 3 },
//   { id: 303, name: "리소스-공유", channelId: 3 },
//
//   // 데브옵스 (channelId: 4)
//   { id: 401, name: "일반", channelId: 4 },
//   { id: 402, name: "배포-알림", channelId: 4 },
//   { id: 403, name: "장애-대응", channelId: 4 },
// ];

// -----------------------------------------------------------------------------
// DM 목업 데이터
// API: GET /api/dms
// -----------------------------------------------------------------------------
// export const INITIAL_DMS: DirectMessage[] = [
//   {
//     id: 1,
//     userName: "김철수",
//     isOnline: true,
//     lastMessage: "안녕하세요!",
//     lastMessageAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
//     unreadCount: 2,
//   },
//   {
//     id: 2,
//     userName: "이영희",
//     isOnline: false,
//     lastMessage: "내일 회의 시간 알려주세요",
//     lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//   },
//   {
//     id: 3,
//     userName: "박민수",
//     isOnline: true,
//     lastMessage: "코드 리뷰 부탁드려요",
//     lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
//     unreadCount: 1,
//   },
//   { id: 4, userName: "윤서연", isOnline: false },
//   { id: 5, userName: "한소희", isOnline: true },
// ];

// =============================================================================
// Initial Empty Data (프로덕션용)
// =============================================================================
// API에서 데이터를 가져오기 전 초기 상태로 사용
const INITIAL_FRIENDS: Friend[] = [];
const INITIAL_FRIEND_REQUESTS: FriendRequest[] = [];
const INITIAL_BLOCKED_USERS: BlockedUser[] = [];
const INITIAL_CHANNELS: Channel[] = [];
const INITIAL_WORKSPACES: Workspace[] = [];
const INITIAL_DMS: DirectMessage[] = [];

// =============================================================================
// Atoms
// =============================================================================
// 
// 📌 현재는 로컬 상태로 관리하지만, 프로덕션에서는:
// - React Query (TanStack Query)를 사용하여 서버 상태 관리
// - 또는 API 응답을 이 atom에 저장
// 
// 예시:
// const { data: channels } = useQuery({
//   queryKey: ['channels'],
//   queryFn: () => getMyChannels(),
// });
// =============================================================================

// 채널 관련
export const channelsAtom = atom<Channel[]>(INITIAL_CHANNELS);
export const selectedChannelAtom = atom<Channel | null>(null);
export const workspacesAtom = atom<Workspace[]>(INITIAL_WORKSPACES);
export const selectedWorkspaceAtom = atom<Workspace | null>(null);

// 친구 관련
export const friendsAtom = atom<Friend[]>(INITIAL_FRIENDS);
export const friendRequestsAtom = atom<FriendRequest[]>(INITIAL_FRIEND_REQUESTS);
export const blockedUsersAtom = atom<BlockedUser[]>(INITIAL_BLOCKED_USERS);

// 친구 요청 개수 (파생 atom)
export const friendRequestCountAtom = atom(
  (get) => get(friendRequestsAtom).length
);

// DM 관련
export const dmsAtom = atom<DirectMessage[]>(INITIAL_DMS);

// 읽지 않은 DM 개수 (파생 atom)
export const unreadDMCountAtom = atom((get) => {
  const dms = get(dmsAtom);
  return dms.reduce((acc, dm) => acc + (dm.unreadCount || 0), 0);
});

// =============================================================================
// Friend Actions (Write Atoms)
// =============================================================================
// 
// 📌 이 액션들은 낙관적 업데이트(Optimistic Update)용입니다.
// 실제 프로덕션에서는 API 호출 후 성공 시 로컬 상태를 업데이트하세요.
// 
// 예시:
// const acceptMutation = useMutation({
//   mutationFn: (requestId) => acceptFriendRequest(requestId),
//   onSuccess: () => {
//     queryClient.invalidateQueries(['friends']);
//     queryClient.invalidateQueries(['friendRequests']);
//   },
// });
// =============================================================================

// 친구 요청 수락
export const acceptFriendRequestAtom = atom(
  null,
  (get, set, requestId: number) => {
    const requests = get(friendRequestsAtom);
    const request = requests.find((r) => r.id === requestId);

    if (request) {
      // 친구 목록에 추가
      const friends = get(friendsAtom);
      const newFriend: Friend = {
        id: Math.max(...friends.map((f) => f.id), 0) + 1,
        name: request.name,
        isOnline: false,
        avatar: request.avatar,
      };
      set(friendsAtom, [...friends, newFriend]);

      // 요청 목록에서 제거
      set(
        friendRequestsAtom,
        requests.filter((r) => r.id !== requestId)
      );
    }
  }
);

// 친구 요청 거절
export const rejectFriendRequestAtom = atom(
  null,
  (get, set, requestId: number) => {
    const requests = get(friendRequestsAtom);
    set(
      friendRequestsAtom,
      requests.filter((r) => r.id !== requestId)
    );
  }
);

// 친구 삭제
export const removeFriendAtom = atom(null, (get, set, friendId: number) => {
  const friends = get(friendsAtom);
  set(
    friendsAtom,
    friends.filter((f) => f.id !== friendId)
  );
});

// 사용자 차단
export const blockUserAtom = atom(
  null,
  (get, set, user: { id: number; name: string }) => {
    const blocked = get(blockedUsersAtom);
    const newBlocked: BlockedUser = {
      id: user.id,
      name: user.name,
      blockedAt: new Date().toISOString(),
    };
    set(blockedUsersAtom, [...blocked, newBlocked]);

    // 친구 목록에서도 제거
    const friends = get(friendsAtom);
    set(
      friendsAtom,
      friends.filter((f) => f.id !== user.id)
    );
  }
);

// 차단 해제
export const unblockUserAtom = atom(null, (get, set, userId: number) => {
  const blocked = get(blockedUsersAtom);
  set(
    blockedUsersAtom,
    blocked.filter((u) => u.id !== userId)
  );
});

// =============================================================================
// Channel Actions (Write Atoms)
// =============================================================================

// 새 채널 추가
export const addChannelAtom = atom(
  null,
  (get, set, newChannel: Omit<Channel, "id" | "ownerId">) => {
    const channels = get(channelsAtom);
    const newId = Math.max(...channels.map((ch) => ch.id), 0) + 1;
    set(channelsAtom, [
      ...channels,
      { ...newChannel, id: newId, ownerId: CURRENT_USER_ID },
    ]);

    // 기본 워크스페이스 추가
    const workspaces = get(workspacesAtom);
    const newWorkspaceId = Math.max(...workspaces.map((ws) => ws.id), 0) + 1;
    set(workspacesAtom, [
      ...workspaces,
      { id: newWorkspaceId, name: "일반", channelId: newId },
    ]);
  }
);

// 새 워크스페이스 추가
export const addWorkspaceAtom = atom(
  null,
  (get, set, newWorkspace: Omit<Workspace, "id">) => {
    const workspaces = get(workspacesAtom);
    const newId = Math.max(...workspaces.map((ws) => ws.id), 0) + 1;
    set(workspacesAtom, [...workspaces, { ...newWorkspace, id: newId }]);
  }
);

// =============================================================================
// Helper Functions
// =============================================================================

// 채널 ID로 채널 가져오기
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

// 워크스페이스 ID로 워크스페이스 가져오기
export const getWorkspaceById = (
  workspaces: Workspace[],
  workspaceId: number
): Workspace | undefined => {
  return workspaces.find((ws) => ws.id === workspaceId);
};

// 채널 ID로 워크스페이스 목록 가져오기
export const getWorkspacesByChannelId = (
  workspaces: Workspace[],
  channelId: number
): Workspace[] => {
  return workspaces.filter((ws) => ws.channelId === channelId);
};

// 시간 포맷팅 헬퍼
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString("ko-KR");
};

// =============================================================================
// Legacy Compatibility (하위 호환성)
// =============================================================================
// 기존 코드에서 사용 중인 export명 유지
// TODO: 추후 리팩토링 시 제거

export const selectedServerAtom = selectedChannelAtom;
export const MOCK_CHANNELS = INITIAL_CHANNELS;
export const MOCK_SERVERS = INITIAL_CHANNELS;
export const MOCK_WORKSPACES = INITIAL_WORKSPACES;
export const MOCK_FRIENDS = INITIAL_FRIENDS;
export const MOCK_ALL_FRIENDS = INITIAL_FRIENDS;
export const MOCK_DMS = INITIAL_DMS;
export const MOCK_FRIEND_REQUESTS = INITIAL_FRIEND_REQUESTS;
