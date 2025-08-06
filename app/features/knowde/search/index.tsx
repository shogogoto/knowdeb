import { LoaderCircle } from "lucide-react";
import { useLoaderData } from "react-router";
import PageNavi from "~/components/Pagenation";
import PageProvider from "~/components/Pagenation/PageProvider";
import { useSearchByTextKnowdeGet } from "~/generated/knowde/knowde";
import SearchBar from "./SearchBar";
import { SearchProvider } from "./SearchContext";
import SearchResults from "./SearchResults";

export default function KnowdeSearch() {
  const loaderData = useLoaderData();

  const { params } = loaderData;
  const { data, isLoading } = useSearchByTextKnowdeGet(params);

  const total = data?.status === 200 ? data.data.total : 0;
  const pn = <PageNavi total={total} />;

  return (
    <PageProvider>
      <SearchProvider>
        <SearchBar />
        {pn}
        {isLoading ? (
          <LoaderCircle className="animate-spin justify-center" />
        ) : (
          data?.status === 200 &&
          data.data && <SearchResults data={data.data} />
        )}
        {pn}
      </SearchProvider>
    </PageProvider>
  );
}
