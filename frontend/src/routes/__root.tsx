import {
  createRootRoute,
  Outlet,
  useNavigate,
  redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppShell, Container, Box, ActionIcon } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useState, useCallback, useEffect } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

// Jotai 관련 임포트
import { useAtom } from "jotai";
import { isAuthenticatedAtom } from "@/store/auth";

// Layouts
import { Sidebar } from "@components/layouts/Sidebar";
import { Header } from "@components/layouts/Header";

export const Route = createRootRoute({
  component: RootLayout,
  beforeLoad: ({ location }) => {
    const storedValue = localStorage.getItem("isAuthenticated");
    const isAuth = storedValue === "true" || storedValue === 'true"';

    if (!isAuth && location.pathname !== "/AuthenticationForm") {
      throw redirect({
        to: "/AuthenticationForm",
      });
    }

    if (isAuth && location.pathname === "/AuthenticationForm") {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RootLayout() {
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  // 사이드바 너비 상태 (기본 280px, 최소 200px, 최대 400px)
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);

  // 모바일 감지
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate({ to: "/AuthenticationForm" });
  };

  // 리사이즈 시작
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) return;
      e.preventDefault();
      setIsResizing(true);
    },
    [isMobile]
  );

  // 리사이즈 중
  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || isMobile) return;
      const newWidth = Math.min(Math.max(e.clientX, 200), 400);
      setSidebarWidth(newWidth);
    },
    [isResizing, isMobile]
  );

  // 리사이즈 끝
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // 마우스 이벤트 리스너
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", handleResizeEnd);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", handleResizeEnd);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleResize, handleResizeEnd]);

  // 데스크톱에서 실제 사이드바 너비
  const actualNavbarWidth = desktopOpened ? sidebarWidth : 0;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: isMobile ? 300 : actualNavbarWidth,
        breakpoint: "sm",
        collapsed: {
          mobile: !mobileOpened,
          desktop: !isAuthenticated || !desktopOpened,
        },
      }}
      padding="md"
    >
      <AppShell.Header style={{ zIndex: 1000 }}>
        <Header
          isAuthenticated={isAuthenticated}
          opened={mobileOpened}
          onToggle={isMobile ? toggleMobile : toggleDesktop}
        />
      </AppShell.Header>

      {/* 사이드바 */}
      {isAuthenticated && (
        <AppShell.Navbar p={0} style={{ zIndex: 999 }}>
          <Sidebar
            onClose={isMobile ? closeMobile : undefined}
            onLogout={handleLogout}
          />

          {/* 데스크톱: 리사이즈 핸들 */}
          {!isMobile && desktopOpened && (
            <Box
              onMouseDown={handleResizeStart}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 4,
                cursor: "col-resize",
                backgroundColor: isResizing ? "#228be6" : "transparent",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isResizing)
                  e.currentTarget.style.backgroundColor = "#dee2e6";
              }}
              onMouseLeave={(e) => {
                if (!isResizing)
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
            />
          )}
        </AppShell.Navbar>
      )}

      {/* 데스크톱: 사이드바 토글 버튼 (사이드바 닫혀있을 때) */}
      {isAuthenticated && !isMobile && !desktopOpened && (
        <ActionIcon
          variant="filled"
          color="blue"
          size="xl"
          radius="xl"
          onClick={toggleDesktop}
          style={{
            position: "fixed",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1001,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <HiChevronRight size={24} />
        </ActionIcon>
      )}

      {/* 데스크톱: 사이드바 접기 버튼 (사이드바 열려있을 때) */}
      {isAuthenticated && !isMobile && desktopOpened && (
        <ActionIcon
          variant="filled"
          color="gray"
          size="lg"
          radius="xl"
          onClick={toggleDesktop}
          style={{
            position: "fixed",
            left: actualNavbarWidth - 18,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1001,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <HiChevronLeft size={20} />
        </ActionIcon>
      )}

      <AppShell.Main>
        <Container size="lg" py="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
      {/* <TanStackRouterDevtools /> */}
    </AppShell>
  );
}
