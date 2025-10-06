import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import type { UserSearchResult } from "~/shared/generated/fastAPI.schemas";
import { UserCard } from "./UserCard";

type Props = {
  result: UserSearchResult;
};

export default function SearchResult({ result }: Props) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: result.data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // ユーザーカードのおおよその高さ
    overscan: 5,
  });

  return (
    <div className="container mx-auto">
      {result.total > 0 ? (
        <div ref={parentRef} className="max-w-3xl">
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const row = result.data[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  className="border-b"
                >
                  <UserCard row={row} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          検索結果はありません
        </div>
      )}
    </div>
  );
}
