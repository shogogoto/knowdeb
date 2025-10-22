import type { JSX } from "react";
import { useResourceDetail } from "../Context";
import { getHeadingLevel, toAdjacent } from "../util";

type Props = {
  id: string;
};

const HEADING_PREFIX = /^#+\s*/;

// 単文や見出しをいい感じに表示し分ける
export default function Presenter({ id }: Props) {
  const { graph, terms, uids } = useResourceDetail();
  const adj = toAdjacent(id, graph, uids, terms);
  const level = getHeadingLevel(adj.kn.sentence);
  if (level > 0) {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    const headingText = adj.kn.sentence.replace(HEADING_PREFIX, "");
    return <Tag>{headingText}</Tag>;
  }
  return (
    <div>
      {adj.kn.term?.names?.map((name) => (
        <span
          key={name}
          className="rounded-full font-bold text-green-800  dark:text-green-500"
        >
          {name}
        </span>
      ))}
      {adj.kn.term?.names?.length && ":  "}
      {adj.kn.sentence}
    </div>
  );
}
