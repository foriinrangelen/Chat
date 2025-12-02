import {
  Avatar,
  Badge,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  Indicator,
  Collapse,
  ThemeIcon,
  ActionIcon,
  Tooltip,
  Menu,
  UnstyledButton,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "@tanstack/react-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import {
  HiUserGroup,
  HiHashtag,
  HiChatBubbleLeftRight,
  HiChevronDown,
  HiChevronRight,
  HiPlus,
  HiArrowRightOnRectangle,
  HiCog6Tooth,
  HiUser,
} from "react-icons/hi2";
import {
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiRust,
  SiGo,
  SiSwift,
  SiKotlin,
  SiNodedotjs,
  SiNextdotjs,
  SiNestjs,
  SiDocker,
  SiSpring,
} from "react-icons/si";
import {
  friendsAtom,
  dmsAtom,
  channelsAtom,
  selectedChannelAtom,
  selectedWorkspaceAtom,
  friendRequestCountAtom,
  workspacesAtom,
  unreadDMCountAtom,
  getWorkspacesByChannelId,
  isChannelOwner,
  addWorkspaceAtom,
  type Channel,
  type Workspace,
} from "@/store/discord";
import { currentUserAtom } from "@/store/user";
import { CreateWorkspaceModal } from "@/components/modals/CreateWorkspaceModal";

interface SidebarProps {
  onClose?: () => void;
  onLogout?: () => void;
}

// 언어 아이콘 매핑
const LANGUAGE_ICON_MAP: Record<
  string,
  React.ComponentType<{ size: number; style?: React.CSSProperties }>
> = {
  react: SiReact,
  vue: SiVuedotjs,
  angular: SiAngular,
  typescript: SiTypescript,
  javascript: SiJavascript,
  python: SiPython,
  spring: SiSpring,
  cpp: SiCplusplus,
  rust: SiRust,
  go: SiGo,
  swift: SiSwift,
  kotlin: SiKotlin,
  nodejs: SiNodedotjs,
  nextjs: SiNextdotjs,
  nestjs: SiNestjs,
  docker: SiDocker,
};

