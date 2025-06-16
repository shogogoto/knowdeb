import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Paging } from "~/components/Pagenation";
import {
  type SearchByTextKnowdeGetParams,
  SearchByTextKnowdeGetType,
} from "~/generated/fastAPI.schemas";
import type { OrderBy } from "../types";
import WeightRange from "./WeightRange";

type SearchOptionProps = {
  searchOption: SearchByTextKnowdeGetType;
  setSearchOption: Dispatch<SetStateAction<SearchByTextKnowdeGetType>>;
};
type Props = Omit<SearchByTextKnowdeGetParams, "q" | "type"> & {
  setPaging: Dispatch<SetStateAction<Paging>>;
  setOrderBy: Dispatch<SetStateAction<OrderBy>>;
  paging: Paging;
  order: OrderBy;
} & SearchOptionProps;

export default function SearchConfig(props: Props) {
  const {
    paging,
    order,
    setPaging,
    setOrderBy,
    searchOption,
    setSearchOption,
  } = props;
  const [showConfig, setShowConfig] = useState(false);
  const ranges = [
    { name: "n_detail", label: "詳細数" },
    { name: "n_premise", label: "前提数" },
    { name: "n_conclusion", label: "結論数" },
    { name: "n_refer", label: "参照数" },
    { name: "n_referred", label: "被参照数" },
    { name: "dist_axiom", label: "公理距離" },
    { name: "dist_leaf", label: "リーフ距離" },
  ];
  return (
    <div className="bg-white dark:bg-gray-800 border p-4">
      <p className="font-medium mb-2">検索オプション</p>
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-1">スコア重み設定</h4>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {ranges.map((range) => (
            <WeightRange
              name={range.name}
              label={range.label}
              order={order}
              setOrderBy={setOrderBy}
              key={range.name}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={order.desc}
            // onChange={() => setOrderBy({ ...order, desc: !order.desc })}
            onChange={(e) => setOrderBy({ ...order, desc: e.target.checked })}
            className="mr-2"
            name="desc"
          />
          <span>降順{order.desc}</span>
        </label>

        <label>
          ページサイズ
          <select
            name="size"
            value={paging.size}
            onChange={(e) =>
              setPaging({ ...paging, size: Number(e.target.value) })
            }
            className="border dark:bg-gray-800"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
            <option value={200}>200</option>
          </select>
        </label>
        <SearchOption
          searchOption={searchOption}
          setSearchOption={setSearchOption}
        />
      </div>
    </div>
  );
}

export function SearchOption(props: SearchOptionProps) {
  const { searchOption: val, setSearchOption: set } = props;
  return (
    <label>
      マッチ方式
      <select
        value={val}
        onChange={(e) => set(e.target.value as SearchByTextKnowdeGetType)}
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
