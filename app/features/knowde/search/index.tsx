import { LoaderCircle } from "lucide-react";
import { useContext } from "react";
import { PContext } from "~/components/Pagenation/rephook";
import PagingNavi from "~/components/Pagenation/replace";
import { PProvider } from "~/components/Pagenation/reprovider";
import { useSearchByTextKnowdeGet } from "~/generated/knowde/knowde";
import SearchBar from "./SearchBar";
import SearchContext, {
  initialSearchState,
  SearchProvider,
} from "./SearchContext";
import SearchResults from "./SearchResults";

export function _KnowdeSearch() {
  const { q, searchOption, orderBy } = useContext(SearchContext);
  const { pageSize, current, setCurrent } = useContext(PContext);

  const params = {
    q,
    page: current,
    size: pageSize,
    search_type: searchOption,
    ...orderBy,
  };

  const { data, isLoading } = useSearchByTextKnowdeGet(params, {
    swr: {
      keepPreviousData: true,
    },
  });

  const total = data?.status === 200 ? data.data.total : 0;

  return (
    <>
      {JSON.stringify(params)}
      <SearchBar />
      <PagingNavi total={total} />
      {isLoading ? (
        <LoaderCircle className="animate-spin justify-center" />
      ) : (
        data?.status === 200 && data.data && <SearchResults data={data.data} />
      )}
    </>
  );
}

export default function KnowdeSearch() {
  return (
    <SearchProvider {...initialSearchState}>
      <PProvider pageSize={50}>
        <_KnowdeSearch />
      </PProvider>
    </SearchProvider>
  );
}
