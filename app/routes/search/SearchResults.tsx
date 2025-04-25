import type { KAdjacency } from "~/generated/fastAPI.schemas";

export default function SearchResults({ data }: { data: KAdjacency[] }) {
  return (
    <div className="container mx-auto p-4">
      <div className="results">
        {data.length ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              検索結果 ({data.length}件)
            </h2>
            <div className="space-y-4">
              {data.map((row) => (
                <div
                  key={row.center.uid}
                  className="p-4 border border-gray-200 rounded-md dark:border-gray-700"
                >
                  <h3 className="font-medium mb-2">{row.center.sentence}</h3>

                  {row.center.term?.names && (
                    <div className="mb-2">
                      <span className="font-semibold">用語: </span>
                      {row.center.term.names.join(", ")}
                    </div>
                  )}

                  {row.when && (
                    <div className="mb-2">
                      <span className="font-semibold">時期: </span>
                      {row.when}
                    </div>
                  )}

                  {row.stats && (
                    <div className="text-sm text-gray-600">
                      <div className="grid grid-cols-6">
                        <div>スコア: {row.stats.score}</div>
                        <div>詳細: {row.stats.n_detail}</div>
                        <div>前提: {row.stats.n_premise}</div>
                        <div>結論: {row.stats.n_conclusion}</div>
                        <div>参照: {row.stats.n_refer}</div>
                        <div>被参照: {row.stats.n_referred}</div>
                      </div>
                    </div>
                  )}

                  {/* 詳細情報 (必要に応じて折りたたみ可能にする) */}
                  {row.details && row.details.length > 0 && (
                    <div className="mt-3">
                      <details>
                        <summary className="cursor-pointer text-blue-600 dark:text-blue-400">
                          詳細 ({row.details.length}件)
                        </summary>
                        <ul className="pl-5 mt-2 list-disc">
                          {row.details.map((detail) => (
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
  );
}
