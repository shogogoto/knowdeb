import type { LoaderFunctionArgs } from "react-router";
import { SearchByTextKnowdeGetType } from "~/generated/fastAPI.schemas";

export async function searchKnowde({ request }: LoaderFunctionArgs) {
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
