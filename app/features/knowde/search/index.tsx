import { LoaderCircle } from "lucide-react";
import { Suspense, useContext } from "react";
import { ClientOnly } from "~/components/ClientOnly";
import PagingNavi from "~/components/Pagenation";
import PageContext from "~/components/Pagenation/PageContext";
import { PageProvider } from "~/components/Pagenation/PageProvider";
import type { KnowdeSearchResult } from "~/generated/fastAPI.schemas";
import {
  type searchByTextKnowdeGetResponse,
  useSearchByTextKnowdeGet,
} from "~/generated/knowde/knowde";
import { createCacheKey, useCachedSWR } from "~/hooks/swr/useCache";
import { knowdeSearchCache } from "~/lib/indexed";
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
    page: current,
    size: pageSize,
    search_type: searchOption,
    ...orderBy,
  };

  const cacheKey = createCacheKey("search", params);
  const fallbackData = useCachedSWR<
    KnowdeSearchResult,
    searchByTextKnowdeGetResponse
  >(cacheKey, knowdeSearchCache.get);

  const { data } = useSearchByTextKnowdeGet(params, {
    swr: {
      keepPreviousData: true,
      fallbackData,
      suspense: true,
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

  return (
    <>{data && data.status === 200 && <SearchResults data={data.data} />}</>
  );
}

function KnowdeSearchLayout() {
  const { total } = useContext(PageContext);
  return (
    <div className="flex flex-col h-dvh">
      <header className="flex sticky z-5 top-0 border-b">
        <SearchBar />
      </header>
      <main className="flex-1 h-dvh overflow-y-auto justify-center w-full">
        <Suspense
          fallback={
            <div className="flex justify-center p-4">
              <LoaderCircle className="animate-spin" />
            </div>
          }
        >
          <div className="flex h-screen justify-center w-full">
            <_KnowdeSearch />
          </div>
        </Suspense>
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
