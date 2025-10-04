import { useContext, useEffect } from "react";
import SearchBar from "~/shared/components/SearchBar";
import { useSearchResourcePostResourceSearchPost } from "~/shared/generated/entry/entry";
import SearchQueryContext, {
  SearchQueryProvider,
} from "~/shared/search/SearchContext";
import ResourceSearchResultView from "./ResourceSearchResult";

function _ResourceSearch() {
  const { q } = useContext(SearchQueryContext);

  const { trigger, data, isMutating, error } =
    useSearchResourcePostResourceSearchPost({});

  useEffect(() => {
    trigger({
      q,
      q_user: "",
      paging: {
        page: 1,
        size: 100,
      },
      desc: true,
      order_by: ["title", "n_char", "username"],
    });
  }, [trigger, q]);

  const displayData = data?.status === 200 ? data.data : { total: 0, data: [] };

  return (
    <div className="grid gap-4">
      <ResourceSearchBar isLoading={isMutating} />
      <ResourceSearchResultView result={displayData} />
    </div>
  );
}

type SBProps = {
  isLoading: boolean;
};

function ResourceSearchBar({ isLoading }: SBProps) {
  const { immediateQ, setImmediateQ } = useContext(SearchQueryContext);
  return (
    <SearchBar isLoading={isLoading} q={immediateQ} setQ={setImmediateQ} />
  );
}

export default function ResourceSearch() {
  return (
    <SearchQueryProvider>
      <_ResourceSearch />
    </SearchQueryProvider>
  );
}
