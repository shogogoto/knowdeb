import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useState,
} from "react";
import type { SearchByTextKnowdeGetType } from "~/generated/fastAPI.schemas";
import type { OrderBy } from "./SearchBar/types";

type SearchContextType = {
  setQ: Dispatch<SetStateAction<string>>;
  setSearchOption: Dispatch<SetStateAction<SearchByTextKnowdeGetType>>;
  setOrderBy: Dispatch<SetStateAction<OrderBy>>;
} & ValProps;

const SearchContext = createContext<SearchContextType | null>(null);

export default SearchContext;

type ValProps = {
  q: string;
  searchOption: SearchByTextKnowdeGetType;
  orderBy: OrderBy;
};
type Props = React.PropsWithChildren & ValProps;

export function SearchProvider(props: Props) {
  const [_q, setQ] = useState(props.q);
  const [_searchOption, setSearchOption] = useState(props.searchOption);
  const [_order, setOrderBy] = useState(props.orderBy);

  const value = {
    q: _q,
    setQ,
    searchOption: _searchOption,
    setSearchOption,
    orderBy: _order,
    setOrderBy,
  };

  return (
    <SearchContext.Provider value={value}>
      {props.children}
    </SearchContext.Provider>
  );
}
