import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useAuth } from "../AuthProvider";

export default function LogoutDialogContent() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  async function handleClick() {
    await signOut();
    navigate("/");
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>ログアウトの確認</DialogTitle>
        <DialogDescription>本当にログアウトしますか？</DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2 sm:gap-0">
        <DialogClose asChild>
          <Button variant="outline">キャンセル</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="button" onClick={handleClick}>
            ログアウト
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
