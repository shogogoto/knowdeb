import AuthGuard from "~/features/auth/AuthGuard";
import NamespaceExplorer from "~/features/namespace/components/NamespaceExplorer";
import { useAuth } from "../auth/AuthProvider";
import UserProfile from "../user/UserProfile";

export default function Home() {
  const { user } = useAuth();
  return (
    <AuthGuard>
      <UserProfile user={user} />
      <div className="mt-8">
        <NamespaceExplorer />
      </div>
    </AuthGuard>
  );
}
