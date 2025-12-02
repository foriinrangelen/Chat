import { Burger, Group, Text, Button } from "@mantine/core";
import { Link } from "@tanstack/react-router";

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
      {/* 로그인 상태일 때만 로그아웃 버튼 표시 */}
      {isAuthenticated && (
        <Button onClick={onLogout} color="red" size="xs">
          로그아웃
        </Button>
      )}
    </Group>
  );
}

