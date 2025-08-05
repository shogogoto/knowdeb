import { Link } from "react-router";
import UserAvatar from "~/features/user/UserAvatar";
import type { Knowde, KnowdeLocation } from "~/generated/fastAPI.schemas";
import KnowdeCard from "../KnowdeCard";
import ResourcePath from "../ResourcePath";

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
          <ResourcePath resource={loc.resource} />
        </div>
      </div>

      <ParentKnowdes parents={loc.parents} />
    </div>
  );
}

function ParentKnowdes({ parents }: { parents: Knowde[] }) {
  if (parents.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {parents.map((p) => (
        <div
          key={p.uid}
          //className="ml-4 border-l-2 pl-4"
        >
          <KnowdeCard k={p} />
        </div>
      ))}
    </div>
  );
}
