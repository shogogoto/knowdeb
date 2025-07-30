import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { KnowdeWithStats } from "~/generated/fastAPI.schemas";
import DefLine from "./DefLine";

type Props = {
  row: KnowdeWithStats;
  index: number;
  isOpen?: boolean;
};

export default function ResultRow({ row, index }: Props) {
  return (
    <div
      key={row.knowde.uid}
      className="p-4 border border-gray-200 rounded-md dark:border-gray-700"
    >
      <div className="flex gap-2">
        <div className=" hover:bg-gray-200 hover:dark:bg-gray-800 ">
          <Popover modal={true}>
            <PopoverTrigger className="md:flex gap-2">
              <div>#{index}</div>
              {row.stats?.score}
            </PopoverTrigger>
            <PopoverContent>
              {row.stats && (
                <div className="grid grid-cols-2 p-4 border  bg-gray-200 dark:bg-gray-950">
                  <div className="text-right">詳細数 </div>
                  <div className="text-right">{row.stats.n_detail}</div>
                  <div className="text-right">前提数</div>
                  <div className="text-right">{row.stats.n_premise}</div>
                  <div className="text-right">結論数</div>
                  <div className="text-right">{row.stats.n_conclusion}</div>
                  <div className="text-right">参照数</div>
                  <div className="text-right">{row.stats.n_refer}</div>
                  <div className="text-right">被参照数</div>
                  <div className="text-right">{row.stats.n_referred}</div>
                  <div className="text-right">前提距離</div>
                  <div className="text-right">{row.stats.dist_axiom}</div>
                  <div className="text-right">結論距離</div>
                  <div className="text-right">{row.stats.dist_leaf}</div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <DefLine kn={row} />
        <div className="ml-auto">
          <div className="border">{row.knowde.when}</div>
        </div>
      </div>
      {/* {total > 0 && ( */}
      {/*   <div className="mt-1"> */}
      {/* <details open> */}
      {/* <summary className="cursor-pointer text-blue-600 dark:text-blue-400"> */}
      {/*   {`${summary}件`} */}
      {/*   {row.when && <span className="mb-2"> @{row.when}</span>} */}
      {/* </summary> */}
      {/* <DetailList arr={row.details} caption={"詳細"} /> */}
      {/* <DetailList arr={row.premises} caption={"前提"} /> */}
      {/* <DetailList arr={row.conclusions} caption={"結論"} /> */}
      {/* <DetailList arr={row.refers} caption={"参照"} /> */}
      {/* <DetailList arr={row.referreds} caption={"被参照"} /> */}
      {/* </details> */}
      {/* //   </div> */}
      {/* // )} */}
    </div>
  );
}
