import { createFileRoute } from "@tanstack/react-router";
import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Group,
  Indicator,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  HiPaperAirplane,
  HiHashtag,
  HiChatBubbleLeftRight,
} from "react-icons/hi2";
import { useState } from "react";
import { MOCK_SERVERS, MOCK_DMS } from "@/store/discord";

type ChatSearch = {
  type?: "channel" | "dm";
  id?: number;
};

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  validateSearch: (search: Record<string, unknown>): ChatSearch => {
    return {
      type: search.type as "channel" | "dm" | undefined,
      id: search.id ? Number(search.id) : undefined,
    };
  },
});

// 아바타 색상 배열
const AVATAR_COLORS = ["blue", "grape", "teal", "orange", "pink", "cyan"];

// 임시 메시지 데이터
const MOCK_MESSAGES = [
  {
    id: 1,
    user: "김철수",
    content: "안녕하세요! 반갑습니다.",
    timestamp: "14:23",
    isOnline: true,
  },
  {
    id: 2,
    user: "이영희",
    content: "반가워요~ 오늘 날씨가 좋네요!",
    timestamp: "14:25",
    isOnline: false,
  },
  {
    id: 3,
    user: "박민수",
    content: "네, 정말 좋은 날씨네요. 다들 어떻게 지내시나요?",
    timestamp: "14:27",
    isOnline: true,
  },
  {
    id: 4,
    user: "최지은",
    content: "저는 오늘 프로젝트 마무리 중이에요 😊",
    timestamp: "14:30",
    isOnline: true,
  },
];

function ChatPage() {
  const { type, id } = Route.useSearch();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState("");

  // 채널 또는 DM 정보 가져오기
  const getChatInfo = () => {
    if (type === "channel" && id) {
      const channel = MOCK_SERVERS.find((s) => s.id === id);
      return {
        name: channel?.name || "알 수 없는 채널",
        icon: <HiHashtag size={28} style={{ color: "#f97316" }} />,
      };
    } else if (type === "dm" && id) {
      const dm = MOCK_DMS.find((d) => d.id === id);
      return {
        name: dm?.userName || "알 수 없는 사용자",
        icon: <HiChatBubbleLeftRight size={28} style={{ color: "#10b981" }} />,
      };
    }
    return {
      name: "일반 채팅",
      icon: <HiHashtag size={28} style={{ color: "#f97316" }} />,
    };
  };

  const chatInfo = getChatInfo();

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      user: "나",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOnline: true,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAvatarColor = (index: number) => {
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
  };

  return (
    <>
      <Group gap="sm" mb="xl">
        {chatInfo.icon}
        <Title order={2}>{chatInfo.name}</Title>
      </Group>

      <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
        <Stack h="calc(100vh - 220px)" gap={0}>
          {/* 메시지 영역 */}
          <ScrollArea flex={1} p="md">
            <Stack gap="lg">
              {messages.map((message, index) => (
                <Group key={message.id} align="flex-start" wrap="nowrap">
                  <Indicator
                    inline
                    size={12}
                    offset={4}
                    position="bottom-end"
                    color={message.isOnline ? "green" : "gray"}
                    withBorder
                  >
                    <Avatar size="md" radius="xl" color={getAvatarColor(index)}>
                      {message.user[0]}
                    </Avatar>
                  </Indicator>
                  <Box style={{ flex: 1 }}>
                    <Group gap="xs" mb={4}>
                      <Text fw={600} size="sm">
                        {message.user}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {message.timestamp}
                      </Text>
                    </Group>
                    <Text size="sm" style={{ lineHeight: 1.5 }}>
                      {message.content}
                    </Text>
                  </Box>
                </Group>
              ))}
            </Stack>
          </ScrollArea>

          <Divider />

          {/* 메시지 입력창 */}
          <Box p="md">
            <Group gap="sm" wrap="nowrap">
              <TextInput
                flex={1}
                placeholder="메시지를 입력하세요..."
                value={inputValue}
                onChange={(e) => setInputValue(e.currentTarget.value)}
                onKeyPress={handleKeyPress}
                radius="md"
                size="md"
              />
              <ActionIcon
                size="xl"
                radius="md"
                variant="filled"
                color="blue"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
              >
                <HiPaperAirplane size={20} />
              </ActionIcon>
            </Group>
          </Box>
        </Stack>
      </Paper>
    </>
  );
}
