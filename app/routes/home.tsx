import AuthGuard from "~/features/auth/AuthGuard";
import { useAuth } from "~/features/auth/AuthProvider";
import NamespaceExplorer from "~/features/namespace/components/NamespaceExplorer";
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

  return (
    <AuthGuard>
      <UserProfile user={user} />
      <div className="mt-8">
        <NamespaceExplorer />
      </div>
    </AuthGuard>
  );
}
