import AuthGuard from "~/features/auth/AuthGuard";
import NamespaceExplorer from "~/features/namespace/components/NamespaceExplorer";
import UserProfile from "../user/UserProfile";

export default function Home() {
  return (
    <AuthGuard>
      <UserProfile />
      <div className="mt-8">
        <NamespaceExplorer />
      </div>
    </AuthGuard>
  );
}
