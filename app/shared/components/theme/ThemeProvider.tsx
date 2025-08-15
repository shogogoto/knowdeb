import { createContext, useContext, useEffect, useState } from "react";
import { getItem, setItem } from "~/lib/storage";
import type { Theme, ThemeProviderState } from "./types";

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

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
  root.classList.add(appliedTheme);
};

type Props = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: Props) {
  const [theme, setThemeState] = useState<Theme>(
    () =>
      (typeof window !== "undefined" &&
        // @ts-ignore
        (window.__theme || (getItem(storageKey) as Theme))) ||
      defaultTheme,
  );

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  function setThemeAndPersist(newTheme: Theme) {
    setItem(storageKey, newTheme);
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
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    // ThemeProvider の外で useTheme が呼ばれた場合にエラーをスロー
    throw new Error("useTheme must be used within a ThemeProvider.");
  }
  return context;
};
