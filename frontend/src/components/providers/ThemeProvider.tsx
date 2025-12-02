import { MantineProvider, useMantineColorScheme } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { theme } from "@/styles/theme";
import { userSettingsAtom } from "@/store/user";

// 테마 동기화 컴포넌트
function ThemeSyncer() {
  const settings = useAtomValue(userSettingsAtom);
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (settings.theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setColorScheme(isDark ? "dark" : "light");

      // 시스템 테마 변경 감지
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => {
        setColorScheme(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      setColorScheme(settings.theme);
    }
  }, [settings.theme, setColorScheme]);

  return null;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // localStorage에서 저장된 테마 읽기
  const getDefaultColorScheme = (): "light" | "dark" | "auto" => {
    try {
      const stored = localStorage.getItem("userSettings");
      if (stored) {
        const settings = JSON.parse(stored);
        if (settings.theme === "system") {
          return "auto";
        }
        return settings.theme === "dark" ? "dark" : "light";
      }
    } catch {
      // 파싱 실패시 기본값
    }
    return "light";
  };

  return (
    <MantineProvider theme={theme} defaultColorScheme={getDefaultColorScheme()}>
      <ThemeSyncer />
      {children}
    </MantineProvider>
  );
}
