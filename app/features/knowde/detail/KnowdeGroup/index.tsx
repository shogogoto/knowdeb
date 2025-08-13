import type { DirectedGraph } from "graphology";
import { Card } from "~/components/ui/card";
import type { Knowde } from "~/generated/fastAPI.schemas";
import KnowdeCard, {
  KnowdeCardContent,
  KnowdeCardFooter,
} from "../../components/KnowdeCard";
import { eqEdgeType, pathsToEnd, succ } from "../util/network";

type Props = {
  startId: string;
  kn: (id: string) => Knowde;
  g: DirectedGraph;
  getGroup?: (id: string) => string[];
};

// 再帰コンポーネント
//
// detail は 一度 below で その後は sibling で末まで辿る
export default function KnowdeGroup({ startId, kn, g, getGroup }: Props) {
  const belows = succ(g, startId, eqEdgeType("below"));
  if (belows && belows.length === 0) undefined;

  return (
    <div className="ml-2">
      {belows.map((bid) => {
        const paths = pathsToEnd(g, bid, eqEdgeType("sibling"), succ);

        // 1つ目の要素(below直下)

        if (paths.length === 0) {
          return (
            <div key={bid}>
              <Card className="w-full">
                <KnowdeCardContent k={kn(bid)} />
                <KnowdeCardFooter k={kn(bid)} />
              </Card>
            </div>
          );
        }

        return (
          <div key={bid}>
            {paths.map((p) => (
              <div key={bid} className="border border-blue-500 max-w-3xl">
                {p.map((sid) => {
                  const k = kn(sid);
                  return (
                    <>
                      <KnowdeCard k={k} key={sid} />
                      <KnowdeGroup
                        startId={sid}
                        kn={kn}
                        g={g}
                        getGroup={getGroup}
                        key={`${bid}-${sid}`}
                      />
                    </>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// Tree と stream
