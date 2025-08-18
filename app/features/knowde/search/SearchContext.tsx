import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useState,
} from "react";
import { SearchByTextKnowdeGetType } from "~/shared/generated/fastAPI.schemas";
import { useDebounce } from "~/shared/hooks/useDebounce";
import { type OrderBy, defaultOrderBy } from "./SearchBar/types";

type SearchContextType = {
  // Debounceされた値
  q: string;
  searchOption: SearchByTextKnowdeGetType;
  orderBy: OrderBy;
  // 即時反映される値
  immediateQ: string;
  immediateSearchOption: SearchByTextKnowdeGetType;
  immediateOrderBy: OrderBy;
  // セッター
  setImmediateQ: Dispatch<SetStateAction<string>>;
  setImmediateSearchOption: Dispatch<SetStateAction<SearchByTextKnowdeGetType>>;
  setImmediateOrderBy: Dispatch<SetStateAction<OrderBy>>;
};

export const initialSearchState: SearchContextType = {
  q: "",
  searchOption: SearchByTextKnowdeGetType.CONTAINS,
  orderBy: defaultOrderBy,
  immediateQ: "",
  immediateSearchOption: SearchByTextKnowdeGetType.CONTAINS,
  immediateOrderBy: defaultOrderBy,
  setImmediateQ: () => {},
  setImmediateSearchOption: () => {},
  setImmediateOrderBy: () => {},
};

const SearchContext = createContext<SearchContextType>(initialSearchState);

export default SearchContext;

type ValProps = {
  q: string;
  searchOption: SearchByTextKnowdeGetType;
  orderBy: OrderBy;
};
type Props = React.PropsWithChildren & ValProps;

export function SearchProvider(props: Props) {
  const [immediateQ, setImmediateQ] = useState(props.q);
  const [immediateSearchOption, setImmediateSearchOption] = useState(
    props.searchOption,
  );
  const [immediateOrderBy, setImmediateOrderBy] = useState(props.orderBy);

  const ms = 1000;
  const q = useDebounce(immediateQ, ms);
  const searchOption = useDebounce(immediateSearchOption, ms);
  const orderBy = useDebounce(immediateOrderBy, ms);

  const value = {
    q,
    searchOption,
    orderBy,
    immediateQ,
    immediateSearchOption,
    immediateOrderBy,
    setImmediateQ,
    setImmediateSearchOption,
    setImmediateOrderBy,
  };

  return (
    <SearchContext.Provider value={value}>
      {props.children}
    </SearchContext.Provider>
  );
}
