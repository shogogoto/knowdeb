import { useEffect, useState } from "react";
import type {
  KnowdeSearchResult,
  SearchByTextKnowdeGetParams,
} from "~/generated/fastAPI.schemas";
import type { searchByTextKnowdeGetResponse } from "~/generated/knowde/knowde";
import { getCache } from "~/lib/indexed";

export function paramsToKey(params: SearchByTextKnowdeGetParams): string {
  const sortedParams = Object.fromEntries(Object.entries(params).sort());
  return `search-${JSON.stringify(sortedParams)}`;
}

export function useCachedSearch(params: SearchByTextKnowdeGetParams) {
  const [fallbackData, setFallbackData] = useState<
    searchByTextKnowdeGetResponse | undefined
  >(undefined);
  const cacheKey = paramsToKey(params);
  useEffect(() => {
    let isMounted = true;
    async function loadCache() {
      const cachedData = await getCache<KnowdeSearchResult>(cacheKey);
      if (isMounted && cachedData) {
        const res: searchByTextKnowdeGetResponse = {
          status: 200,
          data: cachedData,
          headers: new Headers(),
        };

        setFallbackData(res);
        console.log("LOADED!!!!!");
      }
    }
    loadCache();
    return () => {
      isMounted = false;
    };
  }, [cacheKey]);

  return fallbackData;
}
