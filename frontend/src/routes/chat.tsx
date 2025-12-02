import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  Menu,
  Image,
  FileButton,
  Tooltip,
  Loader,
} from "@mantine/core";
import {
  HiPaperAirplane,
  HiHashtag,
  HiChatBubbleLeftRight,
  HiChatBubbleOvalLeft,
  HiUserPlus,
  HiEllipsisVertical,
  HiPencil,
  HiTrash,
  HiFaceSmile,
  HiPaperClip,
  HiPhoto,
  HiXMark,
  HiArrowUturnLeft,
  HiDocument,
} from "react-icons/hi2";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  MOCK_DMS,
  channelsAtom,
  workspacesAtom,
  getWorkspaceById,
  getChannelById,
} from "@/store/discord";
import {
  type Message,
  type MessageAttachment,
  QUICK_REACTIONS,
  formatFileSize,
  messagesAtom,
  getRoomKey,
  typingUsersAtom,
  replyToMessageAtom,
  editingMessageAtom,
} from "@/store/message";
import { currentUserAtom } from "@/store/user";

type ChatSearch = {
  type?: "workspace" | "dm";
  channelId?: number;
  workspaceId?: number;
  id?: number; // DM용
};

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  validateSearch: (search: Record<string, unknown>): ChatSearch => {
    return {
      type: search.type as "workspace" | "dm" | undefined,
      channelId: search.channelId ? Number(search.channelId) : undefined,
      workspaceId: search.workspaceId ? Number(search.workspaceId) : undefined,
      id: search.id ? Number(search.id) : undefined,
    };
  },
});

// 아바타 색상 배열
const AVATAR_COLORS = ["blue", "grape", "teal", "orange", "pink", "cyan"];

