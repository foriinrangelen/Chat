import {
  createRootRoute,
  Outlet,
  useNavigate,
  redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppShell, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// Jotai 관련 임포트
import { useAtom } from "jotai";
import { isAuthenticatedAtom } from "@/store/auth";

// Layouts
import { Sidebar } from "@components/layouts/Sidebar";
import { Header } from "@components/layouts/Header";

export const Route = createRootRoute({
  component: RootLayout,
  // [최신 방식] 컴포넌트가 렌더링되기 전에 '먼저' 실행되어 검사합니다.
  beforeLoad: ({ location }) => {
    // localStorage에서 인증 상태 확인
    const storedValue = localStorage.getItem("isAuthenticated");
    const isAuth = storedValue === "true" || storedValue === 'true"';

    // 인증 안 된 사용자: 로그인 페이지가 아니면 로그인 페이지로 리다이렉트
    if (!isAuth && location.pathname !== "/AuthenticationForm") {
      throw redirect({
        to: "/AuthenticationForm",
      });
    }

    // 인증된 사용자: 로그인 페이지에 있으면 홈으로 리다이렉트
    if (isAuth && location.pathname === "/AuthenticationForm") {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RootLayout() {
  const [opened, { toggle }] = useDisclosure();

  // useAtom을 사용하여 전역 상태와 변경 함수(setIsAuthenticated)를 가져옵니다.
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const navigate = useNavigate();

  // 로그아웃 핸들러
  const handleLogout = () => {
    setIsAuthenticated(false);
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
      <AppShell.Header style={{ zIndex: 1000 }}>
        <Header
          isAuthenticated={isAuthenticated}
          opened={opened}
          onToggle={toggle}
          onLogout={handleLogout}
        />
      </AppShell.Header>

      {/* 로그인 상태일 때만 Navbar 렌더링 */}
      {isAuthenticated && (
        <AppShell.Navbar p={0} style={{ zIndex: 999 }}>
          <Sidebar />
        </AppShell.Navbar>
      )}

      <AppShell.Main>
        <Container size="lg" py="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
      <TanStackRouterDevtools />
    </AppShell>
  );
}
