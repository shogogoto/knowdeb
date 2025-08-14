import { useVirtualizer } from "@tanstack/react-virtual";
import { useContext, useRef } from "react";
import { Link } from "react-router";
import PageContext from "~/components/Pagenation/PageContext";
import { Card } from "~/components/ui/card";
import UserAvatar from "~/features/user/UserAvatar";
import type { KnowdeSearchResult } from "~/generated/fastAPI.schemas";
import {
  KnowdeCardContent,
  KnowdeCardFooter,
} from "../../components/KnowdeCard";
import SearchContext from "../SearchContext";

type Props = {
  data: KnowdeSearchResult;
};

export default function SearchResults({ data }: Props) {
  const { q } = useContext(SearchContext);
  const { current, pageSize } = useContext(PageContext);
  const startIndex = current ? 1 + (current - 1) * pageSize : 1;

  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: data.data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 130, // A reasonable estimate for item height
    overscan: 5,
  });

  return (
    <div className="container mx-auto">
      <div>
        {data.total > 0 ? (
          <div>
            <h2 className="text-xl font-semibold">検索結果 ({data.total}件)</h2>
            <div ref={parentRef} className="max-w-3xl">
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const k = data.data[virtualItem.index];
                  const { user, resource } = data.owners[k.resource_uid];
                  return (
                    <div
                      key={virtualItem.key}
                      data-index={virtualItem.index}
                      ref={rowVirtualizer.measureElement}
                      style={{
                        // 重なって描画されないようにする。リストの仮想化に不可欠
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                      className="flex items-center border-b"
                    >
                      {user && (
                        <Link
                          to={`/user/${user.username}`}
                          className="flex w-24 flex-col items-center justify-center space-y-1"
                        >
                          <UserAvatar user={user} />
                          <span className="break-all text-center text-sm font-semibold">
                            {user.display_name}
                          </span>
                          <span className="text-center text-xs text-muted-foreground">
                            @{user.username}
                          </span>
                        </Link>
                      )}

                      <Card className="flex-1 max-w-2xl">
                        <Link to={`/knowde/${k.uid}`}>
                          <KnowdeCardContent
                            k={k}
                            resource={resource}
                            query={q}
                          />
                        </Link>
                        <KnowdeCardFooter
                          k={k}
                          index={virtualItem.index + startIndex}
                        />
                      </Card>
                    </div>
                  );
                })}
              </div>
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
