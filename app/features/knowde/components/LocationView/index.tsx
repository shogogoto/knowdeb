import { Link } from "react-router";
import UserAvatar from "~/features/user/UserAvatar";
import type { KnowdeLocation } from "~/shared/generated/fastAPI.schemas";

type Props = {
  loc: KnowdeLocation;
};

export default function LocationView({ loc }: Props) {
  const { user } = loc;
  return (
    <div className="flex flex-col gap-2">
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
          <div className="text-sm text-muted-foreground space-x-2 gap-2">
            <Link
              to={`/resource/${loc.resource.uid}`}
              className="hover:underline"
            >
              <span>{loc.resource.name}</span>
              <span>{loc.resource.authors}</span>
              <span>{loc.resource.published}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
