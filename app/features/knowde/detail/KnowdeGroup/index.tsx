import type { DirectedGraph } from "graphology";
import type { Knowde } from "~/shared/generated/fastAPI.schemas";
import KnowdeCard from "../../components/KnowdeCard";
import { eqEdgeType, pathsToEnd, succ } from "../util/network";

type Props = {
  startId: string;
  kn: (id: string) => Knowde;
  g: DirectedGraph;
  className?: string;
};

export default function KnowdeGroup({ startId, kn, g, className }: Props) {
  const sibls = pathsToEnd(g, startId, eqEdgeType("sibling"), succ);

  return (
    <div className={className}>
      {sibls.length === 0 ? (
        <KnowdeCard k={kn(startId)} key={startId} />
      ) : (
        sibls.map((path) => {
          return path.map((id) => {
            const belows = succ(g, id, eqEdgeType("below"));
            if (belows.length === 0) {
              return <KnowdeCard k={kn(id)} key={id} />;
            }

            return belows.map((bid) => {
              return (
                <div className="border border-blue-500" key={bid}>
                  <KnowdeCard k={kn(id)} key={id} />
                  <KnowdeGroup
                    startId={bid}
                    kn={kn}
                    g={g}
                    key={bid}
                    className="ml-1 border border-blue-500"
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

// Tree と stream
