import { useContext } from "react";
import type { KAdjacency } from "~/generated/fastAPI.schemas";
import SearchPagination from "./Pagenation";
import ResultRow from "./ResultRow";
import SearchContext from "./SearchContext";

type Props = {
  data: {
    total: number;
    data: KAdjacency[];
  };
};

export default function SearchResults({ data }: Props) {
  const searchContext = useContext(SearchContext);

  if (!searchContext) {
    throw new Error("SearchResults must be used within a SearchProvider");
  }

  return (
    <div className="container mx-auto p-4">
      <div className="results">
        {data.total > 0 ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h2 className="text-xl font-semibold">
                検索結果 ({data.total}件)
              </h2>
              <div className="mt-2 sm:mt-0">
                <SearchPagination totalItems={data.total} />
              </div>
            </div>
            <div className="space-y-4">
              {data.data.map((row) => (
                <ResultRow row={row} key={row.center.uid} />
              ))}
            </div>

            {/* Bottom pagination for easier navigation on long results */}
            {data.total > 10 && (
              <div className="mt-6">
                <SearchPagination totalItems={data.total} />
              </div>
            )}
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
