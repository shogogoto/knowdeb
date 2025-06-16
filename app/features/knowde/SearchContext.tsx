import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useState,
} from "react";
import { useSearchParams } from "react-router";
import type { PagenationState, Paging } from "~/components/Pagenation";
import { SearchByTextKnowdeGetType } from "~/generated/fastAPI.schemas";
import { type OrderBy, defaultOrderBy } from "./SearchBar/types";

type SearchContextType = {
  q: string;
  setQ: Dispatch<SetStateAction<string>>;
  searchOption: SearchByTextKnowdeGetType;
  setSearchOption: Dispatch<SetStateAction<SearchByTextKnowdeGetType>>;
  order: OrderBy;
  setOrderBy: Dispatch<SetStateAction<OrderBy>>;
  pagenationState: PagenationState;
};

const SearchContext = createContext<SearchContextType | null>(null);

export default SearchContext;

type Props = {
  children: React.ReactNode;
};

export function SearchProvider({ children }: Props) {
  const [searchParams] = useSearchParams();

  const pageParam = searchParams.get("page");
  const sizeParam = searchParams.get("size");
  const initialPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const initialSize = sizeParam ? Number.parseInt(sizeParam, 10) : 50;

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [searchOption, setSearchOption] = useState<SearchByTextKnowdeGetType>(
    (searchParams.get("search_type") as SearchByTextKnowdeGetType) ||
      SearchByTextKnowdeGetType.CONTAINS,
  );

  const [paging, setPaging] = useState<Paging>({
    page: initialPage,
    size: initialSize,
  });
  const [order, setOrderBy] = useState<OrderBy>(defaultOrderBy);

  const value = {
    q,
    setQ,
    searchOption,
    setSearchOption,
    order,
    setOrderBy,
    pagenationState: {
      paging,
      setPaging,
    },
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
