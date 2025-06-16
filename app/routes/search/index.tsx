import { LoaderCircle } from "lucide-react";
import SearchBar from "~/features/knowde/SearchBar";
import { SearchProvider } from "~/features/knowde/SearchContext";
import SearchResults from "~/features/knowde/SearchResults";
import { SearchByTextKnowdeGetType } from "~/generated/fastAPI.schemas";
import { useSearchByTextKnowdeGet } from "~/generated/knowde/knowde";
import type { Route } from "./+types";

export function meta() {
  return [
    { title: "Search Knowde" },
    { name: "description", content: "Search knowledge database" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";

  const page = url.searchParams.get("page") || "1";
  const size = url.searchParams.get("size") || "50";

  const params = Object.fromEntries(url.searchParams.entries());
  params.page = page.toString();
  params.size = size.toString();

  if (!params.search_type) {
    params.search_type = SearchByTextKnowdeGetType.CONTAINS;
  }

  return {
    params,
    q,
    page,
    size,
    searchType: params.search_type,
  };
}

export default function Search({ loaderData }: Route.ComponentProps) {
  const { params } = loaderData;
  const { data, isLoading } = useSearchByTextKnowdeGet(params);

  return (
    <SearchProvider>
      <SearchBar />
      {isLoading ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        data?.status === 200 && data.data && <SearchResults data={data.data} />
      )}
    </SearchProvider>
  );
}

// export function HydrateFallback() {
//   return (
//     <div id="loading-splash">
//       <div id="loading-splash-spinner" />
//       <p>読み込み中、しばらくお待ちください...</p>
//     </div>
//   );
// }
