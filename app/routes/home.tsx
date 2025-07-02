import { useAuth } from "~/features/auth/AuthProvider";
import UserProfile from "~/features/user/UserProfile";
import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "Knowde" },
    {
      name: "description",
      content: "Welcome to Knowde - Your Knowledge Search Platform",
    },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user, isLoading, isValidating } = useAuth();

  if (user === null)
    return (
      <div className="text-center p-8 bg-card rounded-lg shadow-lg">
        <p className="text-destructive font-bold">認証されていません。</p>
        <p className="text-muted-foreground mt-2">ログインしてしてください。</p>
      </div>
    );

  return <UserProfile user={user} />;
}
