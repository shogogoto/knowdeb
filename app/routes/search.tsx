import { useState } from "react";
import { ThemeProvider } from "~/components/theme";
import { ThemeToggle } from "~/components/theme/theme-toggle";
import {
  type KAdjacency,
  SearchByTextKnowdeGetType,
} from "~/generated/fastAPI.schemas";
import { searchByTextKnowdeGet } from "~/generated/knowde/knowde";

export function meta() {
  return [
    { title: "Search Knowde" },
    { name: "description", content: "Search knowledge database" },
  ];
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchByTextKnowdeGetType>(
    SearchByTextKnowdeGetType.CONTAINS,
  );
  const [results, setResults] = useState<KAdjacency[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("検索語を入力してください");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchByTextKnowdeGet({
        q: searchQuery,
        type: searchType,
      });

      if (response.status === 200) {
        setResults(response.data);
      } else {
        setError("検索中にエラーが発生しました");
        console.error("API error:", response);
      }
    } catch (err) {
      setError("検索中にエラーが発生しました");
      console.error("Error during search:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">知識検索</h1>
          <ThemeToggle />
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="検索語を入力..."
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="md:w-48">
              <select
                value={searchType}
                onChange={(e) =>
                  setSearchType(e.target.value as SearchByTextKnowdeGetType)
                }
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
              >
                <option value={SearchByTextKnowdeGetType.CONTAINS}>
                  部分一致
                </option>
                <option value={SearchByTextKnowdeGetType.REGEX}>
                  正規表現
                </option>
                <option value={SearchByTextKnowdeGetType.STARTS_WITH}>
                  前方一致
                </option>
                <option value={SearchByTextKnowdeGetType.ENDS_WITH}>
                  後方一致
                </option>
                <option value={SearchByTextKnowdeGetType.EQUAL}>
                  完全一致
                </option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "検索中..." : "検索"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-2 text-red-600 dark:text-red-400">{error}</div>
          )}
        </form>

        <div className="results">
          {results.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                検索結果 ({results.length}件)
              </h2>
              <div className="space-y-4">
                {results.map((result) => (
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
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
          ) : !isLoading && searchQuery.trim() !== "" ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              検索結果はありません
            </div>
          ) : null}
        </div>
      </div>
    </ThemeProvider>
  );
}
