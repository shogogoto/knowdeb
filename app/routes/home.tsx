import AuthGuard from "~/features/auth/AuthGuard";
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
  return (
    <AuthGuard>
      <UserProfile />
      <div className="mt-8">
        <NamespaceExplorer />
      </div>
    </AuthGuard>
  );
}
