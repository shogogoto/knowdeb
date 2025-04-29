import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  type SearchByTextKnowdeGetParams,
  SearchByTextKnowdeGetType,
} from "~/generated/fastAPI.schemas";

export type Paging = {
  page?: number;
  size?: number;
};

export type OrderBy = {
  n_detail?: number;
  n_premise?: number;
  n_conclusion?: number;
  n_refer?: number;
  n_referred?: number;
  dist_axiom?: number;
  dist_leaf?: number;
  desc?: boolean;
};

type Props = Omit<SearchByTextKnowdeGetParams, "q" | "type"> & {
  setPaging: Dispatch<SetStateAction<Paging>>;
  setOrderBy: Dispatch<SetStateAction<OrderBy>>;
  paging: Paging;
  order: OrderBy;
};

export default function SearchConfig(props: Props) {
  const { paging, order, setPaging, setOrderBy } = props;
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowConfig(!showConfig)}
        className="w-full md:w-auto px-4 py-2 border bg-gray-200 dark:bg-gray-700"
      >
        詳細設定
      </button>

      {showConfig && (
        <div className="absolute z-10 mt-1 w-64 md:w-96 bg-white dark:bg-gray-800 border shadow-lg p-4">
          <h3 className="font-medium mb-2">検索オプション</h3>

          <div className="mb-4">
            <select
              name="size"
              value={paging.size}
              onChange={(e) =>
                setPaging({ ...paging, size: Number(e.target.value) })
              }
              className="w-full p-2 border dark:bg-gray-800"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={150}>150</option>
              <option value={200}>200</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={order.desc}
                onChange={() => setOrderBy({ ...order, desc: !order.desc })}
                className="mr-2"
                name="desc"
              />
              <span>降順</span>
            </label>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium mb-1">スコア重み設定</h4>
            <div className="grid grid-cols-2 gap-2">
              <WeightRange
                name="n_detail"
                label="詳細数"
                order={order}
                setOrderBy={setOrderBy}
              />
              <WeightRange
                name="n_premise"
                label="前提数"
                order={order}
                setOrderBy={setOrderBy}
              />
              <WeightRange
                name="n_conclusion"
                label="結論数"
                order={order}
                setOrderBy={setOrderBy}
              />
              <WeightRange
                name="n_refer"
                label="参照数"
                order={order}
                setOrderBy={setOrderBy}
              />
              <WeightRange
                name="n_referred"
                label="被参照数"
                order={order}
                setOrderBy={setOrderBy}
              />
              <WeightRange
                name="dist_axiom"
                label="公理距離"
                order={order}
                setOrderBy={setOrderBy}
              />
              <WeightRange
                name="dist_leaf"
                label="リーフ距離"
                order={order}
                setOrderBy={setOrderBy}
              />
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowConfig(false)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type WRProps = {
  name: string;
  label: string;
  order: OrderBy;
  setOrderBy: Dispatch<SetStateAction<OrderBy>>;
};

function WeightRange({ name, label, order, setOrderBy }: WRProps) {
  const val = Number(order[name as keyof OrderBy]);

  return (
    <div>
      <label htmlFor={name} className="text-xs flex justify-between">
        {label}
        <span className="text-xs text-right">{val}</span>
      </label>
      <input
        name={name}
        type="range"
        min={-5}
        max={5}
        value={val}
        onChange={(e) =>
          setOrderBy({ ...order, [name]: Number(e.target.value) })
        }
        className="w-full"
      />
    </div>
  );
}

type SearchOptionProps = {
  val: SearchByTextKnowdeGetType;
  set: Dispatch<SetStateAction<SearchByTextKnowdeGetType>>;
};

export function SearchOption(props: SearchOptionProps) {
  const { val, set } = props;
  return (
    <div className="md:w-24">
      <select
        value={val}
        onChange={(e) => set(e.target.value as SearchByTextKnowdeGetType)}
        className="w-full p-2 border dark:bg-gray-800"
        name="type"
      >
        <option value={SearchByTextKnowdeGetType.CONTAINS}>部分一致</option>
        <option value={SearchByTextKnowdeGetType.REGEX}>正規表現</option>
        <option value={SearchByTextKnowdeGetType.STARTS_WITH}>前方一致</option>
        <option value={SearchByTextKnowdeGetType.ENDS_WITH}>後方一致</option>
        <option value={SearchByTextKnowdeGetType.EQUAL}>完全一致</option>
      </select>
    </div>
  );
}
