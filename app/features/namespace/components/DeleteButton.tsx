import { Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useSWRConfig } from "swr";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/shared/components/ui/alert-dialog";
import { Button } from "~/shared/components/ui/button";
import { useDeleteEntryApiEntryEntryIdDelete } from "~/shared/generated/entry/entry";

type Props = {
  entryId: string;
  name: string;
  refresh?: () => void;
};

export default function DeleteButton({ entryId, name, refresh }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();

  const { trigger } = useDeleteEntryApiEntryEntryIdDelete(entryId, {
    fetch: { credentials: "include" },
    swr: {
      onSuccess: () => {
        setOpen(false);
        mutate(
          (key) => typeof key === "string" && key.startsWith("/namaspace"),
        );
        refresh?.();
      },
    },
  });

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setOpen(true);
  }

  function handleConfirmDelete() {
    trigger();
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" onClick={handleClick}>
        <Trash2 className="h-4 w-4" />
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete "{name}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
