import SearchBar from "~/shared/components/SearchBar";
import { useKnowdeSearch } from "../SearchContext";
import KnowdeSearchConfig from "./SearchConfig";

type Props = {
  isLoading?: boolean;
};

export default function KnowdeSearchBar({ isLoading }: Props) {
  const {
    immediateParams: { q: immediateQ },
    setImmediateParams,
  } = useKnowdeSearch();
  return (
    <SearchBar
      isLoading={isLoading}
      q={immediateQ}
      setQ={(s) => setImmediateParams((prev) => ({ ...prev, q: s }))}
    >
      <KnowdeSearchConfig />
    </SearchBar>
  );
}
