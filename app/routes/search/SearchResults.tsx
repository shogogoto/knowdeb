import { LoaderCircle } from "lucide-react";
import { useContext } from "react";
import { useNavigation } from "react-router";
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
  const ctx = useContext(SearchContext);
  const start = (ctx?.paging?.size ?? 0) * ((ctx?.paging?.page ?? 1) - 1) + 1;
  const navigation = useNavigation();
  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <div className="container mx-auto p-4">
      <div className="results">
        {data.total > 0 ? (
          <div>
            <h2 className="text-xl font-semibold">検索結果 ({data.total}件)</h2>
            <div className="">
              <SearchPagination totalItems={data.total} />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoaderCircle className="animate-spin" />
              </div>
            ) : (
              <div className="">
                {data.data.map((row, index) => (
                  <ResultRow
                    row={row}
                    index={index + start}
                    key={row.center.uid}
                  />
                ))}
              </div>
            )}

            {/* Bottom pagination for easier navigation on long results */}
            <div className="mt-6">
              <SearchPagination totalItems={data.total} />
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
