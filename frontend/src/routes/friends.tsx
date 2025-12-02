import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Title,
  Tabs,
  Stack,
  Group,
  Avatar,
  Text,
  Button,
  Paper,
  Badge,
  ScrollArea,
  TextInput,
  ActionIcon,
  Menu,
  Indicator,
  Tooltip,
} from "@mantine/core";
import { useSetAtom, useAtomValue } from "jotai";
import { useState } from "react";
import {
  HiUserGroup,
  HiMagnifyingGlass,
  HiEllipsisVertical,
  HiChatBubbleLeft,
  HiUserMinus,
  HiNoSymbol,
  HiArrowUturnLeft,
  HiCheck,
  HiXMark,
} from "react-icons/hi2";
import {
  friendsAtom,
  friendRequestsAtom,
  blockedUsersAtom,
  acceptFriendRequestAtom,
  rejectFriendRequestAtom,
  removeFriendAtom,
  blockUserAtom,
  unblockUserAtom,
  formatRelativeTime,
} from "@/store/discord";
import { addNotificationAtom } from "@/store/notification";

export const Route = createFileRoute("/friends")({
  component: FriendsPage,
});

function FriendsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Atoms
  const friends = useAtomValue(friendsAtom);
  const friendRequests = useAtomValue(friendRequestsAtom);
  const blockedUsers = useAtomValue(blockedUsersAtom);

  // Actions
  const acceptRequest = useSetAtom(acceptFriendRequestAtom);
  const rejectRequest = useSetAtom(rejectFriendRequestAtom);
  const removeFriend = useSetAtom(removeFriendAtom);
  const blockUser = useSetAtom(blockUserAtom);
  const unblockUser = useSetAtom(unblockUserAtom);
  const addNotification = useSetAtom(addNotificationAtom);

  // 필터된 친구 목록
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 온라인/오프라인 친구 분리
  const onlineFriends = filteredFriends.filter((f) => f.isOnline);
  const offlineFriends = filteredFriends.filter((f) => !f.isOnline);

  const handleAcceptRequest = (requestId: number, name: string) => {
    acceptRequest(requestId);
    addNotification({
      type: "friend_accepted",
      title: "친구 추가 완료",
      message: `${name}님과 친구가 되었습니다.`,
    });
  };

  const handleRejectRequest = (requestId: number) => {
    rejectRequest(requestId);
  };

  const handleRemoveFriend = (friendId: number, name: string) => {
    removeFriend(friendId);
    addNotification({
      type: "system",
      title: "친구 삭제",
      message: `${name}님이 친구 목록에서 삭제되었습니다.`,
    });
  };

  const handleBlockUser = (userId: number, name: string) => {
    blockUser({ id: userId, name });
    addNotification({
      type: "system",
      title: "사용자 차단",
      message: `${name}님을 차단했습니다.`,
    });
  };

  const handleUnblockUser = (userId: number, name: string) => {
    unblockUser(userId);
    addNotification({
      type: "system",
      title: "차단 해제",
      message: `${name}님의 차단을 해제했습니다.`,
    });
  };

  const handleSendMessage = (friendId: number) => {
    navigate({ to: `/chat?type=dm&id=${friendId}` });
  };

  return (
    <>
      <Group gap="sm" mb="xl" justify="space-between">
        <Group gap="sm">
          <HiUserGroup size={28} style={{ color: "#7c3aed" }} />
          <Title order={2}>친구</Title>
        </Group>
        <Badge size="lg" variant="light">
          {friends.length}명
        </Badge>
      </Group>

      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Tab value="all">
            모든 친구
            <Badge ml="xs" size="xs" variant="light" circle>
              {friends.length}
            </Badge>
          </Tabs.Tab>
          <Tabs.Tab value="online">
            온라인
            <Badge ml="xs" size="xs" color="green" variant="light" circle>
              {onlineFriends.length}
            </Badge>
          </Tabs.Tab>
          <Tabs.Tab
            value="requests"
            rightSection={
              friendRequests.length > 0 && (
                <Badge size="xs" color="red" variant="filled" circle>
                  {friendRequests.length}
                </Badge>
              )
            }
          >
            친구 요청
          </Tabs.Tab>
          <Tabs.Tab value="blocked">차단 목록</Tabs.Tab>
        </Tabs.List>

        {/* 모든 친구 탭 */}
        <Tabs.Panel value="all" pt="md">
          {/* 검색창 */}
          <TextInput
            placeholder="친구 검색..."
            leftSection={<HiMagnifyingGlass size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            mb="md"
          />

          <ScrollArea h="calc(100vh - 320px)">
            <Stack gap="md" pr="md">
              {filteredFriends.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                  {searchQuery
                    ? "검색 결과가 없습니다."
                    : "아직 친구가 없습니다."}
                </Text>
              ) : (
                <>
                  {/* 온라인 친구 */}
                  {onlineFriends.length > 0 && (
                    <>
                      <Text size="sm" c="dimmed" fw={500}>
                        온라인 — {onlineFriends.length}명
                      </Text>
                      {onlineFriends.map((friend) => (
                        <FriendItem
                          key={friend.id}
                          friend={friend}
                          onMessage={() => handleSendMessage(friend.id)}
                          onRemove={() =>
                            handleRemoveFriend(friend.id, friend.name)
                          }
                          onBlock={() =>
                            handleBlockUser(friend.id, friend.name)
                          }
                        />
                      ))}
                    </>
                  )}

                  {/* 오프라인 친구 */}
                  {offlineFriends.length > 0 && (
                    <>
                      <Text size="sm" c="dimmed" fw={500} mt="md">
                        오프라인 — {offlineFriends.length}명
                      </Text>
                      {offlineFriends.map((friend) => (
                        <FriendItem
                          key={friend.id}
                          friend={friend}
                          onMessage={() => handleSendMessage(friend.id)}
                          onRemove={() =>
                            handleRemoveFriend(friend.id, friend.name)
                          }
                          onBlock={() =>
                            handleBlockUser(friend.id, friend.name)
                          }
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </Stack>
          </ScrollArea>
        </Tabs.Panel>

        {/* 온라인 친구 탭 */}
        <Tabs.Panel value="online" pt="md">
          <ScrollArea h="calc(100vh - 280px)">
            <Stack gap="md" pr="md">
              {onlineFriends.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                  현재 온라인인 친구가 없습니다.
                </Text>
              ) : (
                onlineFriends.map((friend) => (
                  <FriendItem
                    key={friend.id}
                    friend={friend}
                    onMessage={() => handleSendMessage(friend.id)}
                    onRemove={() => handleRemoveFriend(friend.id, friend.name)}
                    onBlock={() => handleBlockUser(friend.id, friend.name)}
                  />
                ))
              )}
            </Stack>
          </ScrollArea>
        </Tabs.Panel>

        {/* 친구 요청 탭 */}
        <Tabs.Panel value="requests" pt="md">
          <ScrollArea h="calc(100vh - 280px)">
            <Stack gap="md" pr="md">
              {friendRequests.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                  받은 친구 요청이 없습니다.
                </Text>
              ) : (
                friendRequests.map((request) => (
                  <Paper key={request.id} p="md" withBorder>
                    <Group justify="space-between" align="flex-start">
                      <Group gap="md" align="flex-start">
                        <Avatar size="lg" color="grape" radius="xl">
                          {request.name[0]}
                        </Avatar>
                        <div style={{ flex: 1 }}>
                          <Text fw={600}>{request.name}</Text>
                          <Text size="sm" c="dimmed" lineClamp={2}>
                            {request.message}
                          </Text>
                          {request.createdAt && (
                            <Text size="xs" c="dimmed" mt={4}>
                              {formatRelativeTime(request.createdAt)}
                            </Text>
                          )}
                        </div>
                      </Group>
                      <Group gap="xs">
                        <Tooltip label="수락">
                          <ActionIcon
                            size="lg"
                            color="green"
                            variant="filled"
                            onClick={() =>
                              handleAcceptRequest(request.id, request.name)
                            }
                          >
                            <HiCheck size={18} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="거절">
                          <ActionIcon
                            size="lg"
                            color="red"
                            variant="light"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            <HiXMark size={18} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>
                  </Paper>
                ))
              )}
            </Stack>
          </ScrollArea>
        </Tabs.Panel>

        {/* 차단 목록 탭 */}
        <Tabs.Panel value="blocked" pt="md">
          <ScrollArea h="calc(100vh - 280px)">
            <Stack gap="md" pr="md">
              {blockedUsers.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                  차단한 사용자가 없습니다.
                </Text>
              ) : (
                blockedUsers.map((user) => (
                  <Paper key={user.id} p="md" withBorder>
                    <Group justify="space-between">
                      <Group gap="md">
                        <Avatar size="lg" color="gray" radius="xl">
                          {user.name[0]}
                        </Avatar>
                        <div>
                          <Text fw={600}>{user.name}</Text>
                          <Text size="xs" c="dimmed">
                            차단일: {formatRelativeTime(user.blockedAt)}
                          </Text>
                        </div>
                      </Group>
                      <Button
                        variant="light"
                        size="sm"
                        leftSection={<HiArrowUturnLeft size={16} />}
                        onClick={() => handleUnblockUser(user.id, user.name)}
                      >
                        차단 해제
                      </Button>
                    </Group>
                  </Paper>
                ))
              )}
            </Stack>
          </ScrollArea>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

// 친구 아이템 컴포넌트
interface FriendItemProps {
  friend: {
    id: number;
    name: string;
    isOnline: boolean;
    avatar?: string;
    statusMessage?: string;
  };
  onMessage: () => void;
  onRemove: () => void;
  onBlock: () => void;
}

function FriendItem({ friend, onMessage, onRemove, onBlock }: FriendItemProps) {
  return (
    <Paper p="md" withBorder>
      <Group justify="space-between">
        <Group gap="md">
          <Indicator
            inline
            size={14}
            offset={4}
            position="bottom-end"
            color={friend.isOnline ? "green" : "gray"}
            withBorder
          >
            <Avatar size="lg" color="blue" radius="xl" src={friend.avatar}>
              {friend.name[0]}
            </Avatar>
          </Indicator>
          <div>
            <Text fw={600}>{friend.name}</Text>
            <Text size="sm" c="dimmed">
              {friend.statusMessage ||
                (friend.isOnline ? "온라인" : "오프라인")}
            </Text>
          </div>
        </Group>
        <Group gap="xs">
          <Button
            variant="light"
            size="sm"
            leftSection={<HiChatBubbleLeft size={16} />}
            onClick={onMessage}
          >
            메시지
          </Button>
          <Menu shadow="md" width={150}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <HiEllipsisVertical size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<HiUserMinus size={14} />}
                color="red"
                onClick={onRemove}
              >
                친구 삭제
              </Menu.Item>
              <Menu.Item
                leftSection={<HiNoSymbol size={14} />}
                color="red"
                onClick={onBlock}
              >
                차단
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Paper>
  );
}
