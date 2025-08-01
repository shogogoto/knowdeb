import { useContext } from "react";
import { useNavigation } from "react-router";
import { PageContext } from "~/components/Pagenation/PageProvider";
import type { Knowde } from "~/generated/fastAPI.schemas";
import KnowdeCard from "./components/KnowdeCard";

type Props = {
  data: {
    total: number;
    data: Knowde[];
  };
};

export default function SearchResults({ data }: Props) {
  const { startIndex } = useContext(PageContext);
  const navigation = useNavigation();
  return (
    <div className="container mx-auto p-4">
      <div>
        {data.total > 0 ? (
          <div>
            <h2 className="text-xl font-semibold">検索結果 ({data.total}件)</h2>
            <div className="">
              {data.data.map((row, index) => (
                <KnowdeCard
                  row={row}
                  index={index + startIndex}
                  key={row.uid}
                />
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
