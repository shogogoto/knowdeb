import type { KAdjacency, Knowde } from "~/generated/fastAPI.schemas";
import ScorePannel from "../ScorePannel";
type DefProps = {
  kn: Knowde;
};

function knToLineence(kn: Knowde) {
  return kn.sentence;
}

function DefLine({ kn }: DefProps) {
  return (
    <div>
      {kn.term?.names && (
        <span className="mb-2 font-semibold text-green-700">
          {kn.term.names.join(", ")}:&nbsp;
        </span>
      )}
      <span className="font-medium mb-2">{kn.sentence}</span>
    </div>
  );
}

type Props = {
  row: KAdjacency;
};

export default function ResultRow({ row }: Props) {
  return (
    <div
      key={row.center.uid}
      className="p-4 border border-gray-200 rounded-md dark:border-gray-700"
    >
      {/* <div className="grid grid-cols-2 justify-start"> */}
      <div className="flex flex-col">
        <div className="text-sm text-gray-600 flex">
          <ScorePannel stats={row.stats} />
        </div>
        <DefLine kn={row.center} />
      </div>
      {row.when && (
        <div className="mb-2">
          <span className="font-semibold">時期: </span>
          {row.when}
        </div>
      )}

      {/* 詳細情報 (必要に応じて折りたたみ可能にする) */}
      {row.details && row.details.length > 0 && (
        <div className="mt-3">
          <details>
            <summary className="cursor-pointer text-blue-600 dark:text-blue-400">
              詳細 ({row.details.length}件)
            </summary>
            <ul className="pl-5 mt-2 list-disc">
              {row.details.map((detail) => (
                <li key={detail.uid} className="mt-1">
                  {detail.sentence}
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}
