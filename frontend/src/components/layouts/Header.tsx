import {
  Burger,
  Group,
  Text,
  Avatar,
  Menu,
  UnstyledButton,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import {
  HiArrowRightOnRectangle,
  HiCog6Tooth,
  HiUser,
} from "react-icons/hi2";

interface HeaderProps {
  isAuthenticated: boolean;
  opened: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export function Header({
  isAuthenticated,
  opened,
  onToggle,
  onLogout,
}: HeaderProps) {
  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        {/* 로그인 상태일 때만 햄버거 버튼 표시 */}
        {isAuthenticated && (
          <Burger
            opened={opened}
            onClick={onToggle}
            hiddenFrom="sm"
            size="sm"
          />
        )}
        <Link to="/" style={{ textDecoration: "none" }}>
          <Text fw={700} c="dark" style={{ cursor: "pointer" }}>
            v0.0.2
          </Text>
        </Link>
      </Group>

      {/* 로그인 상태일 때만 프로필 메뉴 표시 */}
      {isAuthenticated && (
        <Menu shadow="md" width={200} position="bottom-end" zIndex={1100}>
          <Menu.Target>
            <UnstyledButton>
              <Group gap="xs">
                <Avatar size="sm" radius="xl" color="blue">
                  나
                </Avatar>
                <Text size="sm" fw={500} visibleFrom="sm">
                  사용자
                </Text>
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>내 계정</Menu.Label>
            <Menu.Item leftSection={<HiUser size={16} />}>
              프로필 보기
            </Menu.Item>
            <Menu.Item leftSection={<HiCog6Tooth size={16} />}>
              설정
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item
              color="red"
              leftSection={<HiArrowRightOnRectangle size={16} />}
              onClick={onLogout}
            >
              로그아웃
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
