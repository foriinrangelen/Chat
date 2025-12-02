import { createFileRoute } from "@tanstack/react-router";
import {
  Title,
  Text,
  Paper,
  Group,
  Stack,
  Switch,
  SegmentedControl,
  Divider,
  Button,
  Alert,
} from "@mantine/core";
import { useAtom } from "jotai";
import {
  HiCog6Tooth,
  HiBell,
  HiShieldCheck,
  HiSun,
  HiMoon,
  HiComputerDesktop,
  HiExclamationTriangle,
} from "react-icons/hi2";
import { userSettingsAtom, type UserSettings } from "@/store/user";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [settings, setSettings] = useAtom(userSettingsAtom);

  const updateNotificationSetting = (
    key: keyof UserSettings["notifications"],
    value: boolean
  ) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
  };

  const updatePrivacySetting = (
    key: keyof UserSettings["privacy"],
    value: boolean
  ) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value,
      },
    });
  };

  const themeIcons: Record<string, React.ReactNode> = {
    light: <HiSun size={16} />,
    dark: <HiMoon size={16} />,
    system: <HiComputerDesktop size={16} />,
  };

  return (
    <>
      <Group gap="sm" mb="xl">
        <HiCog6Tooth size={28} style={{ color: "#868e96" }} />
        <Title order={2}>설정</Title>
      </Group>

      <Stack gap="lg">
        {/* 테마 설정 */}
        <Paper p="lg" withBorder radius="md">
          <Group gap="sm" mb="md">
            <HiSun size={20} style={{ color: "#fab005" }} />
            <Text fw={600}>테마</Text>
          </Group>
          <SegmentedControl
            value={settings.theme}
            onChange={(value) =>
              setSettings({
                ...settings,
                theme: value as "light" | "dark" | "system",
              })
            }
            data={[
              {
                value: "light",
                label: (
                  <Group gap={4}>
                    <HiSun size={14} />
                    <span>라이트</span>
                  </Group>
                ),
              },
              {
                value: "dark",
                label: (
                  <Group gap={4}>
                    <HiMoon size={14} />
                    <span>다크</span>
                  </Group>
                ),
              },
              {
                value: "system",
                label: (
                  <Group gap={4}>
                    <HiComputerDesktop size={14} />
                    <span>시스템</span>
                  </Group>
                ),
              },
            ]}
            fullWidth
          />
          <Text size="xs" c="dimmed" mt="xs">
            * 다크 모드는 현재 개발 중입니다.
          </Text>
        </Paper>

        {/* 알림 설정 */}
        <Paper p="lg" withBorder radius="md">
          <Group gap="sm" mb="md">
            <HiBell size={20} style={{ color: "#228be6" }} />
            <Text fw={600}>알림</Text>
          </Group>
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text size="sm">알림 소리</Text>
                <Text size="xs" c="dimmed">
                  새 알림이 올 때 소리로 알려줍니다
                </Text>
              </div>
              <Switch
                checked={settings.notifications.sound}
                onChange={(e) =>
                  updateNotificationSetting("sound", e.currentTarget.checked)
                }
              />
            </Group>

            <Divider />

            <Group justify="space-between">
              <div>
                <Text size="sm">데스크톱 알림</Text>
                <Text size="xs" c="dimmed">
                  브라우저 푸시 알림을 받습니다
                </Text>
              </div>
              <Switch
                checked={settings.notifications.desktop}
                onChange={(e) =>
                  updateNotificationSetting("desktop", e.currentTarget.checked)
                }
              />
            </Group>

            <Divider />

            <Group justify="space-between">
              <div>
                <Text size="sm">메시지 알림</Text>
                <Text size="xs" c="dimmed">
                  새 메시지가 올 때 알림을 받습니다
                </Text>
              </div>
              <Switch
                checked={settings.notifications.messages}
                onChange={(e) =>
                  updateNotificationSetting("messages", e.currentTarget.checked)
                }
              />
            </Group>

            <Divider />

            <Group justify="space-between">
              <div>
                <Text size="sm">친구 요청 알림</Text>
                <Text size="xs" c="dimmed">
                  친구 요청이 올 때 알림을 받습니다
                </Text>
              </div>
              <Switch
                checked={settings.notifications.friendRequests}
                onChange={(e) =>
                  updateNotificationSetting(
                    "friendRequests",
                    e.currentTarget.checked
                  )
                }
              />
            </Group>
          </Stack>
        </Paper>

        {/* 개인정보 설정 */}
        <Paper p="lg" withBorder radius="md">
          <Group gap="sm" mb="md">
            <HiShieldCheck size={20} style={{ color: "#12b886" }} />
            <Text fw={600}>개인정보</Text>
          </Group>
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text size="sm">온라인 상태 표시</Text>
                <Text size="xs" c="dimmed">
                  다른 사용자에게 온라인 상태를 보여줍니다
                </Text>
              </div>
              <Switch
                checked={settings.privacy.showOnlineStatus}
                onChange={(e) =>
                  updatePrivacySetting(
                    "showOnlineStatus",
                    e.currentTarget.checked
                  )
                }
              />
            </Group>

            <Divider />

            <Group justify="space-between">
              <div>
                <Text size="sm">친구 요청 허용</Text>
                <Text size="xs" c="dimmed">
                  다른 사용자의 친구 요청을 허용합니다
                </Text>
              </div>
              <Switch
                checked={settings.privacy.allowFriendRequests}
                onChange={(e) =>
                  updatePrivacySetting(
                    "allowFriendRequests",
                    e.currentTarget.checked
                  )
                }
              />
            </Group>
          </Stack>
        </Paper>

        {/* 위험 영역 */}
        <Paper p="lg" withBorder radius="md" style={{ borderColor: "#fa5252" }}>
          <Group gap="sm" mb="md">
            <HiExclamationTriangle size={20} style={{ color: "#fa5252" }} />
            <Text fw={600} c="red">
              위험 영역
            </Text>
          </Group>
          <Alert color="red" variant="light" mb="md">
            아래 작업은 되돌릴 수 없습니다. 신중하게 진행해주세요.
          </Alert>
          <Stack gap="sm">
            <Button variant="outline" color="red" fullWidth>
              모든 데이터 초기화
            </Button>
            <Button variant="filled" color="red" fullWidth>
              계정 삭제
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </>
  );
}
