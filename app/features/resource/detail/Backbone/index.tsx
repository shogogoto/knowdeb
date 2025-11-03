import React from "react";
import { useResourceDetail } from "../Context";
import Presenter from "../Presenter";
import { toAdjacent } from "../util";

type Props = {
  startId: string;
  path?: string[];
};

// below - siblingによる文章の骨組み
// belowとsiblingの先にある sentenceをさらに肉付け
function Backbone({ startId, path = [] }: Props) {
  const { graph, terms, uids } = useResourceDetail();

  const adj = toAdjacent(startId, graph, uids, terms);

  if (path.includes(startId)) {
    return null; // 循環参照を検出したため、ここで停止
  }
  return (
    <div>
      {adj.downArrays().map((down) => {
        return (
          <div key={down[0]?.kn.uid || startId} className="ml-2">
            {down.map((elm) => {
              return (
                <div key={elm.kn.uid}>
                  {elm.kn.uid && <Presenter id={elm.kn.uid} />}
                  <Backbone
                    key={elm.kn.uid}
                    startId={elm.kn.uid}
                    path={[...path, startId]}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(Backbone);
