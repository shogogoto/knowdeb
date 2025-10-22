import type { JSX } from "react";
import { useResourceDetail } from "./Context";
import { getHeadingLevel, toAdjacent } from "./util";

type Props = {
  startId: string;
  toLine: (id: string) => string;
  className?: string;
  borderColor?: string;
};

// below - siblingによる文章の骨組み
// belowとsiblingの先にある sentenceをさらに肉付け
export default function ResourceWireframe({
  startId,
  toLine,
  className,
  borderColor,
}: Props) {
  const { graph, terms, uids } = useResourceDetail();
  const adj = toAdjacent(startId, graph, uids, terms);
  return (
    <div>
      {adj.downArrays().map((down) => {
        return (
          <div key={startId} className="ml-1">
            {down.map((elm) => {
              return (
                <p key={elm.kn.uid}>
                  <Presenter id={elm.kn.uid} />
                  <ResourceWireframe
                    key={elm.kn.uid}
                    startId={elm.kn.uid}
                    toLine={toLine}
                  />
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

type PProps = {
  id: string;
};
// 単文や見出しをいい感じに表示し分ける
export function Presenter({ id }: PProps) {
  const { graph, terms, uids } = useResourceDetail();
  const adj = toAdjacent(id, graph, uids, terms);
  const level = getHeadingLevel(adj.kn.sentence);
  if (level > 0) {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    const headingText = adj.kn.sentence.replace(/^#+\s*/, "");
    return <Tag>{headingText}</Tag>;
  }
  return <div>{adj.kn.sentence}</div>;
}
