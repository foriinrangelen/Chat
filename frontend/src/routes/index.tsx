import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Title,
  Text,
  Card,
  Group,
  Avatar,
  Badge,
  Button,
  SimpleGrid,
  Stack,
  Paper,
} from "@mantine/core";
import { HiHashtag, HiPlus, HiArrowRightOnRectangle } from "react-icons/hi2";
import { MOCK_SERVERS } from "@/store/discord";

export const Route = createFileRoute("/")({
  component: HomePage,
});

// 채널 색상 배열
const CHANNEL_COLORS = ["blue", "grape", "teal", "orange", "pink", "cyan"];

function HomePage() {
  const navigate = useNavigate();

  const getChannelColor = (index: number) => {
    return CHANNEL_COLORS[index % CHANNEL_COLORS.length];
  };

  const handleChannelClick = (channelId: number) => {
    navigate({ to: `/chat?type=channel&id=${channelId}` });
  };

  return (
    <>
      <Group gap="sm" mb="xl">
        <HiHashtag size={28} style={{ color: "#f97316" }} />
        <Title order={2}>내 채널</Title>
      </Group>

      {/* 채널 액션 버튼 */}
      <Group mb="xl">
        <Button
          leftSection={<HiPlus size={18} />}
          variant="filled"
          color="blue"
        >
          채널 생성하기
        </Button>
        <Button
          leftSection={<HiArrowRightOnRectangle size={18} />}
          variant="light"
          color="gray"
        >
          채널 참가하기
        </Button>
      </Group>

      {/* 채널 리스트 */}
      {MOCK_SERVERS.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {MOCK_SERVERS.map((channel, index) => (
            <Card
              key={channel.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ cursor: "pointer" }}
              onClick={() => handleChannelClick(channel.id)}
            >
              <Group mb="md">
                <Avatar size="lg" radius="md" color={getChannelColor(index)}>
                  {channel.icon}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Text fw={600} size="lg">
                    {channel.name}
                  </Text>
                  <Group gap="xs">
                    <Badge size="sm" variant="light" color="green">
                      활성
                    </Badge>
                    <Text size="xs" c="dimmed">
                      멤버 12명
                    </Text>
                  </Group>
                </div>
              </Group>
              <Text size="sm" c="dimmed" lineClamp={2}>
                팀원들과 함께 소통하는 채널입니다.
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Paper p="xl" withBorder radius="md">
          <Stack align="center" gap="md">
            <HiHashtag size={48} style={{ color: "#adb5bd" }} />
            <Text c="dimmed" ta="center">
              아직 참여 중인 채널이 없습니다.
              <br />
              새로운 채널을 생성하거나 참가해보세요!
            </Text>
          </Stack>
        </Paper>
      )}
    </>
  );
}
