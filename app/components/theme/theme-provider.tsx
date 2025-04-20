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

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Function to apply theme to document
const applyThemeClass = (theme: Theme, storageKey: string) => {
  if (typeof window === "undefined") return;

  const root = window.document.documentElement;
  root.classList.remove("light", "dark");

  let appliedTheme = theme;
  if (theme === "system") {
    appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  root.classList.add(appliedTheme);
};

// This function will be called once during SSR or page load
// to avoid flash of unstyled content
export function setInitialTheme(storageKey = "vite-ui-theme") {
  if (typeof window !== "undefined") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
    document.documentElement.classList.add(initialTheme);
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Initial theme setup when component mounts
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage?.getItem(storageKey) as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(defaultTheme);
    }
  }, [defaultTheme, storageKey]);

  // Apply theme class to document element
  useEffect(() => {
    if (!mounted) return;
    applyThemeClass(theme, storageKey);
  }, [theme, mounted, storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(storageKey, theme);
      }
      setTheme(theme);
    },
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
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
