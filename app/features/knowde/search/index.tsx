import { LoaderCircle } from "lucide-react";
import { useContext } from "react";
import PagingNavi from "~/components/Pagenation";
import PageContext from "~/components/Pagenation/PageContext";
import { PageProvider } from "~/components/Pagenation/PageProvider";
import { useSearchByTextKnowdeGet } from "~/generated/knowde/knowde";
import { setCache } from "~/lib/indexed";
import SearchBar from "./SearchBar";
import SearchContext, {
  initialSearchState,
  SearchProvider,
} from "./SearchContext";
import SearchResults from "./SearchResults";
import { paramsToKey, useCachedSearch } from "./hooks";

export function _KnowdeSearch() {
  const { q, searchOption, orderBy } = useContext(SearchContext);
  const { pageSize, current, setCurrent } = useContext(PageContext);

  const params = {
    q,
    page: current,
    size: pageSize,
    search_type: searchOption,
    ...orderBy,
  };

  const fallbackData = useCachedSearch(params);

  const { data, isLoading } = useSearchByTextKnowdeGet(params, {
    swr: {
      keepPreviousData: true,
      fallbackData,
      onSuccess: async (data) => {
        if (data?.status === 200) {
          // 再検索で有効範囲外にならないようにする
          const total = data.data.total || 0;
          if (total === 0) setCurrent(undefined);
          if (current && current > total) setCurrent(total);
          if (!current && total > 0) setCurrent(1);
          await setCache(paramsToKey(params), data.data);
        }
      },
    },
  });

  const total = data?.status === 200 ? data.data.total : 0;

  return (
    <>
      {fallbackData !== undefined && (
        <p className="text-muted-foreground">{paramsToKey(params)}</p>
      )}
      <SearchBar />
      <PagingNavi total={total} />
      {isLoading && fallbackData === undefined ? (
        <LoaderCircle className="animate-spin justify-center" />
      ) : (
        data?.status === 200 && <SearchResults data={data.data} />
      )}
    </>
  );
}

export default function KnowdeSearch() {
  return (
    <SearchProvider {...initialSearchState}>
      <PageProvider pageSize={50}>
        <_KnowdeSearch />
      </PageProvider>
    </SearchProvider>
  );
}
