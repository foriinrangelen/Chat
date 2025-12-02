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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "@tanstack/react-router";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import {
  HiUserGroup,
  HiHashtag,
  HiChatBubbleLeftRight,
  HiChevronDown,
  HiChevronRight,
  HiPlus,
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
  MOCK_FRIENDS,
  MOCK_DMS,
  channelsAtom,
  selectedChannelAtom,
  selectedWorkspaceAtom,
  friendRequestCountAtom,
  workspacesAtom,
  getWorkspacesByChannelId,
  isChannelOwner,
  type Channel,
  type Workspace,
} from "@/store/discord";
import { CreateWorkspaceModal } from "@/components/modals/CreateWorkspaceModal";

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

export function Sidebar() {
  const navigate = useNavigate();
  const channels = useAtomValue(channelsAtom);
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const [selectedWorkspace, setSelectedWorkspace] = useAtom(
    selectedWorkspaceAtom
  );
  const [friendRequestCount] = useAtom(friendRequestCountAtom);
  const [workspaces, setWorkspaces] = useAtom(workspacesAtom);

  const [friendsOpened, setFriendsOpened] = useState(true);
  const [channelsOpened, setChannelsOpened] = useState(true);
  const [dmsOpened, setDmsOpened] = useState(true);

  // 각 채널의 펼침/접힘 상태
  const [expandedChannels, setExpandedChannels] = useState<
    Record<number, boolean>
  >({
    1: true, // 첫 번째 채널은 기본적으로 펼쳐진 상태
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
  };

  const handleDMClick = (dmId: number) => {
    setSelectedChannel(null);
    setSelectedWorkspace(null);
    navigate({ to: `/chat?type=dm&id=${dmId}` });
  };

  const handleFriendClick = (friendId: number) => {
    setSelectedChannel(null);
    setSelectedWorkspace(null);
    navigate({ to: `/chat?type=dm&id=${friendId}` });
  };

  const handleAddWorkspaceClick = (e: React.MouseEvent, channel: Channel) => {
    e.stopPropagation();
    setTargetChannel(channel);
    openModal();
  };

  const handleCreateWorkspace = (name: string) => {
    if (!targetChannel) return;

    const maxId = Math.max(...workspaces.map((ws) => ws.id), 0);
    const newWorkspace: Workspace = {
      id: maxId + 1,
      name,
      channelId: targetChannel.id,
    };

    setWorkspaces([...workspaces, newWorkspace]);
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
            {MOCK_FRIENDS.map((friend) => (
              <NavLink
                key={friend.id}
                label={
                  <Group gap="xs">
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
                    <Avatar size="sm" radius="xl" color="blue">
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
            leftSection={<HiHashtag size={22} style={{ color: "#f97316" }} />}
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
            label={<Text>다이렉트 메시지</Text>}
            leftSection={
              <HiChatBubbleLeftRight size={22} style={{ color: "#10b981" }} />
            }
            opened={dmsOpened}
            onChange={setDmsOpened}
            childrenOffset={28}
          >
            {MOCK_DMS.map((dm) => (
              <NavLink
                key={dm.id}
                label={
                  <Group gap="xs">
                    <Text size="sm">{dm.userName}</Text>
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
                    <Avatar size="sm" radius="xl" color="grape">
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
