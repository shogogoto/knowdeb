import { searchByTextKnowdeGet } from "~/generated/knowde/knowde";
import type { Route } from "./+types";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

export function meta() {
  return [
    { title: "Search Knowde" },
    { name: "description", content: "Search knowledge database" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const raw = Object.fromEntries(url.searchParams.entries());
  const res = await searchByTextKnowdeGet(raw);
  if (res.status !== 200) {
    throw new Response("Error", { status: res.status });
  }
  return { data: res.data };
}

export default function Search({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData;
  return (
    <>
      <SearchBar />
      <SearchResults data={data} />
    </>
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
