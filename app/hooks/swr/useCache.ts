import { useEffect, useState } from "react";

export function createCacheKey<TParams extends object>(
  prefix: string,
  params: TParams,
) {
  const sortedParams = Object.fromEntries(Object.entries(params).sort());
  return `${prefix}-${JSON.stringify(sortedParams)}`;
}

export function useCachedSWR<TData, TResponse>(cacheKey: string) {
  const [fallbackData, setFallbackData] = useState<TResponse | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!cacheKey) {
      setFallbackData(undefined);
      return;
    }

    let isMounted = true;
    async function loadCache() {
      const { getCache } = await import("~/lib/indexed");
      const cachedData = await getCache<TData>(cacheKey);
      if (isMounted && cachedData) {
        const res = {
          status: 200,
          data: cachedData,
          headers: new Headers(),
        } as TResponse;
        setFallbackData(res);
      } else if (isMounted) {
        setFallbackData(undefined);
      }
    }
    loadCache();

    return () => {
      isMounted = false;
    };
  }, [cacheKey]);

  return fallbackData;
}
