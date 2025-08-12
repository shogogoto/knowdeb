"use client";
import { useLiveQuery } from "dexie-react-hooks";
import { knowdeDetailCache } from "~/lib/indexed"; // knowdeDetailCache の代わりに db をインポート

export function CacheInfo() {
  const count = useLiveQuery(() => knowdeDetailCache.count());

  return (
    <div className="fixed bottom-4 right-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-md shadow-lg text-sm">
      Cached Knowdes details: {count ?? "..."}
    </div>
  );
}
