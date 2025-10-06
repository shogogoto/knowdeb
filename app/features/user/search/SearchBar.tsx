import SearchBar from "~/shared/components/SearchBar";
import UserSearchConfig from "./SearchConfig";
import { useUserSearch } from "./SearchContext";

type Props = {
  isLoading: boolean;
};

export default function UserSearchBar({ isLoading }: Props) {
  const {
    immediateParams: { q },
    setImmediateParams,
  } = useUserSearch();
  return (
    <SearchBar
      isLoading={isLoading}
      q={q}
      setQ={(s: string) => setImmediateParams((prev) => ({ ...prev, q: s }))}
    >
      <UserSearchConfig />
    </SearchBar>
  );
}
