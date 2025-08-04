import type { Knowde, KnowdeLocation } from "~/generated/fastAPI.schemas";
import KnowdeCard from "../KnowdeCard";
import ResourcePath from "../ResourcePath";
import UserInfo from "../UserInfo";

type Props = {
  loc: KnowdeLocation;
};

export default function LocationView({ loc }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <UserInfo user={loc.user}>
        <ResourcePath resource={loc.resource} />
      </UserInfo>

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
