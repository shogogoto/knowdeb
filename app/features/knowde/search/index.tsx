import { useContext, useRef } from "react";
import { ClientOnly } from "~/shared/components/ClientOnly";
import Loading from "~/shared/components/Loading";
import PageContext from "~/shared/components/Pagenation/PageContext";
import { PageProvider } from "~/shared/components/Pagenation/PageProvider";
import SearchLayout from "~/shared/components/SearchLayout";
import type { KnowdeSearchResult } from "~/shared/generated/fastAPI.schemas";
import {
  type searchByTextKnowdeGetResponse200,
  useSearchByTextKnowdeGet,
} from "~/shared/generated/knowde/knowde";
import { useHistory } from "~/shared/history/hooks";
import { createCacheKey, useCachedSWR } from "~/shared/hooks/swr/useCache";
import { useDebounce } from "~/shared/hooks/useDebounce";
import { knowdeSearchCache } from "~/shared/lib/indexed";
import KnowdeSearchBar from "./SearchBar";
import SearchContext, { SearchProvider } from "./SearchContext";
import KnowdeSearchResults from "./SearchResults";

function KnowdeSearchLayout() {
  const { q, searchOption, orderBy } = useContext(SearchContext);
  const { current, pageSize, total, handleSuccess } = useContext(PageContext);

  const params = {
    q,
    page: current || 1, // 0 だとbackendで validation error
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

  const { addHistory } = useHistory();
  const addedRef = useRef<string | null>(null);

  const { data, isLoading } = useSearchByTextKnowdeGet(debouncedParams, {
    swr: {
      revalidateOnFocus: false,
      keepPreviousData: true,
      fallbackData,
      onSuccess: async (data) => {
        if (data.status === 200) {
          handleSuccess(data.data.total || 0, pageSize);
          await knowdeSearchCache.set(cacheKey, data.data);
          // 履歴登録
          if (addedRef.current === q) return;
          addHistory({ title: q || "empty" });
          addedRef.current = q;
        }
      },
    },
  });

  const displayData = data?.status === 200 ? data.data : fallbackData?.data;

  const bar = <KnowdeSearchBar isLoading={isLoading && !!displayData} />;
  const result = (
    <div className="flex h-screen justify-center w-full">
      {isLoading && !displayData ? (
        <Loading isLoading={true} type="center-x" />
      ) : (
        displayData && <KnowdeSearchResults data={displayData} />
      )}
    </div>
  );
  return <SearchLayout header={bar} main={result} />;
}

export default function KnowdeSearch() {
  return (
    <ClientOnly>
      {() => (
        <SearchProvider>
          <PageProvider pageSize={50}>
            <KnowdeSearchLayout />
          </PageProvider>
        </SearchProvider>
      )}
    </ClientOnly>
  );
}
