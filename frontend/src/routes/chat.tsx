import { createFileRoute } from "@tanstack/react-router";
import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Group,
  Indicator,
  Paper,
  Popover,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
  Button,
  Badge,
  UnstyledButton,
} from "@mantine/core";
import {
  HiPaperAirplane,
  HiHashtag,
  HiChatBubbleLeftRight,
  HiChatBubbleOvalLeft,
  HiUserPlus,
} from "react-icons/hi2";
import { useState, useEffect, useRef } from "react";
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

// 프로필 팝오버 컴포넌트
function ProfilePopover({
  user,
  isOnline,
  avatarColor,
  children,
}: {
  user: string;
  isOnline: boolean;
  avatarColor: string;
  children: React.ReactNode;
}) {
  return (
    <Popover
      width={280}
      position="right-start"
      withArrow
      shadow="md"
      zIndex={1100}
    >
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        <Stack align="center" gap="sm">
          <Indicator
            inline
            size={14}
            offset={6}
            position="bottom-end"
            color={isOnline ? "green" : "gray"}
            withBorder
          >
            <Avatar size={60} radius="xl" color={avatarColor}>
              {user[0]}
            </Avatar>
          </Indicator>

          <div style={{ textAlign: "center" }}>
            <Text fw={700} size="lg">
              {user}
            </Text>
            <Badge
              color={isOnline ? "green" : "gray"}
              variant="light"
              size="sm"
              mt={4}
            >
              {isOnline ? "온라인" : "오프라인"}
            </Badge>
          </div>

          <Divider w="100%" my={4} />

          <Group w="100%" grow gap="xs">
            <Button
              variant="light"
              size="xs"
              leftSection={<HiChatBubbleOvalLeft size={14} />}
            >
              메시지
            </Button>
            <Button
              variant="light"
              color="green"
              size="xs"
              leftSection={<HiUserPlus size={14} />}
            >
              친구 추가
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

function ChatPage() {
  const { type, id } = Route.useSearch();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  // 메시지가 추가되면 자동으로 스크롤
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

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

  const isMyMessage = (user: string) => user === "나";

  return (
    <>
      <Group gap="sm" mb="xl">
        {chatInfo.icon}
        <Title order={2}>{chatInfo.name}</Title>
      </Group>

      <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
        <Stack h="calc(100vh - 230px)" gap={0}>
          {/* 메시지 영역 */}
          <ScrollArea
            flex={1}
            p="md"
            viewportRef={scrollAreaRef}
            type="scroll"
            scrollbarSize={8}
            offsetScrollbars
          >
            <Stack gap="lg" style={{ overflowX: "hidden" }}>
              {messages.map((message, index) => {
                const isMine = isMyMessage(message.user);
                const avatarColor = getAvatarColor(index);

                return (
                  <Group
                    key={message.id}
                    align="flex-start"
                    wrap="nowrap"
                    justify={isMine ? "flex-end" : "flex-start"}
                    style={{ width: "100%" }}
                  >
                    {/* 다른 사람 메시지: 아바타 왼쪽 */}
                    {!isMine && (
                      <ProfilePopover
                        user={message.user}
                        isOnline={message.isOnline}
                        avatarColor={avatarColor}
                      >
                        <UnstyledButton>
                          <Avatar size="md" radius="xl" color={avatarColor}>
                            {message.user[0]}
                          </Avatar>
                        </UnstyledButton>
                      </ProfilePopover>
                    )}

                    <Box
                      style={{
                        maxWidth: "70%",
                        minWidth: 0,
                        textAlign: isMine ? "right" : "left",
                      }}
                    >
                      <Group
                        gap="xs"
                        mb={4}
                        justify={isMine ? "flex-end" : "flex-start"}
                      >
                        {isMine ? (
                          <>
                            <Text size="xs" c="dimmed">
                              {message.timestamp}
                            </Text>
                            <Text fw={600} size="sm" c="blue">
                              {message.user}
                            </Text>
                          </>
                        ) : (
                          <>
                            <ProfilePopover
                              user={message.user}
                              isOnline={message.isOnline}
                              avatarColor={avatarColor}
                            >
                              <UnstyledButton>
                                <Text
                                  fw={600}
                                  size="sm"
                                  style={{ cursor: "pointer" }}
                                >
                                  {message.user}
                                </Text>
                              </UnstyledButton>
                            </ProfilePopover>
                            <Text size="xs" c="dimmed">
                              {message.timestamp}
                            </Text>
                          </>
                        )}
                      </Group>
                      <Paper
                        p="sm"
                        radius="md"
                        bg={isMine ? "blue.1" : "gray.1"}
                        style={{
                          display: "inline-block",
                          wordBreak: "break-word",
                        }}
                      >
                        <Text size="sm" style={{ lineHeight: 1.5 }}>
                          {message.content}
                        </Text>
                      </Paper>
                    </Box>

                    {/* 내 메시지: 아바타 오른쪽 */}
                    {isMine && (
                      <Avatar size="md" radius="xl" color="blue">
                        나
                      </Avatar>
                    )}
                  </Group>
                );
              })}
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
