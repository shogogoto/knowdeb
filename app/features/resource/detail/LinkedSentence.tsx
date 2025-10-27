import { Link, useNavigate } from "react-router";
import { useSelectPreventLink } from "~/shared/hooks/useSelectPrevent";
import { useResourceDetail } from "./Context";
import type { toAdjacent } from "./util";

type Props = {
  adj: ReturnType<typeof toAdjacent>;
};

const PATTERN = /(\{[^}]*\})/g;

export default function LinkedSentence({ adj }: Props) {
  const { handleMouseDown, handleClick } = useSelectPreventLink(5); // 5px を閾値とする
  const navigate = useNavigate();
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
    >
      {adj.kn.sentence}
      {parts.map((part, i) => {
        const found = refs.find((r) => r.kn.sentence === part);

        if (found) {
          return (
            <span key={found.kn.uid} className="text-blue-500">
              {part}
            </span>
          );
        }
        return part;
      })}
      {/* )<span className="text-red-500">{JSON.stringify(parts)}</span> */}
      {/* {refs.map((r) => ( */}
      {/*   <span className="text-blue-500">{r.kn.term?.names}</span> */}
      {/* ))} */}
    </Link>
  );
}

// function extractBraces(str: string): string[] {
//   const matches = Array.from(str.matchAll(PATTERN));
//   return matches.map((match) => match[1]);
// }