// 프로필 팝오버 컴포넌트
function ProfilePopover({
  userId,
  userName,
  userAvatar,
  isOnline,
  avatarColor,
  isFriend = false,
  children,
  onSendMessage,
  onAddFriend,
}: {
  userId: number;
  userName: string;
  userAvatar?: string;
  isOnline: boolean;
  avatarColor: string;
  isFriend?: boolean;
  children: React.ReactNode;
  onSendMessage?: (userId: number) => void;
  onAddFriend?: (userId: number, name: string) => void;
}) {
  return (
    <Popover
      width={280}
      position="right-start"
      withArrow
      shadow="lg"
      zIndex={1100}
    >
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        {/* 프로필 정보 */}
        <Stack align="center" gap="sm">
          <Indicator
            inline
            size={14}
            offset={6}
            position="bottom-end"
            color={isOnline ? "green" : "gray"}
            withBorder
          >
            <Avatar size={70} radius="xl" color={avatarColor} src={userAvatar}>
              {userName[0]}
            </Avatar>
          </Indicator>

          <Text fw={700} size="lg">
            {userName}
          </Text>

          <Divider w="100%" my={4} />

          {/* 액션 버튼들 */}
          <Stack w="100%" gap="xs">
            <Button
              fullWidth
              variant="light"
              leftSection={<HiChatBubbleOvalLeft size={16} />}
              onClick={() => onSendMessage?.(userId)}
            >
              메시지 보내기
            </Button>

            {!isFriend ? (
              <Button
                fullWidth
                variant="light"
                color="green"
                leftSection={<HiUserPlus size={16} />}
                onClick={() => onAddFriend?.(userId, userName)}
              >
                친구 추가
              </Button>
            ) : (
              <Badge color="blue" variant="light" size="lg" fullWidth>
                👥 친구
              </Badge>
            )}
          </Stack>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

// 메시지 컴포넌트
function MessageItem({
  message,
  isMine,
  avatarColor,
  onEdit,
  onDelete,
  onReply,
  onReaction,
  onSendMessage,
  onAddFriend,
}: {
  message: Message;
  isMine: boolean;
  avatarColor: string;
  onEdit: (message: Message) => void;
  onDelete: (messageId: number) => void;
  onReply: (message: Message) => void;
  onReaction: (messageId: number, emoji: string) => void;
  onSendMessage: (userId: number) => void;
  onAddFriend: (userId: number, name: string) => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const [emojiOpened, setEmojiOpened] = useState(false);

  // 메뉴나 이모지 피커가 열려있으면 액션 버튼 유지
  const isActionsVisible = showActions || menuOpened || emojiOpened;

  return (
    <Group
      align="flex-end"
      wrap="nowrap"
      justify={isMine ? "flex-end" : "flex-start"}
      gap="xs"
      style={{ width: "100%" }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* 다른 사람 메시지: 아바타 왼쪽 */}
      {!isMine && (
        <ProfilePopover
          userId={message.userId}
          userName={message.userName}
          userAvatar={message.userAvatar}
          isOnline={message.isOnline}
          avatarColor={avatarColor}
          onSendMessage={onSendMessage}
          onAddFriend={onAddFriend}
        >
          <UnstyledButton>
            <Avatar
              size="md"
              radius="xl"
              color={avatarColor}
              src={message.userAvatar}
            >
              {message.userName[0]}
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
        {/* 답장 표시 */}
        {message.replyTo && (
          <Group justify={isMine ? "flex-end" : "flex-start"} mb={4}>
            <Paper
              p="xs"
              radius="sm"
              bg="gray.1"
              style={{
                borderLeft: "3px solid #228be6",
                display: "inline-block",
                maxWidth: "100%",
              }}
            >
              <Text size="xs" c="blue" fw={500}>
                {message.replyTo.userName}
              </Text>
              <Text size="xs" c="dimmed" lineClamp={1}>
                {message.replyTo.content}
              </Text>
            </Paper>
          </Group>
        )}

        {/* 사용자 이름 & 시간 */}
        <Group gap="xs" mb={4} justify={isMine ? "flex-end" : "flex-start"}>
          {isMine ? (
            <>
              {message.edited && (
                <Text size="xs" c="dimmed">
                  (수정됨)
                </Text>
              )}
              <Text size="xs" c="dimmed">
                {message.timestamp}
              </Text>
              <Text fw={600} size="sm" c="blue">
                {message.userName}
              </Text>
            </>
          ) : (
            <>
              <ProfilePopover
                userId={message.userId}
                userName={message.userName}
                userAvatar={message.userAvatar}
                isOnline={message.isOnline}
                avatarColor={avatarColor}
                onSendMessage={onSendMessage}
                onAddFriend={onAddFriend}
              >
                <UnstyledButton>
                  <Text fw={600} size="sm" style={{ cursor: "pointer" }}>
                    {message.userName}
                  </Text>
                </UnstyledButton>
              </ProfilePopover>
              <Text size="xs" c="dimmed">
                {message.timestamp}
              </Text>
              {message.edited && (
                <Text size="xs" c="dimmed">
                  (수정됨)
                </Text>
              )}
            </>
          )}
        </Group>

        {/* 메시지 내용 + 액션 버튼 */}
        <Group
          gap={4}
          align="flex-end"
          justify={isMine ? "flex-end" : "flex-start"}
          wrap="nowrap"
        >
          {/* 내 메시지: 액션 버튼 왼쪽 */}
          {isMine && isActionsVisible && (
            <Paper
              shadow="sm"
              radius="md"
              p={4}
              withBorder
              style={{
                display: "flex",
                gap: 4,
                alignItems: "center",
              }}
            >
              <Menu
                shadow="md"
                width={200}
                position="top"
                withArrow
                opened={emojiOpened}
                onChange={setEmojiOpened}
              >
                <Menu.Target>
                  <Tooltip label="반응">
                    <ActionIcon size="sm" variant="subtle" color="gray">
                      <HiFaceSmile size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Menu.Target>
                <Menu.Dropdown>
                  <Group gap={4} p="xs">
                    {QUICK_REACTIONS.map((emoji) => (
                      <ActionIcon
                        key={emoji}
                        variant="subtle"
                        size="lg"
                        onClick={() => {
                          onReaction(message.id, emoji);
                          setEmojiOpened(false);
                        }}
                      >
                        <Text size="lg">{emoji}</Text>
                      </ActionIcon>
                    ))}
                  </Group>
                </Menu.Dropdown>
              </Menu>
              <Tooltip label="답장">
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="gray"
                  onClick={() => onReply(message)}
                >
                  <HiArrowUturnLeft size={16} />
                </ActionIcon>
              </Tooltip>
              <Menu
                shadow="md"
                width={120}
                opened={menuOpened}
                onChange={setMenuOpened}
              >
                <Menu.Target>
                  <Tooltip label="더보기">
                    <ActionIcon size="sm" variant="subtle" color="gray">
                      <HiEllipsisVertical size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<HiPencil size={14} />}
                    onClick={() => onEdit(message)}
                  >
                    수정
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    leftSection={<HiTrash size={14} />}
                    onClick={() => onDelete(message.id)}
                  >
                    삭제
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Paper>
          )}

          {/* 메시지 박스 */}
          <Paper
            p="sm"
            radius="md"
            bg={isMine ? "blue.1" : "gray.1"}
            style={{
              wordBreak: "break-word",
              maxWidth: "100%",
            }}
          >
            {/* 텍스트 */}
            {message.content && (
              <Text size="sm" style={{ lineHeight: 1.5 }}>
                {message.content}
              </Text>
            )}

            {/* 첨부파일 */}
            {message.attachments.length > 0 && (
              <Stack gap="xs" mt={message.content ? "xs" : 0}>
                {message.attachments.map((attachment) => (
                  <AttachmentPreview
                    key={attachment.id}
                    attachment={attachment}
                  />
                ))}
              </Stack>
            )}
          </Paper>

          {/* 다른 사람 메시지: 액션 버튼 오른쪽 */}
          {!isMine && isActionsVisible && (
            <Paper
              shadow="sm"
              radius="md"
              p={4}
              withBorder
              style={{
                display: "flex",
                gap: 4,
                alignItems: "center",
              }}
            >
              <Menu
                shadow="md"
                width={200}
                position="top"
                withArrow
                opened={emojiOpened}
                onChange={setEmojiOpened}
              >
                <Menu.Target>
                  <Tooltip label="반응">
                    <ActionIcon size="sm" variant="subtle" color="gray">
                      <HiFaceSmile size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Menu.Target>
                <Menu.Dropdown>
                  <Group gap={4} p="xs">
                    {QUICK_REACTIONS.map((emoji) => (
                      <ActionIcon
                        key={emoji}
                        variant="subtle"
                        size="lg"
                        onClick={() => {
                          onReaction(message.id, emoji);
                          setEmojiOpened(false);
                        }}
                      >
                        <Text size="lg">{emoji}</Text>
                      </ActionIcon>
                    ))}
                  </Group>
                </Menu.Dropdown>
              </Menu>
              <Tooltip label="답장">
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="gray"
                  onClick={() => onReply(message)}
                >
                  <HiArrowUturnLeft size={16} />
                </ActionIcon>
              </Tooltip>
            </Paper>
          )}
        </Group>

        {/* 반응 */}
        {message.reactions.length > 0 && (
          <Group gap={4} mt={4} justify={isMine ? "flex-end" : "flex-start"}>
            {message.reactions.map((reaction, idx) => (
              <Button
                key={idx}
                size="compact-xs"
                variant="light"
                color="gray"
                onClick={() => onReaction(message.id, reaction.emoji)}
              >
                {reaction.emoji} {reaction.users.length}
              </Button>
            ))}
          </Group>
        )}
      </Box>
    </Group>
  );
}

// 첨부파일 미리보기 컴포넌트
function AttachmentPreview({ attachment }: { attachment: MessageAttachment }) {
  if (attachment.type === "image") {
    return (
      <Image
        src={attachment.url}
        alt={attachment.name}
        radius="md"
        maw={300}
        fit="contain"
      />
    );
  }

  return (
    <Paper p="xs" radius="sm" withBorder>
      <Group gap="xs">
        <HiDocument size={20} style={{ color: "#868e96" }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" lineClamp={1}>
            {attachment.name}
          </Text>
          {attachment.size && (
            <Text size="xs" c="dimmed">
              {formatFileSize(attachment.size)}
            </Text>
          )}
        </div>
      </Group>
    </Paper>
  );
}

// 타이핑 인디케이터 컴포넌트
function TypingIndicator({ users }: { users: string[] }) {
  if (users.length === 0) return null;

  const text =
    users.length === 1
      ? `${users[0]}님이 입력 중...`
      : users.length === 2
      ? `${users[0]}님, ${users[1]}님이 입력 중...`
      : `${users[0]}님 외 ${users.length - 1}명이 입력 중...`;

  return (
    <Group gap="xs" px="md" py="xs">
      <Loader size="xs" type="dots" />
      <Text size="xs" c="dimmed">
        {text}
      </Text>
    </Group>
  );
}

function ChatPage() {
  const navigate = useNavigate();
  const { type, channelId, workspaceId, id } = Route.useSearch();
  const [allMessages, setAllMessages] = useAtom(messagesAtom);
  const [typingUsers] = useAtom(typingUsersAtom);
  const [replyTo, setReplyTo] = useAtom(replyToMessageAtom);
  const [editingMessage, setEditingMessage] = useAtom(editingMessageAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const channels = useAtomValue(channelsAtom);
  const workspaces = useAtomValue(workspacesAtom);

  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);

  // 현재 채팅방 키
  const roomKey = getRoomKey(
    type === "workspace" ? "channel" : "dm",
    channelId,
    workspaceId,
    id
  );

  // 현재 방의 메시지
  const messages = useMemo(
    () => allMessages[roomKey] || [],
    [allMessages, roomKey]
  );

  // 현재 방의 타이핑 유저
  const currentTypingUsers = useMemo(
    () => typingUsers[roomKey] || [],
    [typingUsers, roomKey]
  );

  // 채팅방 정보 가져오기
  const getChatInfo = () => {
    if (type === "workspace" && channelId && workspaceId) {
      const channel = getChannelById(channels, channelId);
      const workspace = getWorkspaceById(workspaces, workspaceId);

      if (workspace && channel) {
        return {
          name: channel.name,
          subtitle: `# ${workspace.name}`,
          icon: <HiHashtag size={28} style={{ color: "#f97316" }} />,
        };
      }
    } else if (type === "dm" && id) {
      const dm = MOCK_DMS.find((d) => d.id === id);
      return {
        name: dm?.userName || "알 수 없는 사용자",
        subtitle: dm?.isOnline ? "온라인" : "오프라인",
        icon: <HiChatBubbleLeftRight size={28} style={{ color: "#10b981" }} />,
      };
    }
    return {
      name: "채팅방을 선택하세요",
      subtitle: "",
      icon: <HiHashtag size={28} style={{ color: "#f97316" }} />,
    };
  };

  const chatInfo = getChatInfo();

  // 새 메시지가 추가될 때만 자동으로 스크롤 (이모지 반응, 수정 시에는 스크롤 안 함)
  useEffect(() => {
    const currentCount = messages.length;
    if (currentCount > prevMessageCountRef.current && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    prevMessageCountRef.current = currentCount;
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() && attachments.length === 0) return;

    const newMessage: Message = {
      id: Math.max(...messages.map((m) => m.id), 0) + 1,
      content: inputValue,
      userId: currentUser?.id || 1,
      userName: currentUser?.nickname || "나",
      userAvatar: currentUser?.avatar,
      isOnline: true,
      timestamp: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toISOString().split("T")[0],
      reactions: [],
      attachments: attachments.map((file, idx) => ({
        id: idx + 1,
        type: file.type.startsWith("image/") ? "image" : "file",
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
      })),
      replyTo: replyTo
        ? {
            id: replyTo.id,
            userName: replyTo.userName,
            content: replyTo.content,
          }
        : undefined,
    };

    // 수정 모드
    if (editingMessage) {
      setAllMessages({
        ...allMessages,
        [roomKey]: messages.map((m) =>
          m.id === editingMessage.id
            ? {
                ...m,
                content: inputValue,
                edited: true,
                editedAt: newMessage.timestamp,
              }
            : m
        ),
      });
      setEditingMessage(null);
    } else {
      setAllMessages({
        ...allMessages,
        [roomKey]: [...messages, newMessage],
      });
    }

    setInputValue("");
    setAttachments([]);
    setReplyTo(null);
  }, [
    inputValue,
    attachments,
    messages,
    currentUser,
    replyTo,
    editingMessage,
    allMessages,
    roomKey,
    setAllMessages,
    setEditingMessage,
    setReplyTo,
  ]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEdit = (message: Message) => {
    setEditingMessage(message);
    setInputValue(message.content);
  };

  const handleDelete = (messageId: number) => {
    setAllMessages({
      ...allMessages,
      [roomKey]: messages.filter((m) => m.id !== messageId),
    });
  };

  const handleReply = (message: Message) => {
    setReplyTo(message);
  };

  const handleReaction = (messageId: number, emoji: string) => {
    const userId = currentUser?.id || 1;
    const isLastMessage =
      messages.length > 0 && messages[messages.length - 1].id === messageId;

    setAllMessages({
      ...allMessages,
      [roomKey]: messages.map((m) => {
        if (m.id !== messageId) return m;

        // 사용자가 이미 반응한 이모지 찾기
        const userExistingReaction = m.reactions.find((r) =>
          r.users.includes(userId)
        );

        // 같은 이모지 클릭 시 제거 (토글)
        if (userExistingReaction?.emoji === emoji) {
          return {
            ...m,
            reactions: m.reactions
              .map((r) =>
                r.emoji === emoji
                  ? { ...r, users: r.users.filter((u) => u !== userId) }
                  : r
              )
              .filter((r) => r.users.length > 0),
          };
        }

        // 다른 이모지로 변경하거나 새로 추가
        let newReactions = m.reactions
          // 먼저 기존 반응에서 사용자 제거
          .map((r) => ({
            ...r,
            users: r.users.filter((u) => u !== userId),
          }))
          .filter((r) => r.users.length > 0);

        // 새 이모지에 사용자 추가
        const targetReaction = newReactions.find((r) => r.emoji === emoji);
        if (targetReaction) {
          newReactions = newReactions.map((r) =>
            r.emoji === emoji ? { ...r, users: [...r.users, userId] } : r
          );
        } else {
          newReactions = [...newReactions, { emoji, users: [userId] }];
        }

        return { ...m, reactions: newReactions };
      }),
    });

    // 마지막 메시지에 반응 추가 시 스크롤
    if (isLastMessage && scrollAreaRef.current) {
      setTimeout(() => {
        scrollAreaRef.current?.scrollTo({
          top: scrollAreaRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handleFileSelect = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setInputValue("");
  };

  // 프로필 팝오버 핸들러들
  const handleProfileSendMessage = (userId: number) => {
    navigate({ to: `/chat?type=dm&id=${userId}` });
  };

  const handleProfileAddFriend = (_userId: number, name: string) => {
    // TODO: 실제 친구 추가 API 호출
    alert(`${name}님에게 친구 요청을 보냈습니다.`);
  };

  const getAvatarColor = (index: number) => {
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
  };

  const isMyMessage = (userId: number) => userId === (currentUser?.id || 1);

  // 날짜 라벨 포맷팅
  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "오늘";
    if (isYesterday) return "어제";

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <>
      <Group gap="sm" mb="xl" align="center">
        {chatInfo.icon}
        <Title order={2}>{chatInfo.name}</Title>
        {chatInfo.subtitle && (
          <Text size="md" c="dimmed" fw={500}>
            {chatInfo.subtitle}
          </Text>
        )}
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
              {messages.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                  메시지가 없습니다. 첫 메시지를 보내보세요!
                </Text>
              ) : (
                messages.map((message, index) => {
                  const prevMessage = messages[index - 1];
                  const showDateDivider =
                    index === 0 || prevMessage?.date !== message.date;

                  return (
                    <div key={message.id}>
                      {showDateDivider && (
                        <Divider
                          my="md"
                          label={formatDateLabel(message.date)}
                          labelPosition="center"
                          styles={{
                            label: {
                              fontSize: "12px",
                              color: "#868e96",
                              fontWeight: 500,
                            },
                          }}
                        />
                      )}
                      <MessageItem
                        message={message}
                        isMine={isMyMessage(message.userId)}
                        avatarColor={getAvatarColor(index)}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onReply={handleReply}
                        onReaction={handleReaction}
                        onSendMessage={handleProfileSendMessage}
                        onAddFriend={handleProfileAddFriend}
                      />
                    </div>
                  );
                })
              )}
            </Stack>
          </ScrollArea>

          {/* 타이핑 인디케이터 */}
          <TypingIndicator users={currentTypingUsers.map((u) => u.userName)} />

          <Divider />

          {/* 답장/수정 표시 */}
          {(replyTo || editingMessage) && (
            <Paper p="xs" bg="gray.0">
              <Group justify="space-between">
                <Group gap="xs">
                  {replyTo && (
                    <>
                      <HiArrowUturnLeft
                        size={14}
                        style={{ color: "#228be6" }}
                      />
                      <Text size="xs" c="blue" fw={500}>
                        {replyTo.userName}에게 답장
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {replyTo.content}
                      </Text>
                    </>
                  )}
                  {editingMessage && (
                    <>
                      <HiPencil size={14} style={{ color: "#fab005" }} />
                      <Text size="xs" c="yellow" fw={500}>
                        메시지 수정 중
                      </Text>
                    </>
                  )}
                </Group>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  onClick={() => {
                    setReplyTo(null);
                    cancelEdit();
                  }}
                >
                  <HiXMark size={14} />
                </ActionIcon>
              </Group>
            </Paper>
          )}

          {/* 첨부파일 미리보기 */}
          {attachments.length > 0 && (
            <Paper p="xs" bg="gray.0">
              <Group gap="xs">
                {attachments.map((file, index) => (
                  <Badge
                    key={index}
                    variant="light"
                    rightSection={
                      <ActionIcon
                        size="xs"
                        variant="transparent"
                        onClick={() => removeAttachment(index)}
                      >
                        <HiXMark size={12} />
                      </ActionIcon>
                    }
                  >
                    {file.name}
                  </Badge>
                ))}
              </Group>
            </Paper>
          )}

          {/* 메시지 입력창 */}
          <Box p="md">
            <Group gap="sm" wrap="nowrap">
              {/* 파일 첨부 버튼 */}
              <FileButton
                onChange={(files) => files && handleFileSelect(files)}
                accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
                multiple
              >
                {(props) => (
                  <Tooltip label="파일 첨부">
                    <ActionIcon
                      size="lg"
                      variant="subtle"
                      color="gray"
                      {...props}
                    >
                      <HiPaperClip size={20} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </FileButton>

              {/* 이미지 첨부 버튼 */}
              <FileButton
                onChange={(files) => files && handleFileSelect(files)}
                accept="image/*"
                multiple
              >
                {(props) => (
                  <Tooltip label="이미지">
                    <ActionIcon
                      size="lg"
                      variant="subtle"
                      color="gray"
                      {...props}
                    >
                      <HiPhoto size={20} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </FileButton>

              <TextInput
                flex={1}
                placeholder={
                  editingMessage
                    ? "메시지를 수정하세요..."
                    : "메시지를 입력하세요..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.currentTarget.value)}
                onKeyPress={handleKeyPress}
                radius="md"
                size="md"
              />

              {editingMessage ? (
                <Group gap="xs">
                  <Button size="md" onClick={handleSendMessage}>
                    수정
                  </Button>
                  <Button size="md" variant="subtle" onClick={cancelEdit}>
                    취소
                  </Button>
                </Group>
              ) : (
                <ActionIcon
                  size="xl"
                  radius="md"
                  variant="filled"
                  color="blue"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() && attachments.length === 0}
                >
                  <HiPaperAirplane size={20} />
                </ActionIcon>
              )}
            </Group>
          </Box>
        </Stack>
      </Paper>
    </>
  );
}
