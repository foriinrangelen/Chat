// frontend/src/api/channels.ts
import { apiClient } from "./client";
import type { UserBasic } from "@/types/auth";

// =============================================================================
// Types
// =============================================================================

/** 채널 (서버) */
export interface Channel {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  iconType?: "initial" | "language" | "custom";
  iconColor?: string;
  ownerId: number;
  ownerName?: string;
  memberCount: number;
  workspaceCount?: number;
  createdAt: string;
}

/** 채널 상세 정보 */
export interface ChannelDetail extends Channel {
  owner: UserBasic;
  members: ChannelMember[];
  workspaces: Workspace[];
}

/** 채널 멤버 */
export interface ChannelMember extends UserBasic {
  role: "owner" | "admin" | "member";
  joinedAt: string;
}

/** 워크스페이스 */
export interface Workspace {
  id: number;
  name: string;
  channelId: number;
  createdAt: string;
}

/** 워크스페이스 메시지 */
export interface WorkspaceMessage {
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

/** 채널 생성 요청 */
export interface CreateChannelRequest {
  name: string;
  description?: string;
  icon?: string;
  iconType?: string;
  iconColor?: string;
}

/** 워크스페이스 생성 요청 */
export interface CreateWorkspaceRequest {
  name: string;
}

/** 메시지 전송 요청 */
export interface SendMessageRequest {
  content: string;
  replyToId?: number;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * 내 채널 목록 조회
 */
export const getMyChannels = async (): Promise<Channel[]> => {
  const response = await apiClient.get<Channel[]>("/channels");
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

/**
 * 채널 나가기
 */
export const leaveChannel = async (
  channelId: number
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    `/channels/${channelId}/leave`
  );
  return response.data;
};

/**
 * 채널의 워크스페이스 목록 조회
 */
export const getWorkspaces = async (
  channelId: number
): Promise<Workspace[]> => {
  const response = await apiClient.get<Workspace[]>(
    `/channels/${channelId}/workspaces`
  );
  return response.data;
};

/**
 * 워크스페이스 생성
 */
export const createWorkspace = async (
  channelId: number,
  data: CreateWorkspaceRequest
): Promise<Workspace> => {
  const response = await apiClient.post<Workspace>(
    `/channels/${channelId}/workspaces`,
    data
  );
  return response.data;
};

/**
 * 워크스페이스 메시지 조회
 */
export const getWorkspaceMessages = async (
  workspaceId: number,
  page = 1,
  limit = 50
): Promise<WorkspaceMessage[]> => {
  const response = await apiClient.get<WorkspaceMessage[]>(
    `/channels/workspaces/${workspaceId}/messages`,
    {
      params: { page, limit },
    }
  );
  return response.data;
};

/**
 * 워크스페이스 메시지 전송
 */
export const sendWorkspaceMessage = async (
  workspaceId: number,
  data: SendMessageRequest
): Promise<WorkspaceMessage> => {
  const response = await apiClient.post<WorkspaceMessage>(
    `/channels/workspaces/${workspaceId}/messages`,
    data
  );
  return response.data;
};

/**
 * 메시지 수정
 */
export const editChannelMessage = async (
  messageId: number,
  content: string
): Promise<WorkspaceMessage> => {
  const response = await apiClient.patch<WorkspaceMessage>(
    `/channels/messages/${messageId}`,
    { content }
  );
  return response.data;
};

/**
 * 메시지 삭제
 */
export const deleteChannelMessage = async (
  messageId: number
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/channels/messages/${messageId}`
  );
  return response.data;
};
