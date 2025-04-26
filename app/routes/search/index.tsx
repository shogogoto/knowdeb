import { searchByTextKnowdeGet } from "~/generated/knowde/knowde";
import { searchByTextKnowdeGetQueryParams } from "~/generated/knowde/knowde.zod";
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
  const obj = searchByTextKnowdeGetQueryParams.parse(raw);
  const res = await searchByTextKnowdeGet(obj);
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
