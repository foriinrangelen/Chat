// frontend/src/hooks/useSocket.ts
import { useEffect, useCallback, useState } from "react";
import { socketClient } from "@/lib/socket";

interface Message {
  id: number;
  content: string;
  user: {
    id: number;
    nickname: string;
  };
  channelId?: number;
  dmId?: number;
  createdAt: string;
}

interface TypingUser {
  userId: number;
  nickname: string;
  isTyping: boolean;
}

export function useSocket() {
  const [isConnected, setIsConnected] = useState(socketClient.isConnected());

  useEffect(() => {
    const socket = socketClient.connect();

    if (socket) {
      const handleConnect = () => setIsConnected(true);
      const handleDisconnect = () => setIsConnected(false);

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
      };
    }
  }, []);

  const connect = useCallback(() => {
    socketClient.connect();
  }, []);

  const disconnect = useCallback(() => {
    socketClient.disconnect();
    setIsConnected(false);
  }, []);

  return {
    isConnected,
    connect,
    disconnect,
    socket: socketClient,
  };
}

export function useChannelChat(channelId: number | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!channelId || !isConnected) return;

    // 채널 입장
    socket.joinChannel(channelId);

    // 새 메시지 수신
    const handleNewMessage = (message: Message) => {
      if (message.channelId === channelId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    // 타이핑 상태 수신
    const handleTyping = (data: TypingUser) => {
      setTypingUsers((prev) => {
        if (data.isTyping) {
          const exists = prev.some((u) => u.userId === data.userId);
          if (!exists) {
            return [...prev, data];
          }
          return prev;
        } else {
          return prev.filter((u) => u.userId !== data.userId);
        }
      });
    };

    socket.on("newChannelMessage", handleNewMessage);
    socket.on("userTyping", handleTyping);

    return () => {
      socket.leaveChannel(channelId);
      socket.off("newChannelMessage", handleNewMessage as (...args: unknown[]) => void);
      socket.off("userTyping", handleTyping as (...args: unknown[]) => void);
      setMessages([]);
      setTypingUsers([]);
    };
  }, [channelId, isConnected, socket]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channelId) return;
      try {
        await socket.sendChannelMessage(channelId, content);
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      }
    },
    [channelId, socket]
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!channelId) return;
      socket.sendTyping("channel", channelId, isTyping);
    },
    [channelId, socket]
  );

  return {
    messages,
    setMessages,
    typingUsers,
    sendMessage,
    sendTyping,
    isConnected,
  };
}

export function useDMChat(dmId: number | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!dmId || !isConnected) return;

    // DM 입장
    socket.joinDM(dmId);

    // 새 메시지 수신
    const handleNewMessage = (message: Message) => {
      if (message.dmId === dmId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    // 타이핑 상태 수신
    const handleTyping = (data: TypingUser) => {
      setTypingUsers((prev) => {
        if (data.isTyping) {
          const exists = prev.some((u) => u.userId === data.userId);
          if (!exists) {
            return [...prev, data];
          }
          return prev;
        } else {
          return prev.filter((u) => u.userId !== data.userId);
        }
      });
    };

    socket.on("newDMMessage", handleNewMessage);
    socket.on("userTyping", handleTyping);

    return () => {
      socket.leaveDM(dmId);
      socket.off("newDMMessage", handleNewMessage as (...args: unknown[]) => void);
      socket.off("userTyping", handleTyping as (...args: unknown[]) => void);
      setMessages([]);
      setTypingUsers([]);
    };
  }, [dmId, isConnected, socket]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!dmId) return;
      try {
        await socket.sendDMMessage(dmId, content);
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      }
    },
    [dmId, socket]
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!dmId) return;
      socket.sendTyping("dm", dmId, isTyping);
    },
    [dmId, socket]
  );

  return {
    messages,
    setMessages,
    typingUsers,
    sendMessage,
    sendTyping,
    isConnected,
  };
}

// 온라인 상태 훅
export function useOnlineStatus() {
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    // 초기 온라인 사용자 목록 가져오기
    socket.getOnlineUsers().then(setOnlineUsers);

    // 온라인/오프라인 이벤트 수신
    const handleUserOnline = (data: { userId: number }) => {
      setOnlineUsers((prev) => {
        if (!prev.includes(data.userId)) {
          return [...prev, data.userId];
        }
        return prev;
      });
    };

    const handleUserOffline = (data: { userId: number }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== data.userId));
    };

    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    return () => {
      socket.off("userOnline", handleUserOnline as (...args: unknown[]) => void);
      socket.off("userOffline", handleUserOffline as (...args: unknown[]) => void);
    };
  }, [isConnected, socket]);

  const isUserOnline = useCallback(
    (userId: number) => onlineUsers.includes(userId),
    [onlineUsers]
  );

  return {
    onlineUsers,
    isUserOnline,
  };
}

