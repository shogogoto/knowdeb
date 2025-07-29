import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import type { UserRead, UserReadPublic } from "~/generated/fastAPI.schemas";
import UserAvatar from "../../UserAvatar";

type Props = {
  user: UserRead | UserReadPublic | null;
};

export default function ProfileImage({ user }: Props) {
  if (!user?.avatar_url) return <UserAvatar user={user} className="size-24" />;

  return (
    <Dialog>
      <DialogTrigger asChild disabled={!user?.avatar_url}>
        <UserAvatar user={user} className="size-24 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="p-0 border-0 w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
        <img
          src={user?.avatar_url}
          alt={user?.display_name || user?.username || user?.uid}
          className="w-full h-auto rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}
