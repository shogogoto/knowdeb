import { useNavigate } from "react-router";
import { ThemeProvider } from "~/components/theme";
import { ThemeToggle } from "~/components/theme/theme-toggle";
// import type { Route } from "./+types/home";

// export function meta({}: Route.MetaArgs) {
export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const themeScript = `
    (function() {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const storedTheme = localStorage.getItem('vite-ui-theme');
      const theme = storedTheme || (prefersDark ? 'dark' : 'light');
      document.documentElement.classList.add(theme);
    })();
  `;
  // <script dangerouslySetInnerHTML={{ __html: themeScript }} />
  // <ThemeProvider>{children}</ThemeProvider>
  const navigate = useNavigate();

  return (
    <ThemeProvider>
      <ThemeToggle />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <main className="flex flex-col items-center pt-16 pb-4 min-h-screen bg-white dark:bg-gray-950">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">知識データベース</h1>
          </div>
          <div className="my-8">
            <button
              type="button"
              onClick={() => navigate("/search")}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              知識検索ページへ
            </button>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
