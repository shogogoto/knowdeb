import { LoaderCircle } from "lucide-react";
import { useContext } from "react";
import { ClientOnly } from "~/shared/components/ClientOnly";
import PagingNavi from "~/shared/components/Pagenation";
import PageContext from "~/shared/components/Pagenation/PageContext";
import { PageProvider } from "~/shared/components/Pagenation/PageProvider";
import type { KnowdeSearchResult } from "~/shared/generated/fastAPI.schemas";
import {
  type searchByTextKnowdeGetResponse200,
  useSearchByTextKnowdeGet,
} from "~/shared/generated/knowde/knowde";
import { createCacheKey, useCachedSWR } from "~/shared/hooks/swr/useCache";
import { useDebounce } from "~/shared/hooks/useDebounce";
import { knowdeSearchCache } from "~/shared/lib/indexed";
import SearchBar from "./SearchBar";
import SearchContext, {
  initialSearchState,
  SearchProvider,
} from "./SearchContext";
import SearchResults from "./SearchResults";

export function _KnowdeSearch() {
  const { q, searchOption, orderBy } = useContext(SearchContext);
  const { pageSize, current, setCurrent, setTotal } = useContext(PageContext);

  const params = {
    q,
    page: current || 1, // 0だと backendで validation error
    size: pageSize,
    search_type: searchOption,
    ...orderBy,
  };
  const debouncedParams = useDebounce(params, 500);
  const cacheKey = createCacheKey("search", debouncedParams);
  const fallbackData = useDebounce(
    useCachedSWR<
      KnowdeSearchResult,
      searchByTextKnowdeGetResponse200 & { headers: Headers }
    >(cacheKey, knowdeSearchCache.get),
    300,
  );
  const { data, isLoading } = useSearchByTextKnowdeGet(debouncedParams, {
    swr: {
      revalidateOnFocus: false,
      keepPreviousData: true,
      fallbackData,
      onSuccess: async (data) => {
        if (data.status === 200) {
          const total = data.data.total || 0;
          setTotal(total);
          // 再検索で有効範囲外にならないようにする
          if (total === 0) setCurrent(undefined);
          if (current && current > total) setCurrent(total);
          if (!current && total > 0) setCurrent(1);
          await knowdeSearchCache.set(cacheKey, data.data);
        }
      },
    },
  });

  const displayData = data?.status === 200 ? data.data : fallbackData?.data;
  if (isLoading && !displayData) {
    return (
      <div className="flex justify-center p-4">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return <>{displayData && <SearchResults data={displayData} />}</>;
}

function KnowdeSearchLayout() {
  const { total } = useContext(PageContext);
  return (
    <div className="flex flex-col h-dvh">
      <header className="flex sticky z-5 top-0 border-b">
        <SearchBar />
      </header>
      <main className="flex-1 h-dvh overflow-y-auto justify-center w-full">
        <div className="flex h-screen justify-center w-full">
          <_KnowdeSearch />
        </div>
      </main>
      <footer className="flex sticky bottom-0 bg-background border-t">
        <PagingNavi total={total} />
      </footer>
    </div>
  );
}

export default function KnowdeSearch() {
  return (
    <ClientOnly>
      {() => (
        <SearchProvider {...initialSearchState}>
          <PageProvider pageSize={50}>
            <KnowdeSearchLayout />
          </PageProvider>
        </SearchProvider>
      )}
    </ClientOnly>
  );
}
