import { useContext } from "react";
import { PageContext } from "~/components/Pagenation/PageProvider";
import { Card, CardHeader } from "~/components/ui/card";
import type { KnowdeSearchResult } from "~/generated/fastAPI.schemas";
import { KnowdeCardContent, KnowdeCardFooter } from "../components/KnowdeCard";
import ResourcePath from "../components/ResourcePath";
import UserInfo from "../components/UserInfo";

type Props = {
  data: KnowdeSearchResult;
};

export default function SearchResults({ data }: Props) {
  const { startIndex } = useContext(PageContext);
  return (
    <div className="container mx-auto p-4">
      <div>
        {data.total > 0 ? (
          <div>
            <h2 className="text-xl font-semibold">検索結果 ({data.total}件)</h2>
            <div className="">
              {data.data.map((k, index) => {
                const { user, resource } = data.owners[k.resource_uid];
                return (
                  <Card key={k.uid} className="w-full max-w-2xl border">
                    <CardHeader>
                      <UserInfo user={user}>
                        <ResourcePath resource={resource} />
                      </UserInfo>
                    </CardHeader>
                    <KnowdeCardContent k={k} />
                    <KnowdeCardFooter k={k} index={index} />
                  </Card>
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
