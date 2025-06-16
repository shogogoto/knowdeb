import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import type { KAdjacencyStats } from "~/generated/fastAPI.schemas";

type Props = {
  index: number;
  stats?: KAdjacencyStats;
};

export default function RowPrefix({ index, stats }: Props) {
  return (
    <div className=" hover:bg-gray-200 hover:dark:bg-gray-800 ">
      <Popover modal={true}>
        <PopoverTrigger className="md:flex gap-2">
          <div>#{index}</div>
          {stats?.score}
        </PopoverTrigger>
        <PopoverContent>
          {stats && (
            <div className="grid grid-cols-2 p-4 border  bg-gray-200 dark:bg-gray-950">
              <div className="text-right">詳細数 </div>
              <div className="text-right">{stats.n_detail}</div>
              <div className="text-right">前提数</div>
              <div className="text-right">{stats.n_premise}</div>
              <div className="text-right">結論数</div>
              <div className="text-right">{stats.n_conclusion}</div>
              <div className="text-right">参照数</div>
              <div className="text-right">{stats.n_refer}</div>
              <div className="text-right">被参照数</div>
              <div className="text-right">{stats.n_referred}</div>
              <div className="text-right">前提距離</div>
              <div className="text-right">{stats.dist_axiom}</div>
              <div className="text-right">結論距離</div>
              <div className="text-right">{stats.dist_leaf}</div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
