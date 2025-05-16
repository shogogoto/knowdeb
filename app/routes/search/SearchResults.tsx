import type { KAdjacency } from "~/generated/fastAPI.schemas";
import ResultRow from "./ResultRow";

type Props = {
  data: {
    total: number;
    data: KAdjacency[];
  };
};

export default function SearchResults({ data }: Props) {
  return (
    <div className="container mx-auto p-4">
      <div className="results">
        {data.total > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              検索結果 ({data.total}件)
            </h2>
            <div className="space-y-4">
              {data.data.map((row, i) => (
                <>
                  {i}
                  <ResultRow row={row} key={row.center.uid} />
                </>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            検索結果はありません
          </div>
        )}
      </div>
    </div>
  );
}
