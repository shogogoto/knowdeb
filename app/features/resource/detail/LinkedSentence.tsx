import { Link } from "react-router";
import { HashLink } from "react-router-hash-link";
import type {
  MResource,
  UserReadPublic,
} from "~/shared/generated/fastAPI.schemas";
import { useSelectPreventLink } from "~/shared/hooks/useSelectPrevent";
import { useResourceDetail } from "./Context";
import type { toAdjacent } from "./util";

type Props = {
  adj: ReturnType<typeof toAdjacent>;
  resource?: MResource;
  user?: UserReadPublic;
};

const PATTERN = /(\{[^}]*\})/g;

export default function LinkedSentence({ adj }: Props) {
  const { resource_info } = useResourceDetail();
  const { handleMouseDown, handleClick } = useSelectPreventLink(5); // 5px を閾値とする
  const { rootId } = useResourceDetail();
  const refs = adj.refers();

  const parts = adj.kn.sentence.split(PATTERN).filter(Boolean);
  return (
    <Link
      to={`/knowde/${adj.kn.uid}`}
      draggable="false"
      className="!text-inherit"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      id={adj.kn.uid}
      state={{
        knowde: adj.kn,
        resource: resource_info.resource,
        user: resource_info.user,
      }}
    >
      {parts.map((part) => {
        const found = refs.find((r) =>
          r.kn.term?.names?.some((n) => part.includes(n)),
        );

        if (found) {
          return (
            <HashLink to={`/resource/${rootId}#${found.kn.uid}`}>
              {part}
            </HashLink>
          );
        }
        return <span key={part}>{part}</span>; // part;
      })}
    </Link>
  );
}

// function extractBraces(str: string): string[] {
//   const matches = Array.from(str.matchAll(PATTERN));
//   return matches.map((match) => match[1]);
// }
