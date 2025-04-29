import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  type OrderBy,
  type Paging,
  type SearchByTextKnowdeGetParams,
  SearchByTextKnowdeGetType,
} from "~/generated/fastAPI.schemas";

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
              <span>降順(高い順)</span>
            </label>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium mb-1">スコア重み設定</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="n_detail" className="text-xs">
                  詳細数
                </label>
                <input
                  name="n_detail"
                  type="range"
                  min={0}
                  max="10"
                  value={order.n_detail}
                  onChange={(e) =>
                    setOrderBy({ ...order, n_detail: Number(e.target.value) })
                  }
                  className="w-full"
                />
                <div className="text-xs text-right">{order.n_detail}</div>
              </div>
              <div>
                <label htmlFor="n_premise" className="text-xs">
                  前提数
                </label>
                <input
                  name="n_premise"
                  type="range"
                  min={0}
                  max="10"
                  value={order.n_premise}
                  onChange={(e) =>
                    setOrderBy({ ...order, n_premise: Number(e.target.value) })
                  }
                  className="w-full"
                />
                <div className="text-xs text-right">{order.n_premise}</div>
              </div>
              <div>
                <label htmlFor="n_conclusion" className="text-xs">
                  結論数
                </label>
                <input
                  name="n_conclusion"
                  type="range"
                  min={0}
                  max="10"
                  value={order.n_conclusion}
                  onChange={(e) =>
                    setOrderBy({
                      ...order,
                      n_conclusion: Number(e.target.value),
                    })
                  }
                  className="w-full"
                />
                <div className="text-xs text-right">{order.n_conclusion}</div>
              </div>
              <div>
                <label htmlFor="n_refer" className="text-xs">
                  参照数
                </label>
                <input
                  name="n_refer"
                  type="range"
                  min={0}
                  max="10"
                  value={order.n_refer}
                  onChange={(e) =>
                    setOrderBy({ ...order, n_refer: Number(e.target.value) })
                  }
                  className="w-full"
                />
                <div className="text-xs text-right">{order.n_refer}</div>
              </div>
              <div>
                <label htmlFor="n_referred" className="text-xs">
                  被参照数
                </label>
                <input
                  name="n_referred"
                  type="range"
                  min={0}
                  max="10"
                  value={order.n_referred}
                  onChange={(e) =>
                    setOrderBy({ ...order, n_referred: Number(e.target.value) })
                  }
                  className="w-full"
                />
                <div className="text-xs text-right">{order.n_referred}</div>
              </div>
              <div>
                <label htmlFor="dist_axiom" className="text-xs">
                  公理距離
                </label>
                <input
                  name="dist_axiom"
                  type="range"
                  min={0}
                  max="10"
                  value={order.dist_axiom}
                  onChange={(e) =>
                    setOrderBy({ ...order, dist_axiom: Number(e.target.value) })
                  }
                  className="w-full"
                />
                <div className="text-xs text-right">{order.dist_axiom}</div>
              </div>
              <div>
                <label htmlFor="dist_leaf" className="text-xs">
                  リーフ距離
                </label>
                <input
                  name="dist_leaf"
                  type="range"
                  min={0}
                  max={10}
                  value={order.dist_leaf}
                  onChange={(e) =>
                    setOrderBy({ ...order, dist_leaf: Number(e.target.value) })
                  }
                  className="w-full"
                />
                <div className="text-xs text-right">{order.dist_leaf}</div>
              </div>
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
