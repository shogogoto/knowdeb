import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useState,
} from "react";
import { useSearchParams } from "react-router";
import { SearchByTextKnowdeGetType } from "~/generated/fastAPI.schemas";
import { type OrderBy, defaultOrderBy } from "./search/SearchBar/types";

type SearchContextType = {
  q: string;
  setQ: Dispatch<SetStateAction<string>>;
  searchOption: SearchByTextKnowdeGetType;
  setSearchOption: Dispatch<SetStateAction<SearchByTextKnowdeGetType>>;
  order: OrderBy;
  setOrderBy: Dispatch<SetStateAction<OrderBy>>;
};

const SearchContext = createContext<SearchContextType | null>(null);

export default SearchContext;

type Props = {
  children: React.ReactNode;
};

export function SearchProvider({ children }: Props) {
  const [searchParams] = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [searchOption, setSearchOption] = useState<SearchByTextKnowdeGetType>(
    (searchParams.get("search_type") as SearchByTextKnowdeGetType) ||
      SearchByTextKnowdeGetType.CONTAINS,
  );
  const [order, setOrderBy] = useState<OrderBy>(defaultOrderBy);

  const value = {
    q,
    setQ,
    searchOption,
    setSearchOption,
    order,
    setOrderBy,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
