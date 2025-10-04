import type { ResourceSearchResult } from "~/shared/generated/fastAPI.schemas";
import ResourceCard from "../ResourceCard";

type Props = {
  result: ResourceSearchResult;
};

export default function ResourceSearchResultView({ result }: Props) {
  const { total, data } = result;

  return (
    <div className="grid">
      <p>合計: {total}件</p>

      {data && data?.length > 0 ? (
        data.map((item) => <ResourceCard info={item} key={item.resource.uid} />)
      ) : (
        <p>データが見つかりませんでした。</p>
      )}
    </div>
  );
}
