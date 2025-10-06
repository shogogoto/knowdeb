import {
  type SearchParamsConfig,
  createGenericSearchContext,
} from "~/shared/contexts/createGenericSearchContext";

type UserSearch = {
  q: string;
};

const config: SearchParamsConfig<UserSearch> = {
  q: {
    defaultValue: "",
    serialize: (value) => (value ? { q: value } : { q: "" }),
    deserialize: (params) => params.get("q") ?? "",
  },
};

const { SearchProvider, useSearch } = createGenericSearchContext(config);

export const UserSearchProvider = SearchProvider;
export const useUserSearch = useSearch;
