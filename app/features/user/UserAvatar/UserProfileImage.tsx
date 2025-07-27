import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import type { UserRead, UserReadPublic } from "~/generated/fastAPI.schemas";
import UserAvatar from ".";

type Props = {
  user: UserRead | UserReadPublic | null;
};

export default function UserProfileImage({ user }: Props) {
  if (!user?.avatar_url) return <UserAvatar user={user} className="size-24" />;

  return (
    <Dialog>
      <DialogTrigger asChild disabled={!user?.avatar_url}>
        <UserAvatar user={user} className="size-24 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="p-0 border-0 max-w-md w-full">
        <img
          src={user?.avatar_url ?? undefined}
          alt={user?.display_name ?? undefined}
          className="w-full h-auto rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}
