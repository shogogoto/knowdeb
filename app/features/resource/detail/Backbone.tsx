import { useResourceDetail } from "./Context";
import Presenter from "./Presenter";
import { toAdjacent } from "./util";

type Props = {
  startId: string;
  toLine: (id: string) => string;
  className?: string;
  borderColor?: string;
};

// below - siblingによる文章の骨組み
// belowとsiblingの先にある sentenceをさらに肉付け
export default function Backbone({ startId, toLine }: Props) {
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
                  <Presenter id={elm.kn.uid} />
                  <Backbone
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
