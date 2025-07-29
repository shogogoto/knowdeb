import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="border cursor-pointer rounded-md"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="text-gray-800" />
      ) : (
        <Sun className="text-yellow-200" />
      )}
    </button>
  );
}
