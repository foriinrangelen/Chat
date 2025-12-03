// frontend/src/api/friends.ts
import { apiClient } from "./client";

// =============================================================================
// Types
// =============================================================================

/** 친구 정보 */
export interface Friend {
  id: number; // friendship id
  friendId: number; // user id
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  statusMessage?: string;
}

/** 받은 친구 요청 */
export interface ReceivedFriendRequest {
  id: number;
  senderId: number;
  name: string;
  email: string;
  avatar?: string;
  message?: string;
  createdAt: string;
}

/** 보낸 친구 요청 */
export interface SentFriendRequest {
  id: number;
  receiverId: number;
  name: string;
  email: string;
  avatar?: string;
  message?: string;
  createdAt: string;
}

/** 차단된 사용자 */
export interface BlockedUser {
  id: number;
  userId: number;
  name: string;
  email: string;
  avatar?: string;
  blockedAt: string;
}

/** 친구 요청 전송 */
export interface SendFriendRequestData {
  receiverId: number;
  message?: string;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * 내 친구 목록 조회
 */
export const getMyFriends = async (): Promise<Friend[]> => {
  const response = await apiClient.get<Friend[]>("/friends");
  return response.data;
};

/**
 * 받은 친구 요청 목록 조회
 */
export const getReceivedRequests = async (): Promise<ReceivedFriendRequest[]> => {
  const response = await apiClient.get<ReceivedFriendRequest[]>(
    "/friends/requests/received"
  );
  return response.data;
};

/**
 * 보낸 친구 요청 목록 조회
 */
export const getSentRequests = async (): Promise<SentFriendRequest[]> => {
  const response = await apiClient.get<SentFriendRequest[]>(
    "/friends/requests/sent"
  );
  return response.data;
};

/**
 * 친구 요청 보내기
 */
export const sendFriendRequest = async (
  data: SendFriendRequestData
): Promise<{ id: number; message: string }> => {
  const response = await apiClient.post<{ id: number; message: string }>(
    "/friends/requests",
    data
  );
  return response.data;
};

/**
 * 친구 요청 수락
 */
export const acceptFriendRequest = async (
  requestId: number
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    `/friends/requests/${requestId}/accept`
  );
  return response.data;
};

/**
 * 친구 요청 거절
 */
export const rejectFriendRequest = async (
  requestId: number
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    `/friends/requests/${requestId}/reject`
  );
  return response.data;
};

/**
 * 친구 삭제
 */
export const removeFriend = async (
  friendshipId: number
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/friends/${friendshipId}`
  );
  return response.data;
};

/**
 * 사용자 차단
 */
export const blockUser = async (
  targetUserId: number
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    `/friends/block/${targetUserId}`
  );
  return response.data;
};

/**
 * 차단 해제
 */
export const unblockUser = async (
  targetUserId: number
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/friends/block/${targetUserId}`
  );
  return response.data;
};

/**
 * 차단 목록 조회
 */
export const getBlockedUsers = async (): Promise<BlockedUser[]> => {
  const response = await apiClient.get<BlockedUser[]>("/friends/blocked");
  return response.data;
};

