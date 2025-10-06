import {
  type SearchParamsConfig,
  createGenericSearchContext,
} from "~/shared/contexts/createGenericSearchContext";
import type { ResourceSearchBodyOrderBy } from "~/shared/generated/fastAPI.schemas";

const initialOrderBy: ResourceSearchBodyOrderBy = ["title"];
type ResourceSearch = {
  q: string;
  q_user: string;
  desc: boolean;
  order_by: ResourceSearchBodyOrderBy;
};

const config: SearchParamsConfig<ResourceSearch> = {
  q: {
    defaultValue: "",
    serialize: (value) => (value ? { q: value } : { q: "" }),
    deserialize: (params) => params.get("q") ?? "",
  },
  q_user: {
    defaultValue: "",
    serialize: (value) => (value ? { q_user: value } : { q_user: "" }),
    deserialize: (params) => params.get("q_user") ?? "",
  },
  desc: {
    defaultValue: true,
    serialize: (value) => ({ desc: String(value) }),
    deserialize: (params) => params.get("desc") !== "false",
  },
  order_by: {
    defaultValue: initialOrderBy,
    serialize: (value) => ({
      // @ts-ignore
      order_by:
        value?.length === 0 ? initialOrderBy.join(",") : value?.join(","),
    }),
    deserialize: (params) =>
      // @ts-ignore
      params
        .get("order_by")
        ?.split(",")
        .filter((s) => s.trim()) ?? initialOrderBy,
  },
};

// 3. ファクトリを呼び出して、Providerとフックを生成
const { SearchProvider, useSearch } = createGenericSearchContext(config);

// 4. 生成されたProviderとフックを、このContext用の名前でエクスポート
export const ResourceSearchProvider = SearchProvider;
export const useResourceSearch = useSearch;
export type ResourceSearchContextType = ReturnType<typeof useResourceSearch>;
