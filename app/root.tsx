import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import ThemeScript from "./components/theme/ThemeScript";
import { AuthProvider } from "./features/auth/AuthProvider";
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "icon", href: "/favicon.ico?v=1", sizes: "any" },
  { rel: "icon", href: "/favicon.svg?v=1", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png?v=1" },
  { rel: "manifest", href: "/manifest.json?v=1" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ThemeScript />
        <script
          src="https://upload-widget.cloudinary.com/latest/global/all.js"
          type="text/javascript"
          async
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
export async function loader(args: Route.LoaderArgs) {
  // return rootAuthLoader(args);
  return null;
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </ThemeProvider>
  );
}
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{message}</CardTitle>
          <CardDescription>{details}</CardDescription>
        </CardHeader>
        {stack && (
          <CardContent>
            <pre className="w-full p-4 overflow-x-auto bg-gray-100 dark:bg-gray-800 rounded-md">
              <code>{stack}</code>
            </pre>
          </CardContent>
        )}
      </Card>
    </main>
  );
}
