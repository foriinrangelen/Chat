import {
  Menu,
  ActionIcon,
  Indicator,
  Stack,
  Group,
  Text,
  Paper,
  Badge,
  Button,
  ScrollArea,
  Divider,
  ThemeIcon,
} from "@mantine/core";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  HiBell,
  HiChatBubbleLeft,
  HiUserPlus,
  HiUserGroup,
  HiHashtag,
  HiAtSymbol,
  HiInformationCircle,
  HiCheck,
  HiTrash,
} from "react-icons/hi2";
import {
  notificationsAtom,
  unreadCountAtom,
  markAsReadAtom,
  markAllAsReadAtom,
  removeNotificationAtom,
  type Notification,
  type NotificationType,
} from "@/store/notification";

// 알림 타입별 아이콘
const getNotificationIcon = (type: NotificationType) => {
  const iconMap: Record<NotificationType, { icon: React.ReactNode; color: string }> = {
    message: { icon: <HiChatBubbleLeft size={16} />, color: "blue" },
    friend_request: { icon: <HiUserPlus size={16} />, color: "grape" },
    friend_accepted: { icon: <HiUserGroup size={16} />, color: "green" },
    channel_invite: { icon: <HiHashtag size={16} />, color: "orange" },
    mention: { icon: <HiAtSymbol size={16} />, color: "pink" },
    system: { icon: <HiInformationCircle size={16} />, color: "gray" },
  };
  return iconMap[type];
};

// 시간 포맷팅
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString("ko-KR");
};

// 개별 알림 아이템
function NotificationItem({
  notification,
  onMarkAsRead,
  onRemove,
}: {
  notification: Notification;
  onMarkAsRead: () => void;
  onRemove: () => void;
}) {
  const { icon, color } = getNotificationIcon(notification.type);

  return (
    <Paper
      p="sm"
      radius="md"
      bg={notification.read ? "transparent" : "blue.0"}
      style={{ cursor: "pointer" }}
      onClick={onMarkAsRead}
    >
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size="md" radius="xl" variant="light" color={color}>
          {icon}
        </ThemeIcon>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" wrap="nowrap">
            <Text size="sm" fw={notification.read ? 400 : 600} lineClamp={1}>
              {notification.title}
            </Text>
            <Group gap={4}>
              {!notification.read && (
                <Badge size="xs" color="blue" variant="filled" circle>
                  N
                </Badge>
              )}
              <ActionIcon
                size="xs"
                variant="subtle"
                color="gray"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <HiTrash size={12} />
              </ActionIcon>
            </Group>
          </Group>
          <Text size="xs" c="dimmed" lineClamp={2}>
            {notification.message}
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            {formatTime(notification.createdAt)}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}

export function NotificationDropdown() {
  const notifications = useAtomValue(notificationsAtom);
  const unreadCount = useAtomValue(unreadCountAtom);
  const markAsRead = useSetAtom(markAsReadAtom);
  const markAllAsRead = useSetAtom(markAllAsReadAtom);
  const removeNotification = useSetAtom(removeNotificationAtom);

  return (
    <Menu shadow="md" width={360} position="bottom-end" zIndex={1100}>
      <Menu.Target>
        <Indicator
          label={unreadCount > 0 ? unreadCount : undefined}
          size={16}
          color="red"
          disabled={unreadCount === 0}
        >
          <ActionIcon variant="subtle" size="lg">
            <HiBell size={20} />
          </ActionIcon>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown>
        {/* 헤더 */}
        <Group justify="space-between" p="sm">
          <Text fw={600}>알림</Text>
          {unreadCount > 0 && (
            <Button
              size="compact-xs"
              variant="subtle"
              leftSection={<HiCheck size={12} />}
              onClick={() => markAllAsRead()}
            >
              모두 읽음
            </Button>
          )}
        </Group>

        <Divider />

        {/* 알림 목록 */}
        <ScrollArea h={400}>
          <Stack gap="xs" p="xs">
            {notifications.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl" size="sm">
                알림이 없습니다
              </Text>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onRemove={() => removeNotification(notification.id)}
                />
              ))
            )}
          </Stack>
        </ScrollArea>
      </Menu.Dropdown>
    </Menu>
  );
}

