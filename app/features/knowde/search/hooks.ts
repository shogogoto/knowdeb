import type {
  KnowdeSearchResult,
  SearchByTextKnowdeGetParams,
} from "~/generated/fastAPI.schemas";
import type { searchByTextKnowdeGetResponse } from "~/generated/knowde/knowde";
import { createCacheKey, useCachedSWR } from "~/hooks/swr/useCache";
import { knowdeSearchCache } from "~/lib/indexed";

export function paramsToKey(params: SearchByTextKnowdeGetParams) {
  return createCacheKey("search", params);
}

export function useCachedSearch(params: SearchByTextKnowdeGetParams) {
  const cacheKey = createCacheKey("search", params);
  return useCachedSWR<KnowdeSearchResult, searchByTextKnowdeGetResponse>(
    cacheKey,
    knowdeSearchCache.get,
  );
}
