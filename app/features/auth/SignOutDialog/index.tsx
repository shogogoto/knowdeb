import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useAuth } from "../AuthProvider";

type Props = {
  onSelect?: React.MouseEventHandler<HTMLButtonElement>;
  open?: boolean;
} & React.PropsWithChildren;

export function LogoutDialog({ children, onSelect, open }: Props) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  async function handleClick() {
    signOut();
    navigate("/");
  }
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ログアウトの確認</DialogTitle>
          <DialogDescription>本当にログアウトしますか？</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
          <Button type="button" onClick={handleClick}>
            ログアウト
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
