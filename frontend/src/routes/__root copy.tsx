// // import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
// // import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// // const RootLayout = () => (
// //   <>
// //     <div className="p-2 flex gap-2">
// //       <Link to="/" className="[&.active]:font-bold">
// //         Home
// //       </Link>{" "}
// //       <Link to="/about" className="[&.active]:font-bold">
// //         About
// //       </Link>
// //       <Link to="/AuthenticationForm" className="[&.active]:font-bold">
// //         AuthenticationForm
// //       </Link>
// //     </div>
// //     <hr />
// //     <Outlet />
// //     <TanStackRouterDevtools />
// //   </>
// // );

// // export const Route = createRootRoute({ component: RootLayout });
// import { createRootRoute, Outlet, Link, createFileRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
// import { AppShell, Burger, Group, Text } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";

// export const Route = createRootRoute("/__root copy")({
//   component: RootLayout,
// });

// function RootLayout() {
//   const [opened, { toggle }] = useDisclosure();

//   return (
//     <AppShell
//       header={{ height: 60 }}
//       navbar={{
//         width: 300,
//         breakpoint: "sm",
//         collapsed: { mobile: !opened },
//       }}
//       padding="md"
//     >
//       <AppShell.Header>
//         <Group h="100%" px="md">
//           <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
//           <Text fw={700}>Chat</Text>
//         </Group>
//       </AppShell.Header>

//       <AppShell.Navbar p="md">
//         <Group
//           gap="xs"
//           preventGrowOverflow={false}
//           wrap="nowrap"
//           style={{ flexDirection: "column", alignItems: "flex-start" }}
//         >
//           <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
//             Home
//           </Link>
//           <Link
//             to="/about"
//             style={{ textDecoration: "none", color: "inherit" }}
//           >
//             About
//           </Link>
//           {/* Add more navigation links here */}
//         </Group>
//       </AppShell.Navbar>

//       <AppShell.Main>
//         <Outlet />
//       </AppShell.Main>

//       <TanStackRouterDevtools />
//     </AppShell>
//   );
// }
