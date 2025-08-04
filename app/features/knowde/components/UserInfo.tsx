import type React from "react";
import { Link } from "react-router";
import UserAvatar from "~/features/user/UserAvatar";
import type { UserReadPublic } from "~/generated/fastAPI.schemas";

type Props = {
  user: UserReadPublic;
} & React.PropsWithChildren;

export default function UserInfo({ user, children }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Link
        to={`/user/${user.username}`}
        className="text-sm text-muted-foreground"
      >
        <UserAvatar user={user} />
      </Link>
      <div className="flex flex-col">
        <div>
          <span className="font-bold">{user.display_name} </span>@
          {user.username || user.uid}
        </div>
        {children}
      </div>
    </div>
  );
}
