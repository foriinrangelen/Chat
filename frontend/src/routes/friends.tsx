import { createFileRoute } from "@tanstack/react-router";
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
} from "@mantine/core";
import { HiUserGroup } from "react-icons/hi2";

export const Route = createFileRoute("/friends")({
  component: FriendsPage,
});

// Mock 친구 요청 데이터
const MOCK_FRIEND_REQUESTS = [
  { id: 1, name: "정다은", message: "안녕하세요! 친구 추가 부탁드립니다." },
  { id: 2, name: "강민호", message: "같이 스터디하실래요?" },
  { id: 3, name: "윤서연", message: "반갑습니다~" },
  { id: 4, name: "윤서연", message: "반갑습니다~" },
  { id: 5, name: "윤서연", message: "반갑습니다~" },
  { id: 6, name: "윤서연", message: "반갑습니다~" },
];

// Mock 전체 친구 데이터
const MOCK_ALL_FRIENDS = [
  { id: 1, name: "김철수", isOnline: true },
  { id: 2, name: "이영희", isOnline: false },
  { id: 3, name: "박민수", isOnline: true },
  { id: 4, name: "최지은", isOnline: true },
];

function FriendsPage() {
  return (
    <>
      <Group gap="sm" mb="xl">
        <HiUserGroup size={28} style={{ color: "#7c3aed" }} />
        <Title order={2}>친구</Title>
      </Group>

      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Tab value="all">모든 친구</Tabs.Tab>
          <Tabs.Tab
            value="requests"
            rightSection={
              <Badge size="xs" color="red" variant="filled" circle>
                3
              </Badge>
            }
          >
            친구 요청
          </Tabs.Tab>
          <Tabs.Tab value="blocked">차단 목록</Tabs.Tab>
        </Tabs.List>

        {/* 모든 친구 탭 */}
        <Tabs.Panel value="all" pt="md">
          <ScrollArea h="calc(100vh - 280px)">
            <Stack gap="md" pr="md">
              {MOCK_ALL_FRIENDS.map((friend) => (
                <Paper key={friend.id} p="md" withBorder>
                  <Group justify="space-between">
                    <Group gap="md">
                      <div style={{ position: "relative" }}>
                        <Avatar size="lg" color="blue" radius="xl">
                          {friend.name[0]}
                        </Avatar>
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            backgroundColor: friend.isOnline
                              ? "#22c55e"
                              : "#6b7280",
                            border: "3px solid white",
                          }}
                        />
                      </div>
                      <div>
                        <Text fw={600}>{friend.name}</Text>
                        <Text size="sm" c="dimmed">
                          {friend.isOnline ? "온라인" : "오프라인"}
                        </Text>
                      </div>
                    </Group>
                    <Button variant="light" size="sm">
                      메시지 보내기
                    </Button>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </ScrollArea>
        </Tabs.Panel>

        {/* 친구 요청 탭 */}
        <Tabs.Panel value="requests" pt="md">
          <ScrollArea h="calc(100vh - 280px)">
            <Stack gap="md" pr="md">
              {MOCK_FRIEND_REQUESTS.map((request) => (
                <Paper key={request.id} p="md" withBorder>
                  <Group justify="space-between" align="flex-start">
                    <Group gap="md" align="flex-start">
                      <Avatar size="lg" color="grape" radius="xl">
                        {request.name[0]}
                      </Avatar>
                      <div>
                        <Text fw={600}>{request.name}</Text>
                        <Text size="sm" c="dimmed">
                          {request.message}
                        </Text>
                      </div>
                    </Group>
                    <Group gap="xs">
                      <Button size="sm" color="green">
                        수락
                      </Button>
                      <Button size="sm" variant="subtle" color="red">
                        거절
                      </Button>
                    </Group>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </ScrollArea>
        </Tabs.Panel>

        {/* 차단 목록 탭 */}
        <Tabs.Panel value="blocked" pt="md">
          <ScrollArea h="calc(100vh - 280px)">
            <Text c="dimmed" ta="center" py="xl">
              차단한 사용자가 없습니다.
            </Text>
          </ScrollArea>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
