import { Moon, Sun } from "lucide-react";
import { cn } from "~/shared/lib/utils";
import { useTheme } from "./ThemeProvider";

type Props = {
  buttonClassName?: string;
  iconClassName?: string;
};

export default function ThemeToggle({ buttonClassName, iconClassName }: Props) {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn("cursor-pointer rounded-md", buttonClassName)}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className={cn("text-gray-800", iconClassName)} />
      ) : (
        <Sun className={cn("text-yellow-200", iconClassName)} />
      )}
    </button>
  );
}
