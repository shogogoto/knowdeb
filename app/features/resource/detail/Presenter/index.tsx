import { Calendar, MapPin, User } from "lucide-react";
import type React from "react";
import { type JSX, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import type { Additional } from "~/shared/generated/fastAPI.schemas";
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
      {adj.kn.additional && Object.keys(adj.kn.additional).length && (
        <span className="inline-flex ml-2 text-sm text-muted-foreground">
          <AdditionalComponent additional={adj.kn.additional} />
        </span>
      )}
      <Relations startId={adj.kn.uid} />
    </div>
  );
}

function forDisplay(value: string | object) {
  if (typeof value === "string") {
    return value;
  }
  const { terms, uids } = useResourceDetail();
  if (value && "uid" in value && typeof value.uid === "string") {
    const term = terms[value.uid];
    const sentence = uids[value.uid];
    const s =
      // @ts-ignore
      sentence && "n" in sentence
        ? sentence?.n === "<<<not defined>>>"
          ? ""
          : sentence?.n
        : sentence;
    return `${term?.names?.join(", ")}: ${s}`;
  }

  throw new Error("invalid value");
}

function AdditionalComponent({ additional }: { additional: Additional }) {
  if (!additional) {
    return null;
  }

  const { when, where, by } = additional || {};
  return (
    <>
      {when && (
        <span className="flex items-center">
          <Calendar className="size-4" />
          {forDisplay(when)}
        </span>
      )}
      {where && (
        <span className="flex items-center">
          <MapPin className="size-4" />
          {forDisplay(where)}
        </span>
      )}
      {by && (
        <span className="flex items-center">
          <User className="size-4" />
          {forDisplay(by)}
        </span>
      )}
    </>
  );
}
