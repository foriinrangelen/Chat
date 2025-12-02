import {
  Avatar,
  Badge,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  Indicator,
} from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { useState } from "react";
import { HiUserGroup, HiHashtag, HiChatBubbleLeftRight } from "react-icons/hi2";
import {
  MOCK_FRIENDS,
  MOCK_SERVERS,
  MOCK_DMS,
  selectedServerAtom,
  friendRequestCountAtom,
} from "@/store/discord";

export function Sidebar() {
  const navigate = useNavigate();
  const [selectedServer, setSelectedServer] = useAtom(selectedServerAtom);
  const [friendRequestCount] = useAtom(friendRequestCountAtom);

  const [friendsOpened, setFriendsOpened] = useState(true);
  const [channelsOpened, setChannelsOpened] = useState(true);
  const [dmsOpened, setDmsOpened] = useState(true);

  return (
    <ScrollArea h="100vh">
      <Stack gap="xs" p="md">
        {/* 친구 섹션 */}
        <NavLink
          label={
            <Group gap="xs" justify="space-between" style={{ flex: 1 }}>
              <Text
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedServer(null);
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
              onClick={() => {
                setSelectedServer(null);
                navigate({ to: `/chat?type=dm&id=${friend.id}` });
              }}
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
          childrenOffset={28}
        >
          {MOCK_SERVERS.map((server) => (
            <NavLink
              key={server.id}
              active={selectedServer?.id === server.id}
              label={server.name}
              leftSection={
                <Avatar color="gray" size="sm" radius="sm">
                  {server.icon}
                </Avatar>
              }
              onClick={() => {
                setSelectedServer(server);
                navigate({ to: `/chat?type=channel&id=${server.id}` });
              }}
              style={{ borderRadius: "var(--mantine-radius-md)" }}
            />
          ))}
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
              onClick={() => {
                setSelectedServer(null);
                navigate({ to: `/chat?type=dm&id=${dm.id}` });
              }}
              style={{ borderRadius: "var(--mantine-radius-md)" }}
            />
          ))}
        </NavLink>
      </Stack>
    </ScrollArea>
  );
}
