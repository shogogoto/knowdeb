import type { KAdjacencyStats } from "~/generated/fastAPI.schemas";

type Props = {
  stats: KAdjacencyStats | undefined;
};

//<div>スコア: {props.stats.score}</div>
//<div>詳細: {props.stats.n_detail}</div>
//<div>前提: {props.stats.n_premise}</div>
//<div>結論: {props.stats.n_conclusion}</div>
//<div>参照: {props.stats.n_refer}</div>
//<div>被参照: {props.stats.n_referred}</div>
export default function ScorePannel(props: Props) {
  return (
    <div>
      {props.stats && (
        <div className="grid grid-cols-2 border gap-1 w-16">
          <div className="text-right">{props.stats.score}</div>
          <div className="text-right">{props.stats.n_detail}</div>
          <div className="text-right">{props.stats.n_premise}</div>
          <div className="text-right">{props.stats.n_conclusion}</div>
          <div className="text-right">{props.stats.n_refer}</div>
          <div className="text-right">{props.stats.n_referred}</div>
        </div>
      )}
    </div>
  );
}
