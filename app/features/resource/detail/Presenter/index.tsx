import type React from "react";
import { type JSX, useEffect, useState } from "react";
import { Link } from "react-router";
import { AdditionalItem } from "~/features/knowde/components/KnowdeCard";
import { useSelectPreventLink } from "~/shared/hooks/useSelectPrevent";
import { useResourceDetail } from "../Context";
import Relations from "../Relations";
import { useTraceMemory } from "../TraceMemory/hooks";
import { getHeadingLevel, toAdjacent } from "../util";

type Props = {
  id: string;
  prefix?: React.ReactNode;
};

const HEADING_PREFIX = /^#+\s*/;

// 単文や見出しをいい感じに表示し分ける
export default function Presenter({ id, prefix }: Props) {
  const { graph, terms, uids, rootId } = useResourceDetail();
  const adj = toAdjacent(id, graph, uids, terms);
  const level = getHeadingLevel(adj.kn.sentence);
  const { register, isRegistered, getNumber } = useTraceMemory();
  const { handleMouseDown, handleClick } = useSelectPreventLink(5); // 5px を閾値とする
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (level === 0) {
      if (!isRegistered(id)) {
        register(id);
        setIsVisible(true);
      }
    }
  }, [id, register, level, isRegistered]);

  if (level > 0) {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    const headingText = adj.kn.sentence.replace(HEADING_PREFIX, "");
    return <Tag>{headingText}</Tag>;
  }

  if (!isVisible) {
    return null;
  }

  // TODO: resolved関係を辿って、埋め込まれた用語の定義にジャンプするリンクを作る
  return (
    <div>
      <span>{prefix}</span>
      <Link to={`/resource/${rootId}#${adj.kn.uid}`}>
        {`${getNumber(id)}. `}
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
        id={adj.kn.uid}
      >
        {adj.kn.sentence}
      </Link>
      {adj.kn.additional && (
        <span className="inline-flex ml-2 text-sm text-muted-foreground">
          <AdditionalItem additional={adj.kn.additional} />
        </span>
      )}
      <Relations startId={adj.kn.uid} />
    </div>
  );
}
