import { Link } from "react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/shared/components/ui/avatar";
import type { UserReadPublic } from "~/shared/generated/fastAPI.schemas";

type Props = {
  user: UserReadPublic;
};

export default function UserHeader({ user }: Props) {
  return (
    <Link
      to={`/user/${user.username}`}
      className="flex items-center gap-2 text-sm text-muted-foreground !text-inherit"
    >
      <Avatar>
        <AvatarImage
          src={user?.avatar_url || undefined}
          alt={user?.display_name || undefined}
        />
        <AvatarFallback>{user.display_name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <span>{user.display_name || user.username}</span>
      <span>@{user.username}</span>
    </Link>
  );
}
