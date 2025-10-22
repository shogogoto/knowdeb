import { useResourceDetail } from "./Context";
import { toAdjacent } from "./util";

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
          <div key={startId} className="ml-2">
            {down.map((elm) => {
              return (
                <p key={elm.kn.uid}>
                  {elm.kn.sentence}
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

export function ResourceCard() {}
