import {
  type SearchParamsConfig,
  createGenericSearchContext,
} from "~/shared/contexts/createGenericSearchContext";

type SearchQuery = { q: string };
const config: SearchParamsConfig<SearchQuery> = {
  q: {
    defaultValue: "",
    serialize: (value) => (value ? { q: value } : { q: "" }),
    deserialize: (searchParams) => searchParams.get("q") ?? "",
  },
};

const { SearchProvider, useSearch } = createGenericSearchContext(config);

export const SearchQueryProvider = SearchProvider;
export const useSearchQuery = useSearch;

export type SearchQueryContextType = ReturnType<typeof useSearchQuery>;
