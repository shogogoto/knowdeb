import { Button } from "~/shared/components/ui/button";
import { useSearchResourcePostResourceSearchPost } from "~/shared/generated/entry/entry";
import type { ResourceSearchBody } from "~/shared/generated/fastAPI.schemas";
import ResourceCard from "./ResourceCard";

export default function ResourceSearch() {
  const body: ResourceSearchBody = {
    q: "",
    q_user: "",
    paging: {
      page: 1,
      size: 100,
    },
    desc: true,
    order_by: ["title", "n_char", "username"],
  };

  const { trigger, data, isMutating, error } =
    useSearchResourcePostResourceSearchPost({});

  const handleSearch = async () => {
    await trigger(body);
  };

  const displayData = data?.status === 200 ? data.data : null;

  return (
    <div className="grid gap-4">
      <Button onClick={handleSearch} disabled={isMutating} className="w-fit">
        {isMutating ? "検索中..." : "検索実行"}
      </Button>

      {/* エラー表示 */}
      {error && (
        <div style={{ color: "red" }}>
          <p>エラーが発生しました:</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      {/* データ表示 */}
      <p>合計: {displayData?.total || 0}件</p>
      {displayData && (
        <div className="grid">
          {displayData?.data?.map((item) => (
            <ResourceCard info={item} key={item.resource.uid} />
          ))}
        </div>
      )}
    </div>
  );
}
