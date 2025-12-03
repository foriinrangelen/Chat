// frontend/src/api/dms.ts
import { apiClient } from "./client";
import type { UserBasic } from "@/types/auth";

// =============================================================================
// Types
// =============================================================================

/** DM (대화방) */
export interface DM {
  id: number;
  user: UserBasic;
  lastMessage: string | null;
  lastMessageAt: string;
}

/** DM 상세 정보 */
export interface DMDetail {
  id: number;
  user: UserBasic;
  createdAt: string;
}

/** DM 메시지 */
export interface DMMessage {
  id: number;
  content: string;
  user: UserBasic;
  isEdited: boolean;
  replyTo?: {
    id: number;
    content: string;
    userName: string;
  };
  createdAt: string;
  updatedAt?: string;
}

/** DM 생성 요청 */
export interface CreateDMRequest {
  receiverId: number;
}

/** DM 메시지 전송 요청 */
export interface SendDMRequest {
  content: string;
  replyToId?: number;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * 내 DM 목록 조회
 */
export const getMyDMs = async (): Promise<DM[]> => {
  const response = await apiClient.get<DM[]>("/dms");
  return response.data;
};

/**
 * DM 생성 또는 조회
 */
export const createOrGetDM = async (
  data: CreateDMRequest
): Promise<{ id: number }> => {
  const response = await apiClient.post<{ id: number }>("/dms", data);
  return response.data;
};

/**
 * DM 상세 조회
 */
export const getDM = async (dmId: number): Promise<DMDetail> => {
  const response = await apiClient.get<DMDetail>(`/dms/${dmId}`);
  return response.data;
};

/**
 * DM 메시지 조회
 */
export const getDMMessages = async (
  dmId: number,
  page = 1,
  limit = 50
): Promise<DMMessage[]> => {
  const response = await apiClient.get<DMMessage[]>(`/dms/${dmId}/messages`, {
    params: { page, limit },
  });
  return response.data;
};

/**
 * DM 메시지 전송
 */
export const sendDMMessage = async (
  dmId: number,
  data: SendDMRequest
): Promise<DMMessage> => {
  const response = await apiClient.post<DMMessage>(
    `/dms/${dmId}/messages`,
    data
  );
  return response.data;
};

/**
 * DM 메시지 수정
 */
export const editDMMessage = async (
  messageId: number,
  content: string
): Promise<DMMessage> => {
  const response = await apiClient.patch<DMMessage>(
    `/dms/messages/${messageId}`,
    { content }
  );
  return response.data;
};

/**
 * DM 메시지 삭제
 */
export const deleteDMMessage = async (
  messageId: number
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/dms/messages/${messageId}`
  );
  return response.data;
};
