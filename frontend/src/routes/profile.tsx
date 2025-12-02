import { createFileRoute } from "@tanstack/react-router";
import {
  Title,
  Text,
  Paper,
  Group,
  Avatar,
  Stack,
  TextInput,
  Textarea,
  Button,
  FileButton,
  Divider,
  Badge,
  Card,
  SimpleGrid,
} from "@mantine/core";
import { useAtom } from "jotai";
import { useState } from "react";
import {
  HiUser,
  HiPencil,
  HiPhoto,
  HiCalendar,
  HiEnvelope,
  HiChatBubbleLeftRight,
} from "react-icons/hi2";
import { currentUserAtom } from "@/store/user";
import { MOCK_CHANNELS, channelsAtom, workspacesAtom } from "@/store/discord";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [channels] = useAtom(channelsAtom);
  const [workspaces] = useAtom(workspacesAtom);

  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState(currentUser?.nickname || "");
  const [editStatusMessage, setEditStatusMessage] = useState(
    currentUser?.statusMessage || ""
  );

  if (!currentUser) {
    return (
      <Paper p="xl" withBorder>
        <Text c="dimmed" ta="center">
          로그인이 필요합니다.
        </Text>
      </Paper>
    );
  }

  const handleSave = () => {
    setCurrentUser({
      ...currentUser,
      nickname: editNickname,
      statusMessage: editStatusMessage,
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentUser({
          ...currentUser,
          avatar: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 사용자 통계
  const myChannels = channels.filter((c) => c.ownerId === currentUser.id);
  const totalWorkspaces = workspaces.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Group gap="sm" mb="xl">
        <HiUser size={28} style={{ color: "#228be6" }} />
        <Title order={2}>내 프로필</Title>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {/* 프로필 카드 */}
        <Paper p="xl" withBorder radius="md">
          <Stack align="center" gap="md">
            {/* 아바타 */}
            <div style={{ position: "relative" }}>
              <Avatar
                src={currentUser.avatar}
                size={120}
                radius="xl"
                color="blue"
              >
                {currentUser.nickname[0]}
              </Avatar>
              <FileButton onChange={handleAvatarChange} accept="image/*">
                {(props) => (
                  <Button
                    {...props}
                    size="xs"
                    radius="xl"
                    variant="filled"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                    }}
                  >
                    <HiPhoto size={14} />
                  </Button>
                )}
              </FileButton>
            </div>

            {/* 온라인 상태 */}
            <Badge color={currentUser.isOnline ? "green" : "gray"} size="lg">
              {currentUser.isOnline ? "온라인" : "오프라인"}
            </Badge>

            {/* 닉네임 & 상태 메시지 */}
            {isEditing ? (
              <Stack w="100%" gap="sm">
                <TextInput
                  label="닉네임"
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.currentTarget.value)}
                />
                <Textarea
                  label="상태 메시지"
                  value={editStatusMessage}
                  onChange={(e) => setEditStatusMessage(e.currentTarget.value)}
                  placeholder="상태 메시지를 입력하세요"
                  rows={2}
                />
                <Group justify="center" gap="sm">
                  <Button onClick={handleSave}>저장</Button>
                  <Button variant="subtle" onClick={() => setIsEditing(false)}>
                    취소
                  </Button>
                </Group>
              </Stack>
            ) : (
              <>
                <div style={{ textAlign: "center" }}>
                  <Text fw={700} size="xl">
                    {currentUser.nickname}
                  </Text>
                  <Text c="dimmed" size="sm">
                    {currentUser.statusMessage || "상태 메시지가 없습니다"}
                  </Text>
                </div>
                <Button
                  variant="light"
                  leftSection={<HiPencil size={16} />}
                  onClick={() => setIsEditing(true)}
                >
                  프로필 수정
                </Button>
              </>
            )}
          </Stack>

          <Divider my="lg" />

          {/* 기본 정보 */}
          <Stack gap="sm">
            <Group gap="sm">
              <HiEnvelope size={18} style={{ color: "#868e96" }} />
              <Text size="sm" c="dimmed">
                {currentUser.email}
              </Text>
            </Group>
            <Group gap="sm">
              <HiCalendar size={18} style={{ color: "#868e96" }} />
              <Text size="sm" c="dimmed">
                가입일: {formatDate(currentUser.createdAt)}
              </Text>
            </Group>
          </Stack>
        </Paper>

        {/* 활동 통계 */}
        <Stack gap="lg">
          <Paper p="lg" withBorder radius="md">
            <Text fw={600} mb="md">
              활동 통계
            </Text>
            <SimpleGrid cols={2} spacing="md">
              <Card padding="md" radius="md" withBorder>
                <Text size="xl" fw={700} c="blue">
                  {myChannels.length}
                </Text>
                <Text size="sm" c="dimmed">
                  운영 중인 채널
                </Text>
              </Card>
              <Card padding="md" radius="md" withBorder>
                <Text size="xl" fw={700} c="grape">
                  {channels.length}
                </Text>
                <Text size="sm" c="dimmed">
                  참여 채널
                </Text>
              </Card>
              <Card padding="md" radius="md" withBorder>
                <Text size="xl" fw={700} c="teal">
                  {totalWorkspaces}
                </Text>
                <Text size="sm" c="dimmed">
                  워크스페이스
                </Text>
              </Card>
              <Card padding="md" radius="md" withBorder>
                <Text size="xl" fw={700} c="orange">
                  4
                </Text>
                <Text size="sm" c="dimmed">
                  친구
                </Text>
              </Card>
            </SimpleGrid>
          </Paper>

          {/* 운영 중인 채널 */}
          <Paper p="lg" withBorder radius="md">
            <Group justify="space-between" mb="md">
              <Text fw={600}>운영 중인 채널</Text>
              <Badge>{myChannels.length}</Badge>
            </Group>
            <Stack gap="sm">
              {myChannels.length > 0 ? (
                myChannels.map((channel) => (
                  <Group key={channel.id} gap="sm">
                    <Avatar color="blue" size="sm" radius="sm">
                      {channel.icon}
                    </Avatar>
                    <Text size="sm">{channel.name}</Text>
                  </Group>
                ))
              ) : (
                <Text size="sm" c="dimmed">
                  운영 중인 채널이 없습니다.
                </Text>
              )}
            </Stack>
          </Paper>
        </Stack>
      </SimpleGrid>
    </>
  );
}
