import type React from "react";
import { type JSX, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AdditionalItem } from "~/features/knowde/components/KnowdeCard";
import { cn } from "~/shared/lib/utils";
import { useResourceDetail } from "../Context";
import LinkedSentence from "../LinkedSentence";
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
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const isActive = location.hash === `#${adj.kn.uid}`;

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
    <div
      className={cn(
        "rounded-md p-1",
        isActive &&
          "bg-yellow-100 text-neutral-800 dark:bg-yellow-800/30 dark:text-white",
      )}
    >
      {/* {adj.referreds().map((ref) => ref.kn.term?.names?.[0])} */}
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
      <LinkedSentence adj={adj} />
      {adj.kn.additional && (
        <span className="inline-flex ml-2 text-sm text-muted-foreground">
          <AdditionalItem additional={adj.kn.additional} />
        </span>
      )}
      <Relations startId={adj.kn.uid} />
    </div>
  );
}
