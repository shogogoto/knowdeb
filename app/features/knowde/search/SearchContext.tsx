import {
  type SearchParamsConfig,
  createGenericSearchContext,
} from "~/shared/contexts/createGenericSearchContext";
import { SearchByTextKnowdeGetType } from "~/shared/generated/fastAPI.schemas";
import { type OrderBy, defaultOrderBy } from "./SearchBar/types";

type KnowdeSearch = {
  q: string;
  searchOption: SearchByTextKnowdeGetType;
  orderBy: OrderBy;
};

const config: SearchParamsConfig<KnowdeSearch> = {
  q: {
    defaultValue: "",
    serialize: (value) => (value ? { q: value } : { q: "" }),
    deserialize: (params) => params.get("q") ?? "",
  },
  searchOption: {
    defaultValue: SearchByTextKnowdeGetType.CONTAINS,
    serialize: (value) =>
      value !== SearchByTextKnowdeGetType.CONTAINS
        ? { type: value }
        : { type: SearchByTextKnowdeGetType.CONTAINS },
    deserialize: (params) =>
      (params.get("type") as SearchByTextKnowdeGetType) ||
      SearchByTextKnowdeGetType.CONTAINS,
  },
  orderBy: {
    defaultValue: defaultOrderBy,
    serialize: (value) => {
      const params: Record<string, string> = {};
      for (const key in value) {
        const K = key as keyof OrderBy;
        if (value[K] !== defaultOrderBy[K]) {
          params[key] = String(value[K]);
        }
      }
      return params;
    },
    deserialize: (params) => {
      const newOrderBy: { [key: string]: unknown } = { ...defaultOrderBy };
      for (const key in defaultOrderBy) {
        const paramValue = params.get(key);
        if (paramValue !== null) {
          if (key === "desc") {
            newOrderBy[key] = paramValue === "true";
          } else {
            const numValue = Number(paramValue);
            if (!Number.isNaN(numValue)) {
              newOrderBy[key] = numValue;
            }
          }
        }
      }
      return newOrderBy as OrderBy;
    },
  },
};

const { SearchProvider, useSearch } = createGenericSearchContext(config);

export const KnowdeSearchProvider = SearchProvider;
export const useKnowdeSearch = useSearch;
export type KnowdeSearchContextType = ReturnType<typeof useKnowdeSearch>;
