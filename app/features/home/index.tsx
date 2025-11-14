import { Link } from "react-router";
import AuthGuard from "~/features/auth/AuthGuard";
import NamespaceExplorer from "~/features/namespace/components/NamespaceExplorer";
import Uploader from "~/features/namespace/uploader/Uploader";
import { Button } from "~/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "~/shared/components/ui/dialog";
import { useAuth } from "../auth/AuthProvider";
import UserDetail from "../user/UserDetail";
import useUserDetail from "../user/UserDetail/hooks";

export default function Home() {
  const { user } = useAuth();
  const props = useUserDetail({ user });
  return (
    <AuthGuard>
      <Dialog>
        <UserDetail user={user} {...props}>
          <Button asChild className="px-4 py-2 text-md">
            <Link to="/user/edit">プロフィールを編集</Link>
          </Button>
          <DialogTrigger asChild>
            <Button className="text-md">Upload Files</Button>
          </DialogTrigger>
        </UserDetail>
        <div className="mt-8">
          <NamespaceExplorer updater={props.triggerUserDetail} />
        </div>
        <DialogContent className="sm:max-w-[40vw] max-h-[90vh] overflow-y-auto justify-center">
          <div className="absolute right-4 top-4">
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
          <Uploader />
        </DialogContent>
      </Dialog>
    </AuthGuard>
  );
}
