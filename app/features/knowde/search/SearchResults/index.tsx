import { useContext } from "react";
import { Link } from "react-router";
import { PageContext } from "~/components/Pagenation/PageProvider";
import { Card } from "~/components/ui/card";
import UserAvatar from "~/features/user/UserAvatar";
import type { KnowdeSearchResult } from "~/generated/fastAPI.schemas";
import {
  KnowdeCardContent,
  KnowdeCardFooter,
} from "../../components/KnowdeCard";

type Props = {
  data: KnowdeSearchResult;
};

export default function SearchResults({ data }: Props) {
  const { startIndex } = useContext(PageContext);
  return (
    <div className="container mx-auto">
      <div>
        {data.total > 0 ? (
          <div>
            <h2 className="text-xl font-semibold">検索結果 ({data.total}件)</h2>
            <div className="divide-y max-w-2xl">
              {data.data.map((k, index) => {
                const { user, resource } = data.owners[k.resource_uid];
                return (
                  <div className="flex items-center" key={k.uid}>
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
                        <KnowdeCardContent k={k} resource={resource} />
                      </Link>
                      <KnowdeCardFooter k={k} index={index + startIndex} />
                    </Card>
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
    </div>
  );
}
