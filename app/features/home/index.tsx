import { Link } from "react-router";
import AuthGuard from "~/features/auth/AuthGuard";
import NamespaceExplorer from "~/features/namespace/components/NamespaceExplorer";
import { Button } from "~/shared/components/ui/button";
import { useAuth } from "../auth/AuthProvider";
import UserDetail from "../user/UserDetail";

export default function Home() {
  const { user } = useAuth();
  return (
    <AuthGuard>
      <UserDetail user={user}>
        <Button asChild className="px-4 py-2 text-md">
          <Link to="/user/edit">プロフィールを編集</Link>
        </Button>
      </UserDetail>
      <div className="mt-8">
        <NamespaceExplorer />
      </div>
    </AuthGuard>
  );
}
