import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

// --- ユーティリティ関数 ---
// ThemeProvider 内部でしか使わないため、ここに置いておくのがシンプル
const applyThemeClass = (theme: Theme) => {
  if (typeof window === "undefined") return; // SSR対応

  const root = window.document.documentElement;
  root.classList.remove("light", "dark"); // 既存のテーマクラスを削除

  let appliedTheme = theme;
  if (theme === "system") {
    appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  root.classList.add(appliedTheme); // 新しいテーマクラスを追加
};
// --- /ユーティリティ関数 ---

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (savedTheme) {
        return savedTheme;
      }
    }
    return defaultTheme;
  });

  const [mounted, setMounted] = useState(false);

  // useEffect の中で localStorage を使うのが安全 (hydration mismatch 防止)
  useEffect(() => {
    setMounted(true);
  }, []);

  // theme が変更されたとき、または mounted が true になったときにテーマを適用
  useEffect(() => {
    if (!mounted) return; // マウントされるまでテーマ適用ロジックを実行しない
    applyThemeClass(theme);
  }, [theme, mounted]);

  function setThemeAndPersist(newTheme: Theme) {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(storageKey, newTheme);
    }
    setThemeState(newTheme);
  }

  const value = {
    theme,
    setTheme: setThemeAndPersist,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
// --- テーマを利用するためのカスタムフック ---
// これは ThemeProviderContext と密接に関連するため、同じファイルに置くのが一般的
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    // ThemeProvider の外で useTheme が呼ばれた場合にエラーをスロー
    throw new Error("useTheme must be used within a ThemeProvider.");
  }
  return context;
};
