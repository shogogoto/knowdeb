import { LoaderCircle } from "lucide-react";
import { useLoaderData } from "react-router";
import { useSearchParams } from "react-router";
import PageNavi from "~/components/Pagenation";
import PagingNavi from "~/components/Pagenation/replace";
import { PProvider } from "~/components/Pagenation/reprovider";
import { SearchByTextKnowdeGetType } from "~/generated/fastAPI.schemas";
import { useSearchByTextKnowdeGet } from "~/generated/knowde/knowde";
import SearchBar from "./SearchBar";
import { defaultOrderBy } from "./SearchBar/types";
import { SearchProvider } from "./SearchContext";
import SearchResults from "./SearchResults";

export default function KnowdeSearch() {
  const loaderData = useLoaderData();
  const { params } = loaderData;

  const { data, isLoading } = useSearchByTextKnowdeGet(params, {
    // swr: { fallbackData: getItem() },
  });

  const total = data?.status === 200 ? data.data.total : 0;
  const pn = <PageNavi total={total} />;

  const [searchParams] = useSearchParams();
  const value = {
    q: searchParams.get("q") || "",
    searchOption:
      (searchParams.get("search_type") as SearchByTextKnowdeGetType) ||
      SearchByTextKnowdeGetType.CONTAINS,
    orderBy: defaultOrderBy,
  };
  return (
    <PProvider total={total} pageSize={50} initial={1}>
      <SearchProvider {...value}>
        <>
          <SearchBar />
          <PagingNavi />
          {isLoading ? (
            <LoaderCircle className="animate-spin justify-center" />
          ) : (
            data?.status === 200 &&
            data.data && <SearchResults data={data.data} />
          )}
          <PagingNavi />
        </>
      </SearchProvider>
    </PProvider>
  );
}
