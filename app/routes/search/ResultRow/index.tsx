import type { KAdjacency } from "~/generated/fastAPI.schemas";
import ScorePannel from "../ScorePannel";
import DefLine from "./DefLine";
import DetailList from "./RowDetail";

type Props = {
  row: KAdjacency;
  isOpen?: boolean;
};

export default function ResultRow({ row }: Props) {
  const [summary, total] = adjToSummary(row);
  return (
    <div
      key={row.center.uid}
      className="p-4 border border-gray-200 rounded-md dark:border-gray-700"
    >
      {/* <div className="grid grid-cols-2 justify-start"> */}
      <div className="flex flex-col">
        <ScorePannel stats={row.stats} />
        <DefLine kn={row.center} />
      </div>
      {total > 0 && (
        <div className="mt-3">
          <details open>
            <summary className="cursor-pointer text-blue-600 dark:text-blue-400">
              {`${summary}件`}
              {row.when && <span className="mb-2"> @{row.when}</span>}
            </summary>
            <DetailList arr={row.details} caption={"詳細"} />
            <DetailList arr={row.premises} caption={"前提"} />
            <DetailList arr={row.conclusions} caption={"結論"} />
            <DetailList arr={row.refers} caption={"参照"} />
            <DetailList arr={row.referreds} caption={"被参照"} />
          </details>
        </div>
      )}
    </div>
  );
}

function adjToSummary(row: KAdjacency): [string, number] {
  const arr = [
    row.details ? row.details.length : 0,
    row.premises ? row.premises.length : 0,
    row.conclusions ? row.conclusions.length : 0,
    row.refers ? row.refers.length : 0,
    row.referreds ? row.referreds.length : 0,
  ];
  const total = arr.reduce((a, b) => a + b, 0);
  return [`${arr.join(" + ")} = ${total}`, total];
}
