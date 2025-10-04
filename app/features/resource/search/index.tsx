import { useContext, useEffect, useMemo, useRef } from "react";
import PageContext from "~/shared/components/Pagenation/PageContext";
import { PageProvider } from "~/shared/components/Pagenation/PageProvider";
import SearchBar from "~/shared/components/SearchBar";
import SearchLayout from "~/shared/components/SearchLayout";
import {
  type searchResourcePostResourceSearchPostResponse200,
  useSearchResourcePostResourceSearchPost,
} from "~/shared/generated/entry/entry";
import type {
  ResourceSearchBody,
  ResourceSearchResult,
} from "~/shared/generated/fastAPI.schemas";
import { useHistory } from "~/shared/history/hooks";
import { createCacheKey, useCachedSWR } from "~/shared/hooks/swr/useCache";
import { useDebounce } from "~/shared/hooks/useDebounce";
import { resourceSearchCache } from "~/shared/lib/indexed";
import SearchQueryContext, {
  SearchQueryProvider,
} from "~/shared/search/SearchContext";
import ResourceSearchResultView from "./ResourceSearchResult";

function _ResourceSearch() {
  const { q } = useContext(SearchQueryContext);
  const { current, pageSize, total, handleSuccess } = useContext(PageContext);

  const params: ResourceSearchBody = useMemo(() => {
    return {
      q,
      q_user: "",
      paging: {
        page: current || 1,
        size: pageSize,
      },
      desc: true,
      order_by: ["title", "username", "n_char"],
    };
  }, [q, current, pageSize]);
  const debouncedParams = useDebounce(params, 500);
  const cacheKey = createCacheKey("resource-search", debouncedParams);
  const fallbackData = useCachedSWR<
    ResourceSearchResult,
    searchResourcePostResourceSearchPostResponse200 & { headers: Headers }
  >(cacheKey, resourceSearchCache.get);

  const { addHistory } = useHistory();
  const addedRef = useRef<string | null>(null);

  const { trigger, data, isMutating } = useSearchResourcePostResourceSearchPost(
    {},
    {
      swr: {
        onSuccess: (data) => {
          if (data.status === 200) {
            handleSuccess(data.data.total || 0, pageSize);
            resourceSearchCache.set(cacheKey, data.data);

            if (addedRef.current === q) return;
            addHistory({ title: q || "empty" });
            addedRef.current = q;
          }
        },
      },
    },
  );

  useEffect(() => {
    trigger(debouncedParams);
  }, [trigger, debouncedParams]);

  const displayData =
    data?.status === 200
      ? data.data
      : fallbackData?.status === 200
        ? fallbackData.data
        : { total: 0, data: [] };

  const bar = <ResourceSearchBar isLoading={isMutating} />;
  const main = <ResourceSearchResultView result={displayData} />;
  return <SearchLayout header={bar} main={main} />;
}

type SBProps = {
  isLoading: boolean;
};

function ResourceSearchBar({ isLoading }: SBProps) {
  const { immediateQ, setImmediateQ } = useContext(SearchQueryContext);
  return (
    <SearchBar isLoading={isLoading} q={immediateQ} setQ={setImmediateQ} />
  );
}

export default function ResourceSearch() {
  return (
    <SearchQueryProvider>
      <PageProvider pageSize={100}>
        <_ResourceSearch />
      </PageProvider>
    </SearchQueryProvider>
  );
}
