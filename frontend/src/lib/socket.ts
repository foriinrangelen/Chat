// frontend/src/lib/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

class SocketClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(...args: unknown[]) => void>> = new Map();

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("No access token found, cannot connect to socket");
      return null;
    }

    this.socket = io(`${SOCKET_URL}/chat`, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }

  // 채널 관련 메서드
  joinChannel(channelId: number) {
    this.socket?.emit("joinChannel", { channelId });
  }

  leaveChannel(channelId: number) {
    this.socket?.emit("leaveChannel", { channelId });
  }

  sendChannelMessage(channelId: number, content: string) {
    return new Promise((resolve, reject) => {
      this.socket?.emit(
        "sendChannelMessage",
        { channelId, content },
        (response: { success: boolean; message?: unknown; error?: string }) => {
          if (response.success) {
            resolve(response.message);
          } else {
            reject(new Error(response.error || "Failed to send message"));
          }
        }
      );
    });
  }

  // DM 관련 메서드
  joinDM(dmId: number) {
    this.socket?.emit("joinDM", { dmId });
  }

  leaveDM(dmId: number) {
    this.socket?.emit("leaveDM", { dmId });
  }

  sendDMMessage(dmId: number, content: string) {
    return new Promise((resolve, reject) => {
      this.socket?.emit(
        "sendDMMessage",
        { dmId, content },
        (response: { success: boolean; message?: unknown; error?: string }) => {
          if (response.success) {
            resolve(response.message);
          } else {
            reject(new Error(response.error || "Failed to send message"));
          }
        }
      );
    });
  }

  // 타이핑 상태
  sendTyping(roomType: "channel" | "dm", roomId: number, isTyping: boolean) {
    this.socket?.emit("typing", { roomType, roomId, isTyping });
  }

  // 이벤트 리스너 등록
  on<T = unknown>(event: string, callback: (data: T) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback as (...args: unknown[]) => void);
    this.socket?.on(event, callback as (...args: unknown[]) => void);
  }

  // 이벤트 리스너 제거
  off(event: string, callback?: (...args: unknown[]) => void) {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
      this.socket?.off(event, callback);
    } else {
      this.listeners.delete(event);
      this.socket?.off(event);
    }
  }

  // 온라인 사용자 목록 요청
  getOnlineUsers(): Promise<number[]> {
    return new Promise((resolve) => {
      this.socket?.emit(
        "getOnlineUsers",
        {},
        (response: { success: boolean; users: number[] }) => {
          resolve(response.users || []);
        }
      );
    });
  }
}

// 싱글톤 인스턴스
export const socketClient = new SocketClient();

