// frontend/src/api/dms.ts
import { apiClient } from "./client";

export interface DM {
  id: number;
  user: {
    id: number;
    nickname: string;
    email: string;
  };
  lastMessage: string | null;
  lastMessageAt: string;
}

export interface DMMessage {
  id: number;
  content: string;
  user: {
    id: number;
    nickname: string;
    email: string;
  };
  createdAt: string;
}

export interface CreateDMRequest {
  workspaceId: number;
  receiverId: number;
}

export interface SendDMRequest {
  content: string;
}

/**
 * 내 DM 목록 조회
 */
export const getMyDMs = async (workspaceId: number): Promise<DM[]> => {
  const response = await apiClient.get<DM[]>("/dms", {
    params: { workspaceId },
  });
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

