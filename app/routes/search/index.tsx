import {
  type KnowdeSearchResult,
  SearchByTextKnowdeGetType,
} from "~/generated/fastAPI.schemas";
import { searchByTextKnowdeGet } from "~/generated/knowde/knowde";
import type { Route } from "./+types";
import SearchBar from "./SearchBar";
import { SearchProvider } from "./SearchContext";
import SearchResults from "./SearchResults";

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

  // Set page and size parameters before sending the request
  const params = Object.fromEntries(url.searchParams.entries());
  params.page = page.toString();
  params.size = size.toString();

  if (!params.search_type) {
    params.search_type = SearchByTextKnowdeGetType.CONTAINS;
  }
  const res = await searchByTextKnowdeGet(params);
  const data = res.data as KnowdeSearchResult;

  return {
    data,
    q,
    page,
    size,
    searchType: params.search_type,
  };
}

export default function Search({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData;

  return (
    <SearchProvider>
      <SearchBar />
      <SearchResults data={data} />
    </SearchProvider>
  );
}

export function HydrateFallback() {
  return (
    <div id="loading-splash">
      <div id="loading-splash-spinner" />
      <p>読み込み中、しばらくお待ちください...</p>
    </div>
  );
}
