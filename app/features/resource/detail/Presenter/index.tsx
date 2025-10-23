import { type JSX, useEffect } from "react";
import { Link } from "react-router";
import { AdditionalItem } from "~/features/knowde/components/KnowdeCard";
import { useSelectPreventLink } from "~/shared/hooks/useSelectPrevent";
import { useResourceDetail } from "../Context";
import { useTraceMemory } from "../TraceMemory/hooks";
import { getHeadingLevel, toAdjacent } from "../util";

type Props = {
  id: string;
};

const HEADING_PREFIX = /^#+\s*/;

// 単文や見出しをいい感じに表示し分ける
export default function Presenter({ id }: Props) {
  const { graph, terms, uids, rootId } = useResourceDetail();
  const adj = toAdjacent(id, graph, uids, terms);
  const level = getHeadingLevel(adj.kn.sentence);
  const { register, isRegistered, getNumber, count } = useTraceMemory();
  const myNumber = getNumber(id); // TODO: Mapが無駄に見える。Set要素に変えたい
  const { handleMouseDown, handleClick } = useSelectPreventLink(5); // 5px を閾値とする
  useEffect(() => {
    if (level === 0) {
      register(id);
    }
  }, [id, register, level]);

  if (level > 0) {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    const headingText = adj.kn.sentence.replace(HEADING_PREFIX, "");
    return <Tag>{headingText}</Tag>;
  }

  // TODO: resolved関係を辿って、埋め込まれた用語の定義にジャンプするリンクを作る
  return (
    <div id={adj.kn.uid}>
      <Link to={`/resource/${rootId}#${adj.kn.uid}`}>
        {myNumber && `${myNumber}. `}
      </Link>
      <div className="inline-flex items-start gap-2">
        {adj.kn.term?.names?.map((name) => (
          <span
            key={name}
            className="rounded-full font-bold text-green-800  dark:text-green-500"
          >
            {name}
          </span>
        ))}
      </div>
      {adj.kn.term?.names?.length && ":  "}
      <Link
        to={`/knowde/${adj.kn.uid}`}
        draggable="false"
        className="!text-inherit"
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        {adj.kn.sentence}
      </Link>
      {adj.kn.additional && (
        <span className="inline-flex ml-2 text-sm text-muted-foreground">
          <AdditionalItem additional={adj.kn.additional} />
        </span>
      )}
    </div>
  );
}
