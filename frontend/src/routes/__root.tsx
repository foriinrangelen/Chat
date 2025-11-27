import {
  createRootRoute,
  Outlet,
  Link,
  useNavigate,
  redirect,
} from "@tanstack/react-router"; // 1. useNavigate 추가
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppShell, Burger, Group, Text, Button } from "@mantine/core"; // Button 추가
import { useDisclosure } from "@mantine/hooks";

// 1. Jotai 관련 임포트
import { useAtom } from "jotai";
import { isAuthenticatedAtom } from "@/store/auth"; // 경로에 맞게 수정하세요

export const Route = createRootRoute({
  component: RootLayout,
  // [최신 방식] 컴포넌트가 렌더링되기 전에 '먼저' 실행되어 검사합니다.
  beforeLoad: ({ location }) => {
    // 1. Jotai가 저장한 localStorage 값을 직접 확인
    // (atomWithStorage는 기본적으로 JSON 형태로 저장하므로 파싱이 필요할 수 있으나,
    // 단순 boolean 저장은 문자열 "false"/"true"로 저장될 수 있음. 상황에 맞춰 체크)

    // 안전하게 체크: 스토리지를 읽어서 값이 없는지 확인
    // (실제 프로덕션에선 토큰 유효성을 검사하는 함수를 따로 만드는 게 좋습니다)
    const storedValue = localStorage.getItem("isAuthenticated");
    const isAuth = storedValue === "true" || storedValue === 'true"'; // JSON stringify 고려

    // 2. 로그인이 안 되어 있고 + 로그인 페이지가 아니라면 -> 강제 이동(Redirect)
    if (!isAuth && location.pathname !== "/AuthenticationForm") {
      throw redirect({
        to: "/AuthenticationForm",
      });
    }
  },
});

function RootLayout() {
  const [opened, { toggle }] = useDisclosure();

  // 2. useAtom을 사용하여 전역 상태와 변경 함수(setIsAuthenticated)를 가져옵니다.
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  // 2. navigate 함수 생성
  const navigate = useNavigate();
  // 로그아웃 핸들러 (테스트용)
  const handleLogout = () => {
    setIsAuthenticated(false);
    // 필요시 홈으로 리다이렉트 등의 로직 추가
    // 3. 로그아웃 후 로그인 페이지로 이동
    navigate({ to: "/AuthenticationForm" });
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        // 로그인 안 되어 있으면 데스크탑에서도 사이드바 숨김
        collapsed: { mobile: !opened, desktop: !isAuthenticated },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          {" "}
          {/* justify="space-between"으로 양끝 정렬 */}
          <Group>
            {/* 로그인 상태일 때만 햄버거 버튼 표시 */}
            {isAuthenticated && (
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
            )}
            <Text fw={700}>v1.0.0</Text>
          </Group>
          {/* 로그인 상태일 때만 로그아웃 버튼 표시 (테스트용) */}
          {isAuthenticated && (
            <Button onClick={handleLogout} color="red" size="xs">
              로그아웃
            </Button>
          )}
        </Group>
      </AppShell.Header>

      {/* 로그인 상태일 때만 Navbar 렌더링 */}
      {isAuthenticated && (
        <AppShell.Navbar p="md">
          <Group
            gap="xs"
            preventGrowOverflow={false}
            wrap="nowrap"
            style={{ flexDirection: "column", alignItems: "flex-start" }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Home
            </Link>
            <Link
              to="/about"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              About
            </Link>
          </Group>
        </AppShell.Navbar>
      )}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <TanStackRouterDevtools />
    </AppShell>
  );
}
