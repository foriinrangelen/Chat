// import { createRootRoute, Outlet, useNavigate, redirect, createFileRoute } from "@tanstack/react-router"
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
// import { AppShell, Box } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
// import { useState, useRef, useEffect } from "react";

// // Jotai 관련 임포트
// import { useAtom } from "jotai";
// import { isAuthenticatedAtom } from "@/store/auth";

// // Layouts
// import { Sidebar } from "@components/layouts/Sidebar";
// import { Header } from "@components/layouts/Header";

// export const Route = createRootRoute("/__root copy 2")({
//   component: RootLayout,
//   // [최신 방식] 컴포넌트가 렌더링되기 전에 '먼저' 실행되어 검사합니다.
//   beforeLoad: ({ location }) => {
//     // localStorage에서 인증 상태 확인
//     const storedValue = localStorage.getItem("isAuthenticated");
//     const isAuth = storedValue === "true" || storedValue === 'true"';

//     // 인증 안 된 사용자: 로그인 페이지가 아니면 로그인 페이지로 리다이렉트
//     if (!isAuth && location.pathname !== "/AuthenticationForm") {
//       throw redirect({
//         to: "/AuthenticationForm",
//       });
//     }

//     // 인증된 사용자: 로그인 페이지에 있으면 채팅 페이지로 리다이렉트
//     if (isAuth && location.pathname === "/AuthenticationForm") {
//       throw redirect({
//         to: "/chat",
//       });
//     }
//   },
// });

// function RootLayout() {
//   const [opened, { toggle }] = useDisclosure();
//   const [sidebarWidth, setSidebarWidth] = useState(350);
//   const isResizing = useRef(false);

//   // useAtom을 사용하여 전역 상태와 변경 함수(setIsAuthenticated)를 가져옵니다.
//   const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
//   const navigate = useNavigate();

//   // 로그아웃 핸들러
//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     navigate({ to: "/AuthenticationForm" });
//   };

//   // 리사이즈 시작
//   const startResizing = () => {
//     isResizing.current = true;
//     document.body.style.cursor = "ew-resize";
//     document.body.style.userSelect = "none";
//   };

//   // 리사이즈 중
//   const handleMouseMove = (e: MouseEvent) => {
//     if (!isResizing.current) return;

//     const newWidth = e.clientX;
//     // 최소 250px, 최대 600px
//     if (newWidth >= 250 && newWidth <= 600) {
//       setSidebarWidth(newWidth);
//     }
//   };

//   // 리사이즈 종료
//   const stopResizing = () => {
//     isResizing.current = false;
//     document.body.style.cursor = "";
//     document.body.style.userSelect = "";
//   };

//   // 이벤트 리스너 등록
//   useEffect(() => {
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", stopResizing);

//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", stopResizing);
//     };
//   }, []);

//   return (
//     <AppShell
//       header={{ height: 60 }}
//       navbar={{
//         width: sidebarWidth,
//         breakpoint: "sm",
//         // 로그인 안 되어 있으면 데스크탑에서도 사이드바 숨김
//         collapsed: { mobile: !opened, desktop: !isAuthenticated },
//       }}
//       padding={0}
//     >
//       <AppShell.Header>
//         <Header
//           isAuthenticated={isAuthenticated}
//           opened={opened}
//           onToggle={toggle}
//           onLogout={handleLogout}
//         />
//       </AppShell.Header>

//       {/* 로그인 상태일 때만 Navbar 렌더링 */}
//       {isAuthenticated && (
//         <AppShell.Navbar p={0} style={{ position: "relative" }}>
//           <Sidebar />
//           {/* 리사이즈 핸들 */}
//           <Box
//             onMouseDown={startResizing}
//             style={{
//               position: "absolute",
//               top: 0,
//               right: 0,
//               bottom: 0,
//               width: "4px",
//               cursor: "ew-resize",
//               backgroundColor: "transparent",
//               transition: "background-color 0.2s",
//               zIndex: 1000,
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor =
//                 "var(--mantine-color-blue-6)";
//             }}
//             onMouseLeave={(e) => {
//               if (!isResizing.current) {
//                 e.currentTarget.style.backgroundColor = "transparent";
//               }
//             }}
//           />
//         </AppShell.Navbar>
//       )}

//       <AppShell.Main>
//         <Outlet />
//       </AppShell.Main>
//       <TanStackRouterDevtools />
//     </AppShell>
//   );
// }
