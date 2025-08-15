import { Button } from "~/shared/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/shared/components/ui/dialog";

type Props = {
  title: string;
  handleClick: () => void;
};

export default function ConfirmDialogContent({ title, handleClick }: Props) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}の確認</DialogTitle>
        <DialogDescription>本当に{title}しますか？</DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2 sm:gap-0">
        <DialogClose asChild>
          <Button variant="outline">キャンセル</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="button" onClick={handleClick}>
            {title}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
