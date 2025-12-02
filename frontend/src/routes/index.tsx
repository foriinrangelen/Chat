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
  ScrollArea,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAtom } from "jotai";
import { HiHashtag, HiPlus, HiArrowRightOnRectangle } from "react-icons/hi2";
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
  channelsAtom,
  workspacesAtom,
  getWorkspacesByChannelId,
  CURRENT_USER_ID,
  type Channel,
} from "@/store/discord";
import { CreateChannelModal } from "@/components/modals/CreateChannelModal";
import { JoinChannelModal } from "@/components/modals/JoinChannelModal";

export const Route = createFileRoute("/")({
  component: HomePage,
});

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

// 채널 색상 배열
const CHANNEL_COLORS = ["blue", "grape", "teal", "orange", "pink", "cyan"];

function HomePage() {
  const navigate = useNavigate();
  const [channels, setChannels] = useAtom(channelsAtom);
  const [workspaces, setWorkspaces] = useAtom(workspacesAtom);

  // 모달 상태
  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);
  const [joinModalOpened, { open: openJoinModal, close: closeJoinModal }] =
    useDisclosure(false);

  const getChannelColor = (index: number) => {
    return CHANNEL_COLORS[index % CHANNEL_COLORS.length];
  };

  const handleChannelClick = (channelId: number) => {
    const channelWorkspaces = getWorkspacesByChannelId(workspaces, channelId);
    const firstWorkspace = channelWorkspaces[0];
    if (firstWorkspace) {
      navigate({
        to: `/chat?type=workspace&channelId=${channelId}&workspaceId=${firstWorkspace.id}`,
      });
    }
  };

  const handleCreateChannel = (channelData: {
    name: string;
    description: string;
    icon: string;
    iconType: "initial" | "language" | "custom";
    iconColor?: string;
    customImage?: string;
  }) => {
    const maxId = Math.max(...channels.map((ch) => ch.id), 0);
    const newChannel: Channel = {
      id: maxId + 1,
      name: channelData.name,
      icon: channelData.icon,
      description: channelData.description,
      ownerId: CURRENT_USER_ID,
      iconType: channelData.iconType,
      iconColor: channelData.iconColor,
      customImage: channelData.customImage,
    };

    // 채널 추가
    setChannels([...channels, newChannel]);

    // 기본 워크스페이스(일반) 추가
    const maxWsId = Math.max(...workspaces.map((ws) => ws.id), 0);
    setWorkspaces([
      ...workspaces,
      { id: maxWsId + 1, name: "일반", channelId: newChannel.id },
    ]);
  };

  const handleJoinChannel = (channelId: number) => {
    // 실제로는 API 호출하여 채널 참가 처리
    console.log("채널 참가:", channelId);
  };

  // 채널 아이콘 렌더링
  const renderChannelIcon = (channel: Channel, index: number) => {
    if (channel.iconType === "custom" && channel.customImage) {
      return <Avatar src={channel.customImage} size="lg" radius="md" />;
    }

    if (channel.iconType === "language" && channel.icon) {
      const IconComponent = LANGUAGE_ICON_MAP[channel.icon];
      if (IconComponent) {
        return (
          <Avatar size="lg" radius="md" color="gray">
            <IconComponent
              size={28}
              style={{ color: channel.iconColor || "#666" }}
            />
          </Avatar>
        );
      }
    }

    // 기본 이니셜
    return (
      <Avatar
        size="lg"
        radius="md"
        color={channel.iconColor || getChannelColor(index)}
      >
        {channel.icon || channel.name[0]}
      </Avatar>
    );
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
          onClick={openCreateModal}
        >
          채널 생성하기
        </Button>
        <Button
          leftSection={<HiArrowRightOnRectangle size={18} />}
          variant="light"
          color="gray"
          onClick={openJoinModal}
        >
          채널 참가하기
        </Button>
      </Group>

      {/* 채널 리스트 */}
      <ScrollArea h="calc(100vh - 300px)">
        {channels.length > 0 ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md" pr="md">
            {channels.map((channel, index) => {
              const channelWorkspaces = getWorkspacesByChannelId(
                workspaces,
                channel.id
              );

              return (
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
                    {renderChannelIcon(channel, index)}
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

                  {/* 채널 설명 */}
                  <Text size="sm" c="dimmed" lineClamp={2} mb="sm">
                    {channel.description ||
                      "팀원들과 함께 소통하는 채널입니다."}
                  </Text>

                  {/* 워크스페이스 정보 */}
                  <Group gap={4} mt="xs">
                    <ThemeIcon size="xs" variant="transparent" color="orange">
                      <HiHashtag size={12} />
                    </ThemeIcon>
                    <Text size="xs" c="dimmed">
                      워크스페이스 {channelWorkspaces.length}개
                    </Text>
                  </Group>
                </Card>
              );
            })}
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
      </ScrollArea>

      {/* 모달들 */}
      <CreateChannelModal
        opened={createModalOpened}
        onClose={closeCreateModal}
        onCreateChannel={handleCreateChannel}
      />
      <JoinChannelModal
        opened={joinModalOpened}
        onClose={closeJoinModal}
        onJoinChannel={handleJoinChannel}
      />
    </>
  );
}
