import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "react-router";
import { useDebounce } from "~/shared/hooks/useDebounce";

type SearchQueryContextType = {
  q: string;
  immediateQ: string;
  setImmediateQ: Dispatch<SetStateAction<string>>;
};

export const initialSearchState: SearchQueryContextType = {
  q: "",
  immediateQ: "",
  setImmediateQ: () => {},
};

const SearchQueryContext =
  createContext<SearchQueryContextType>(initialSearchState);
export default SearchQueryContext;

type Props = React.PropsWithChildren;

export function SearchQueryProvider({ children }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [immediateQ, setImmediateQ] = useState(searchParams.get("q") || "");
  const ms = 500;
  const q = useDebounce(immediateQ, ms);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `searchParams` 意図的に除外 state -> 古いurl に置き換えてしまうのを防ぐ
  useEffect(() => {
    // state -> url の同期
    const newParams = new URLSearchParams(searchParams);
    if (q) {
      newParams.set("q", q);
    } else {
      newParams.delete("q");
    }
    if (newParams.toString() !== searchParams.toString()) {
      setSearchParams(newParams, { replace: true });
    }
  }, [q]);

  useEffect(() => {
    const urlQ = searchParams.get("q") || "";
    setImmediateQ(urlQ);
  }, [searchParams]);

  const value: SearchQueryContextType = {
    q,
    immediateQ,
    setImmediateQ,
  };

  return (
    <SearchQueryContext.Provider value={value}>
      {children}
    </SearchQueryContext.Provider>
  );
}
