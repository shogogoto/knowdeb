import type { KnowdeWithStats } from "~/generated/fastAPI.schemas";
import DefLine from "./DefLine";
import RowPrefix from "./RowPrefix";
import RowSuffix from "./RowSuffix";

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
        <RowPrefix index={index} stats={row.stats} />
        <DefLine kn={row} />
        <div className="ml-auto">
          <RowSuffix knowde={row.knowde} />
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
