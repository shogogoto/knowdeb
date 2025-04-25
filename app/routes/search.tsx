import { searchByTextKnowdeGet } from "~/generated/knowde/knowde";
import { searchByTextKnowdeGetQueryParams } from "~/generated/knowde/knowde.zod";
import type { Route } from "./+types/search";
import SearchBar from "./search/SearchBar";

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
      <div>{status}</div>
      <SearchBar />
      <div className="container mx-auto p-4">
        <div className="results">
          {data.length ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                検索結果 ({data.length}件)
              </h2>
              <div className="space-y-4">
                {data.map((result) => (
                  <div
                    key={result.center.uid}
                    className="p-4 border border-gray-200 rounded-md dark:border-gray-700"
                  >
                    <h3 className="font-medium mb-2">
                      {result.center.sentence}
                    </h3>

                    {result.center.term?.names && (
                      <div className="mb-2">
                        <span className="font-semibold">用語: </span>
                        {result.center.term.names.join(", ")}
                      </div>
                    )}

                    {result.when && (
                      <div className="mb-2">
                        <span className="font-semibold">時期: </span>
                        {result.when}
                      </div>
                    )}

                    {result.stats && (
                      <div className="text-sm text-gray-600">
                        <div className="grid grid-cols-6">
                          <div>スコア: {result.stats.score}</div>
                          <div>詳細: {result.stats.n_detail}</div>
                          <div>前提: {result.stats.n_premise}</div>
                          <div>結論: {result.stats.n_conclusion}</div>
                          <div>参照: {result.stats.n_refer}</div>
                        </div>
                      </div>
                    )}

                    {/* 詳細情報 (必要に応じて折りたたみ可能にする) */}
                    {result.details && result.details.length > 0 && (
                      <div className="mt-3">
                        <details>
                          <summary className="cursor-pointer text-blue-600 dark:text-blue-400">
                            詳細情報 ({result.details.length}件)
                          </summary>
                          <ul className="pl-5 mt-2 list-disc">
                            {result.details.map((detail) => (
                              <li key={detail.uid} className="mt-1">
                                {detail.sentence}
                              </li>
                            ))}
                          </ul>
                        </details>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              検索結果はありません
            </div>
          )}
        </div>
      </div>
    </>
  );
}
