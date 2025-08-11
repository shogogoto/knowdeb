import type { KnowdeDetail } from "~/generated/fastAPI.schemas";
import type { detailKnowdeSentenceSentenceIdGetResponse } from "~/generated/knowde/knowde";
import { useCachedSWR } from "~/hooks/swr/useCache";
import { knowdeDetailCache } from "~/lib/indexed";

export function useCachedKnowdeDetail(id: string) {
  return useCachedSWR<KnowdeDetail, detailKnowdeSentenceSentenceIdGetResponse>(
    id,
    knowdeDetailCache.get,
  );
}
