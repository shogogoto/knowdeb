import { useContext } from "react";
import PageContext from "~/components/Pagenation/PageContext";
import { Slider } from "~/components/ui/slider";
import { SearchByTextKnowdeGetType } from "~/generated/fastAPI.schemas";
import SearchContext from "../../SearchContext";
import type { OrderBy } from "../types";

export default function SearchConfig() {
  const { immediateOrderBy, setImmediateOrderBy } = useContext(SearchContext);
  const { pageSize, setPageSize } = useContext(PageContext);
  const ranges = [
    { name: "n_detail", label: "詳細数" },
    { name: "n_premise", label: "前提数" },
    { name: "n_conclusion", label: "結論数" },
    { name: "n_refer", label: "参照数" },
    { name: "n_referred", label: "被参照数" },
    { name: "dist_axiom", label: "前提距離" },
    { name: "dist_leaf", label: "結論距離" },
  ];
  return (
    <div className="bg-white dark:bg-gray-800 border">
      <p className="font-medium mb-2">検索オプション</p>
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-1">スコア重み設定</h4>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {ranges.map((range) => (
            <WeightRange
              name={range.name}
              label={range.label}
              key={range.name}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={immediateOrderBy.desc}
            onChange={(e) =>
              setImmediateOrderBy({
                ...immediateOrderBy,
                desc: e.target.checked,
              })
            }
            className="mr-2"
            name="desc"
          />
          <span>降順{immediateOrderBy.desc}</span>
        </label>

        <label>
          ページサイズ
          <select
            name="size"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border dark:bg-gray-800"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
            <option value={200}>200</option>
          </select>
        </label>
        <SearchOption />
      </div>
    </div>
  );
}

export function SearchOption() {
  const { immediateSearchOption, setImmediateSearchOption } =
    useContext(SearchContext);
  return (
    <label>
      マッチ方式
      <select
        value={immediateSearchOption}
        onChange={(e) =>
          setImmediateSearchOption(e.target.value as SearchByTextKnowdeGetType)
        }
        className="border dark:bg-gray-800"
        name="type"
      >
        <option value={SearchByTextKnowdeGetType.CONTAINS}>部分一致</option>
        <option value={SearchByTextKnowdeGetType.REGEX}>正規表現</option>
        <option value={SearchByTextKnowdeGetType.STARTS_WITH}>前方一致</option>
        <option value={SearchByTextKnowdeGetType.ENDS_WITH}>後方一致</option>
        <option value={SearchByTextKnowdeGetType.EQUAL}>完全一致</option>
      </select>
    </label>
  );
}

type WRProps = {
  name: string;
  label: string;
};

function WeightRange({ name, label }: WRProps) {
  const { immediateOrderBy, setImmediateOrderBy } = useContext(SearchContext);
  const val = Number(immediateOrderBy[name as keyof OrderBy]);
  return (
    <div>
      <label htmlFor={name} className="text-xs flex justify-between">
        {label}
        <span className="text-xs text-right">{val}</span>
      </label>
      <Slider
        name={name}
        min={-1}
        max={5}
        step={1}
        value={[val]}
        onValueChange={(value) =>
          setImmediateOrderBy({ ...immediateOrderBy, [name]: value[0] })
        }
        className="w-full"
      />
    </div>
  );
}
