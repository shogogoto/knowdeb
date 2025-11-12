import { Link } from "react-router";
import AuthGuard from "~/features/auth/AuthGuard";
import NamespaceExplorer from "~/features/namespace/components/NamespaceExplorer";
import { Button } from "~/shared/components/ui/button";
import { useAuth } from "../auth/AuthProvider";
import UserDetail from "../user/UserDetail";
import useUserDetail from "../user/UserDetail/hooks";

export default function Home() {
  const { user } = useAuth();
  const props = useUserDetail({ user });
  return (
    <AuthGuard>
      <UserDetail user={user} {...props}>
        <Button asChild className="px-4 py-2 text-md">
          <Link to="/user/edit">プロフィールを編集</Link>
        </Button>
      </UserDetail>
      <div className="mt-8">
        <NamespaceExplorer updater={props.triggerUserDetail} />
      </div>
    </AuthGuard>
  );
}
