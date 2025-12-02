import {
  Center,
  Text,
  Stack,
  Paper,
  Button,
  Title,
  ThemeIcon,
} from "@mantine/core";
import {
  HiExclamationTriangle,
  HiArrowPath,
  HiHome,
  HiWifi,
  HiLockClosed,
  HiQuestionMarkCircle,
} from "react-icons/hi2";
import { useNavigate } from "@tanstack/react-router";

type ErrorType = "general" | "network" | "auth" | "not-found";

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

const errorConfig: Record<
  ErrorType,
  { icon: React.ReactNode; title: string; message: string; color: string }
> = {
  general: {
    icon: <HiExclamationTriangle size={48} />,
    title: "오류가 발생했습니다",
    message: "요청을 처리하는 중에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
    color: "red",
  },
  network: {
    icon: <HiWifi size={48} />,
    title: "네트워크 오류",
    message: "인터넷 연결을 확인해주세요. 연결이 불안정합니다.",
    color: "orange",
  },
  auth: {
    icon: <HiLockClosed size={48} />,
    title: "인증이 필요합니다",
    message: "이 페이지에 접근하려면 로그인이 필요합니다.",
    color: "yellow",
  },
  "not-found": {
    icon: <HiQuestionMarkCircle size={48} />,
    title: "페이지를 찾을 수 없습니다",
    message: "요청하신 페이지가 존재하지 않거나 이동되었습니다.",
    color: "gray",
  },
};

export function ErrorState({
  type = "general",
  title,
  message,
  onRetry,
  showHomeButton = true,
}: ErrorStateProps) {
  const navigate = useNavigate();
  const config = errorConfig[type];

  return (
    <Center py="xl">
      <Paper p="xl" radius="md" withBorder maw={400} w="100%">
        <Stack align="center" gap="md">
          <ThemeIcon
            size={80}
            radius="xl"
            variant="light"
            color={config.color}
          >
            {config.icon}
          </ThemeIcon>

          <Title order={3} ta="center">
            {title || config.title}
          </Title>

          <Text c="dimmed" ta="center" size="sm">
            {message || config.message}
          </Text>

          <Stack gap="xs" w="100%">
            {onRetry && (
              <Button
                fullWidth
                leftSection={<HiArrowPath size={16} />}
                onClick={onRetry}
              >
                다시 시도
              </Button>
            )}

            {showHomeButton && (
              <Button
                fullWidth
                variant="light"
                leftSection={<HiHome size={16} />}
                onClick={() => navigate({ to: "/" })}
              >
                홈으로 이동
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Center>
  );
}

// 인라인 에러 메시지 (작은 영역용)
interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
}

export function InlineError({ message, onRetry }: InlineErrorProps) {
  return (
    <Paper p="sm" radius="md" bg="red.0">
      <Stack gap="xs" align="center">
        <Text size="sm" c="red" ta="center">
          {message}
        </Text>
        {onRetry && (
          <Button
            size="xs"
            variant="light"
            color="red"
            leftSection={<HiArrowPath size={12} />}
            onClick={onRetry}
          >
            다시 시도
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

// 빈 상태 컴포넌트
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <Center py="xl">
      <Stack align="center" gap="md">
        {icon && (
          <ThemeIcon size={64} radius="xl" variant="light" color="gray">
            {icon}
          </ThemeIcon>
        )}

        <Title order={4} ta="center" c="dimmed">
          {title}
        </Title>

        {message && (
          <Text size="sm" c="dimmed" ta="center" maw={300}>
            {message}
          </Text>
        )}

        {action && (
          <Button variant="light" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </Stack>
    </Center>
  );
}

