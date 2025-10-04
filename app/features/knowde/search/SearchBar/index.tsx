import { useContext } from "react";
import SearchBar from "~/shared/components/SearchBar";
import SearchContext from "../SearchContext";
import KnowdeSearchConfig from "./SearchConfig";

type Props = {
  isLoading?: boolean;
};

export default function KnowdeSearchBar({ isLoading }: Props) {
  const { immediateQ, setImmediateQ } = useContext(SearchContext);
  return (
    <SearchBar isLoading={isLoading} q={immediateQ} setQ={setImmediateQ}>
      <KnowdeSearchConfig />
    </SearchBar>
  );
}