export function Sidebar({ onClose, onLogout }: SidebarProps) {
  const navigate = useNavigate();

  // Atoms
  const currentUser = useAtomValue(currentUserAtom);
  const channels = useAtomValue(channelsAtom);
  const friends = useAtomValue(friendsAtom);
  const dms = useAtomValue(dmsAtom);
  const workspaces = useAtomValue(workspacesAtom);
  const friendRequestCount = useAtomValue(friendRequestCountAtom);
  const unreadDMCount = useAtomValue(unreadDMCountAtom);

  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const [selectedWorkspace, setSelectedWorkspace] = useAtom(
    selectedWorkspaceAtom
  );
  const addWorkspace = useSetAtom(addWorkspaceAtom);

  const [friendsOpened, setFriendsOpened] = useState(true);
  const [channelsOpened, setChannelsOpened] = useState(true);
  const [dmsOpened, setDmsOpened] = useState(true);

  // 각 채널의 펼침/접힘 상태
  const [expandedChannels, setExpandedChannels] = useState<
    Record<number, boolean>
  >({
    // 1: true, // 첫 번째 채널은 기본적으로 펼쳐진 상태
  });

  // 워크스페이스 생성 모달
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [targetChannel, setTargetChannel] = useState<Channel | null>(null);

  const toggleChannel = (channelId: number) => {
    setExpandedChannels((prev) => ({
      ...prev,
      [channelId]: !prev[channelId],
    }));
  };

  const handleChannelClick = (channel: Channel) => {
    setSelectedChannel(channel);
    toggleChannel(channel.id);
  };

  const handleWorkspaceClick = (workspace: Workspace, channel: Channel) => {
    setSelectedChannel(channel);
    setSelectedWorkspace(workspace);
    navigate({
      to: `/chat?type=workspace&channelId=${channel.id}&workspaceId=${workspace.id}`,
    });
    onClose?.();
  };

  const handleDMClick = (dmId: number) => {
    setSelectedChannel(null);
    setSelectedWorkspace(null);
    navigate({ to: `/chat?type=dm&id=${dmId}` });
    onClose?.();
  };

  const handleFriendClick = (friendId: number) => {
    setSelectedChannel(null);
    setSelectedWorkspace(null);
    navigate({ to: `/chat?type=dm&id=${friendId}` });
    onClose?.();
  };

  const handleAddWorkspaceClick = (e: React.MouseEvent, channel: Channel) => {
    e.stopPropagation();
    setTargetChannel(channel);
    openModal();
  };

  const handleCreateWorkspace = (name: string) => {
    if (!targetChannel) return;
    addWorkspace({ name, channelId: targetChannel.id });
  };

  // 채널 아이콘 렌더링
  const renderChannelIcon = (channel: Channel) => {
    if (channel.iconType === "custom" && channel.customImage) {
      return <Avatar src={channel.customImage} size="sm" radius="sm" />;
    }

    if (channel.iconType === "language" && channel.icon) {
      const IconComponent = LANGUAGE_ICON_MAP[channel.icon];
      if (IconComponent) {
        return (
          <Avatar size="sm" radius="sm" color="gray">
            <IconComponent
              size={16}
              style={{ color: channel.iconColor || "#666" }}
            />
          </Avatar>
        );
      }
    }

    // 기본 이니셜
    return (
      <Avatar color={channel.iconColor || "blue"} size="sm" radius="sm">
        {channel.icon || channel.name[0]}
      </Avatar>
    );
  };

  return (
    <>
      <ScrollArea h="100vh">
        <Stack gap="xs" p="md">
          {/* 친구 섹션 */}
          <NavLink
            label={
              <Group gap="xs" justify="space-between" style={{ flex: 1 }}>
                <Text
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedChannel(null);
                    setSelectedWorkspace(null);
                    navigate({ to: "/friends" });
                    onClose?.();
                  }}
                  style={{ cursor: "pointer", textDecoration: "none" }}
                >
                  친구
                </Text>
                {friendRequestCount > 0 && (
                  <Badge size="sm" color="red" variant="filled" circle>
                    {friendRequestCount}
                  </Badge>
                )}
              </Group>
            }
            leftSection={<HiUserGroup size={22} style={{ color: "#7c3aed" }} />}
            opened={friendsOpened}
            onChange={setFriendsOpened}
            childrenOffset={28}
            style={{ cursor: "pointer" }}
          >
            {friends.map((friend) => (
              <NavLink
                key={friend.id}
                label={
                  <Group gap="xs" justify="space-between">
                    <Text size="sm">{friend.name}</Text>
                  </Group>
                }
                leftSection={
                  <Indicator
                    inline
                    size={10}
                    offset={3}
                    position="bottom-end"
                    color={friend.isOnline ? "green" : "gray"}
                    withBorder
                  >
                    <Avatar
                      size="sm"
                      radius="xl"
                      color="blue"
                      src={friend.avatar}
                    >
                      {friend.name[0]}
                    </Avatar>
                  </Indicator>
                }
                onClick={() => handleFriendClick(friend.id)}
                style={{ borderRadius: "var(--mantine-radius-md)" }}
              />
            ))}
          </NavLink>

          {/* 채널 섹션 */}
          <NavLink
            label={<Text>채널</Text>}
            leftSection={<HiHashtag size={20} style={{ color: "#f97316" }} />}
            opened={channelsOpened}
            onChange={setChannelsOpened}
            childrenOffset={0}
          >
            {channels.map((channel) => {
              const channelWorkspaces = getWorkspacesByChannelId(
                workspaces,
                channel.id
              );
              const isExpanded = expandedChannels[channel.id] || false;
              const isSelected = selectedChannel?.id === channel.id;
              const isOwner = isChannelOwner(channel);

              return (
                <div key={channel.id}>
                  {/* 채널 헤더 */}
                  <NavLink
                    label={
                      <Group
                        gap="xs"
                        justify="space-between"
                        style={{ flex: 1 }}
                      >
                        <Text size="sm" fw={isSelected ? 600 : 400}>
                          {channel.name}
                        </Text>
                        {/* 방장만 워크스페이스 추가 버튼 표시 */}
                        {isOwner && isExpanded && (
                          <Tooltip label="워크스페이스 추가" position="top">
                            <ActionIcon
                              size="xs"
                              variant="subtle"
                              color="gray"
                              onClick={(e) =>
                                handleAddWorkspaceClick(e, channel)
                              }
                            >
                              <HiPlus size={14} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Group>
                    }
                    leftSection={
                      <Group gap={4}>
                        {isExpanded ? (
                          <HiChevronDown
                            size={14}
                            style={{ color: "#868e96" }}
                          />
                        ) : (
                          <HiChevronRight
                            size={14}
                            style={{ color: "#868e96" }}
                          />
                        )}
                        {renderChannelIcon(channel)}
                      </Group>
                    }
                    active={isSelected && !selectedWorkspace}
                    onClick={() => handleChannelClick(channel)}
                    style={{ borderRadius: "var(--mantine-radius-md)" }}
                  />

                  {/* 워크스페이스 목록 (하위 채팅방) */}
                  <Collapse in={isExpanded}>
                    <Stack gap={2} ml="xl" mt={4} mb={8}>
                      {channelWorkspaces.map((workspace) => {
                        const isWorkspaceSelected =
                          selectedChannel?.id === channel.id &&
                          selectedWorkspace?.id === workspace.id;

                        return (
                          <NavLink
                            key={workspace.id}
                            label={
                              <Text
                                size="xs"
                                c={isWorkspaceSelected ? undefined : "dimmed"}
                              >
                                {workspace.name}
                              </Text>
                            }
                            leftSection={
                              <ThemeIcon
                                size="xs"
                                variant="transparent"
                                color={isWorkspaceSelected ? "blue" : "gray"}
                              >
                                <HiHashtag size={14} />
                              </ThemeIcon>
                            }
                            active={isWorkspaceSelected}
                            onClick={() =>
                              handleWorkspaceClick(workspace, channel)
                            }
                            style={{
                              borderRadius: "var(--mantine-radius-sm)",
                              padding: "4px 8px",
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </Collapse>
                </div>
              );
            })}
          </NavLink>

          {/* 다이렉트 메시지 섹션 */}
          <NavLink
            label={
              <Group gap="xs" justify="space-between" style={{ flex: 1 }}>
                <Text>다이렉트 메시지</Text>
                {unreadDMCount > 0 && (
                  <Badge size="sm" color="blue" variant="filled" circle>
                    {unreadDMCount}
                  </Badge>
                )}
              </Group>
            }
            leftSection={
              <HiChatBubbleLeftRight size={22} style={{ color: "#10b981" }} />
            }
            opened={dmsOpened}
            onChange={setDmsOpened}
            childrenOffset={28}
          >
            {dms.map((dm) => (
              <NavLink
                key={dm.id}
                label={
                  <Group gap="xs" justify="space-between">
                    <Text size="sm">{dm.userName}</Text>
                    {dm.unreadCount && dm.unreadCount > 0 && (
                      <Badge size="xs" color="blue" variant="filled" circle>
                        {dm.unreadCount}
                      </Badge>
                    )}
                  </Group>
                }
                leftSection={
                  <Indicator
                    inline
                    size={10}
                    offset={3}
                    position="bottom-end"
                    color={dm.isOnline ? "green" : "gray"}
                    withBorder
                  >
                    <Avatar size="sm" radius="xl" color="grape" src={dm.avatar}>
                      {dm.userName[0]}
                    </Avatar>
                  </Indicator>
                }
                onClick={() => handleDMClick(dm.id)}
                style={{ borderRadius: "var(--mantine-radius-md)" }}
              />
            ))}
          </NavLink>
        </Stack>
      </ScrollArea>

      {/* 하단 프로필 섹션 */}
      <Box
        p="sm"
        style={{
          borderTop: "1px solid var(--mantine-color-gray-3)",
        }}
      >
        <Group gap="xs" justify="space-between" align="center">
          {/* 프로필 정보 + 로그아웃 메뉴 */}
          <Menu shadow="md" width={150} position="top-start" zIndex={1100}>
            <Menu.Target>
              <UnstyledButton
                style={{
                  padding: "4px 8px",
                  borderRadius: "var(--mantine-radius-md)",
                }}
              >
                <Group gap="sm">
                  <Indicator
                    inline
                    size={10}
                    offset={3}
                    position="bottom-end"
                    color="green"
                    withBorder
                  >
                    <Avatar
                      size="sm"
                      radius="xl"
                      color="blue"
                      src={currentUser?.avatar}
                    >
                      {currentUser?.nickname?.[0] || "나"}
                    </Avatar>
                  </Indicator>
                  <Text size="sm" fw={500}>
                    {currentUser?.nickname || "사용자"}
                  </Text>
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                color="red"
                leftSection={<HiArrowRightOnRectangle size={16} />}
                onClick={onLogout}
              >
                로그아웃
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {/* 프로필 보기 & 설정 버튼 */}
          <Group gap={4}>
            <Tooltip label="프로필">
              <ActionIcon
                variant="subtle"
                color="gray"
                size="md"
                onClick={() => {
                  navigate({ to: "/profile" });
                  onClose?.();
                }}
              >
                <HiUser size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="설정">
              <ActionIcon
                variant="subtle"
                color="gray"
                size="md"
                onClick={() => {
                  navigate({ to: "/settings" });
                  onClose?.();
                }}
              >
                <HiCog6Tooth size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Box>

      {/* 워크스페이스 생성 모달 */}
      {targetChannel && (
        <CreateWorkspaceModal
          opened={modalOpened}
          onClose={closeModal}
          channel={targetChannel}
          onCreateWorkspace={handleCreateWorkspace}
        />
      )}
    </>
  );
}
