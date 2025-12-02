import {
  Center,
  Loader,
  Text,
  Stack,
  Paper,
  Skeleton,
  Group,
} from "@mantine/core";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({
  message = "로딩 중...",
  fullScreen = false,
}: LoadingStateProps) {
  const content = (
    <Stack align="center" gap="md">
      <Loader size="lg" />
      <Text c="dimmed">{message}</Text>
    </Stack>
  );

  if (fullScreen) {
    return (
      <Center
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          zIndex: 9999,
        }}
      >
        {content}
      </Center>
    );
  }

  return (
    <Center py="xl">
      {content}
    </Center>
  );
}

// 메시지 스켈레톤
export function MessageSkeleton() {
  return (
    <Group align="flex-start" gap="md">
      <Skeleton circle height={40} />
      <Stack gap="xs" style={{ flex: 1 }}>
        <Group gap="xs">
          <Skeleton height={12} width={80} />
          <Skeleton height={10} width={40} />
        </Group>
        <Skeleton height={60} radius="md" />
      </Stack>
    </Group>
  );
}

// 채널 카드 스켈레톤
export function ChannelCardSkeleton() {
  return (
    <Paper p="lg" withBorder radius="md">
      <Group mb="md">
        <Skeleton circle height={48} />
        <Stack gap="xs" style={{ flex: 1 }}>
          <Skeleton height={14} width="60%" />
          <Group gap="xs">
            <Skeleton height={20} width={40} radius="xl" />
            <Skeleton height={12} width={60} />
          </Group>
        </Stack>
      </Group>
      <Skeleton height={14} width="100%" mb="xs" />
      <Skeleton height={14} width="80%" />
    </Paper>
  );
}

// 친구 리스트 스켈레톤
export function FriendSkeleton() {
  return (
    <Paper p="md" withBorder>
      <Group justify="space-between">
        <Group gap="md">
          <Skeleton circle height={48} />
          <Stack gap="xs">
            <Skeleton height={14} width={80} />
            <Skeleton height={12} width={50} />
          </Stack>
        </Group>
        <Skeleton height={32} width={100} radius="md" />
      </Group>
    </Paper>
  );
}

// 사이드바 스켈레톤
export function SidebarSkeleton() {
  return (
    <Stack gap="md" p="md">
      {[1, 2, 3].map((section) => (
        <Stack key={section} gap="xs">
          <Group gap="sm">
            <Skeleton circle height={24} />
            <Skeleton height={14} width={80} />
          </Group>
          {[1, 2, 3].map((item) => (
            <Group key={item} gap="sm" pl="xl">
              <Skeleton circle height={20} />
              <Skeleton height={12} width={100} />
            </Group>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}

// 프로필 스켈레톤
export function ProfileSkeleton() {
  return (
    <Paper p="xl" withBorder radius="md">
      <Stack align="center" gap="md">
        <Skeleton circle height={120} />
        <Skeleton height={24} width={100} radius="xl" />
        <Skeleton height={24} width={120} />
        <Skeleton height={14} width={200} />
        <Skeleton height={36} width={140} radius="md" />
      </Stack>
    </Paper>
  );
}

