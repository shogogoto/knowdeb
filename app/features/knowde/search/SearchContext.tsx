import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "react-router";
import { SearchByTextKnowdeGetType } from "~/shared/generated/fastAPI.schemas";
import { useDebounce } from "~/shared/hooks/useDebounce";
import { type OrderBy, defaultOrderBy } from "./SearchBar/types";

type SearchContextType = {
  q: string;
  searchOption: SearchByTextKnowdeGetType;
  orderBy: OrderBy;
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

type Props = React.PropsWithChildren;

export function SearchProvider({ children }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [immediateQ, setImmediateQ] = useState(searchParams.get("q") || "");
  const [immediateSearchOption, setImmediateSearchOption] =
    useState<SearchByTextKnowdeGetType>(
      (searchParams.get("type") as SearchByTextKnowdeGetType) ||
        SearchByTextKnowdeGetType.CONTAINS,
    );
  const [immediateOrderBy, setImmediateOrderBy] = useState<OrderBy>(() => {
    const initial: { [key: string]: unknown } = { ...defaultOrderBy };
    for (const key in defaultOrderBy) {
      const paramValue = searchParams.get(key);
      if (paramValue !== null) {
        if (key === "desc") {
          initial[key] = paramValue === "true";
        } else {
          const numValue = Number(paramValue);
          if (!Number.isNaN(numValue)) {
            initial[key] = numValue;
          }
        }
      }
    }
    return initial as OrderBy;
  });
  const ms = 500;
  const q = useDebounce(immediateQ, ms);
  const searchOption = useDebounce(immediateSearchOption, ms);
  const orderBy = useDebounce(immediateOrderBy, ms);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (q) {
      newParams.set("q", q);
    } else {
      newParams.delete("q");
    }
    if (searchOption !== SearchByTextKnowdeGetType.CONTAINS) {
      newParams.set("type", searchOption);
    } else {
      newParams.delete("type");
    }

    for (const key in orderBy) {
      const K = key as keyof OrderBy;
      const value = orderBy[K];
      const defaultValue = defaultOrderBy[K];

      if (value !== defaultValue) {
        newParams.set(key, String(value));
      } else {
        newParams.delete(key);
      }
    }
    if (newParams.toString() !== searchParams.toString()) {
      setSearchParams(newParams, { replace: true });
    }
  }, [q, searchOption, orderBy, searchParams, setSearchParams]);

  const value: SearchContextType = {
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
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
