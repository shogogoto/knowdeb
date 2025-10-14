import type { DirectedGraph } from "graphology";
import { eqEdgeType, pathsToEnd, succ } from "~/shared/lib/network";

type Props = {
  startId: string;
  toLine: (id: string) => string;
  g: DirectedGraph;
  className?: string;
  borderColor?: string;
};

// below - siblingによる文章の骨組み
export default function ResourceWireframe({
  startId,
  toLine,
  g,
  className,
  borderColor,
}: Props) {
  const sibls = pathsToEnd(g, startId, eqEdgeType("sibling"), succ);

  return (
    <div className={className}>
      {sibls.length === 0 ? (
        <div>{toLine(startId)}</div>
      ) : (
        sibls.map((path) => {
          return path.map((id) => {
            const belows = succ(g, id, eqEdgeType("below"));
            if (belows.length === 0) {
              return <div>{toLine(id)}</div>;
            }

            return belows.map((bid) => {
              return (
                <div key={bid}>
                  {toLine(id)}
                  <ResourceWireframe
                    startId={bid}
                    toLine={toLine}
                    g={g}
                    key={bid}
                    className="ml-1"
                    borderColor={borderColor}
                  />
                </div>
              );
            });
          });
        })
      )}
    </div>
  );
}
