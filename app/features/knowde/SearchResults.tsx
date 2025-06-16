import { LoaderCircle } from "lucide-react";
import { useContext } from "react";
import { useNavigation } from "react-router";
import PageNavi, { getStartIndex } from "~/components/Pagenation";
import type { KAdjacency } from "~/generated/fastAPI.schemas";
import SearchContext from "./SearchContext";
import ResultRow from "./components/ResultRow";

type Props = {
  data: {
    total: number;
    data: KAdjacency[];
  };
};

export default function SearchResults({ data }: Props) {
  const ctx = useContext(SearchContext);
  const ps = ctx?.pagenationState || {
    paging: { page: 1, size: 50 },
    setPaging: () => null,
  };
  const start = getStartIndex(ps.paging);
  const navigation = useNavigation();
  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";

  const pn = <PageNavi total={data.total} state={ps} />;

  return (
    <div className="container mx-auto p-4">
      {pn}
      <div>
        {data.total > 0 ? (
          <div>
            <h2 className="text-xl font-semibold">検索結果 ({data.total}件)</h2>

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
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            検索結果はありません
          </div>
        )}
      </div>
      {pn}
    </div>
  );
}
