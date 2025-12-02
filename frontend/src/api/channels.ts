// frontend/src/api/channels.ts
import { apiClient } from "./client";

export interface Channel {
  id: number;
  name: string;
  private: boolean;
  memberCount: number;
  createdAt: string;
}

export interface ChannelDetail {
  id: number;
  name: string;
  private: boolean;
  workspaceId: number;
  workspaceName: string;
  members: Member[];
  createdAt: string;
}

export interface Member {
  id: number;
  nickname: string;
  email: string;
}

export interface Message {
  id: number;
  content: string;
  user: Member;
  createdAt: string;
}

export interface CreateChannelRequest {
  name: string;
  workspaceId: number;
  private?: boolean;
}

export interface SendMessageRequest {
  content: string;
}

/**
 * 워크스페이스의 채널 목록 조회
 */
export const getChannels = async (workspaceId: number): Promise<Channel[]> => {
  const response = await apiClient.get<Channel[]>("/channels", {
    params: { workspaceId },
  });
  return response.data;
};

/**
 * 채널 생성
 */
export const createChannel = async (
  data: CreateChannelRequest
): Promise<Channel> => {
  const response = await apiClient.post<Channel>("/channels", data);
  return response.data;
};

/**
 * 채널 상세 조회
 */
export const getChannel = async (id: number): Promise<ChannelDetail> => {
  const response = await apiClient.get<ChannelDetail>(`/channels/${id}`);
  return response.data;
};

/**
 * 채널 메시지 조회
 */
export const getChannelMessages = async (
  channelId: number,
  page = 1,
  limit = 50
): Promise<Message[]> => {
  const response = await apiClient.get<Message[]>(
    `/channels/${channelId}/messages`,
    {
      params: { page, limit },
    }
  );
  return response.data;
};

/**
 * 채널 메시지 전송
 */
export const sendChannelMessage = async (
  channelId: number,
  data: SendMessageRequest
): Promise<Message> => {
  const response = await apiClient.post<Message>(
    `/channels/${channelId}/messages`,
    data
  );
  return response.data;
};

/**
 * 채널 참가
 */
export const joinChannel = async (
  channelId: number
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    `/channels/${channelId}/join`
  );
  return response.data;
};

