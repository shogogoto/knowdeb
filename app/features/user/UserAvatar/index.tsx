import type { ComponentProps } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { UserRead, UserReadPublic } from "~/generated/fastAPI.schemas";

type Props = {
  user: UserRead | UserReadPublic | null;
} & ComponentProps<typeof Avatar>;

export default function UserAvatar({ user, ...props }: Props) {
  return (
    <Avatar {...props}>
      <AvatarImage
        src={user?.avatar_url || undefined}
        alt={user?.display_name || undefined}
      />
      <AvatarFallback>{user?.display_name?.charAt(0) || "N"}</AvatarFallback>
    </Avatar>
  );
}
