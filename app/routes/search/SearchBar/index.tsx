import { useState } from "react";
import { Form, useNavigation } from "react-router";
import {
  type OrderBy,
  type Paging,
  SearchByTextKnowdeGetType,
} from "~/generated/fastAPI.schemas";
import SearchConfig, { SearchOption } from "./SearchConfig";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [searchType, setSearchType] = useState<SearchByTextKnowdeGetType>(
    SearchByTextKnowdeGetType.CONTAINS,
  );
  const [paging, setPaging] = useState<Paging>({ page: 1, size: 100 });
  const [order, setOrderBy] = useState<OrderBy>({
    n_detail: 1,
    n_premise: 1,
    n_conclusion: 1,
    n_refer: 1,
    n_referred: 1,
    dist_axiom: 1,
    dist_leaf: 1,
    desc: true,
  });
  const navigation = useNavigation();
  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <Form action="/search">
      <div className="flex flex-col md:flex-row gap-4">
        <div>
          <input
            type="search"
            value={q}
            name="q"
            onChange={(e) => setQ(e.target.value)}
            placeholder="検索文字列を入力..."
            className="w-full p-2 border dark:bg-gray-800"
          />
        </div>
        <SearchOption val={searchType} set={setSearchType} />
        <SearchConfig
          paging={paging}
          order={order}
          setPaging={setPaging}
          setOrderBy={setOrderBy}
        />
        <button
          type="submit"
          className="md:w-auto px-4 py-2 border bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "検索中..." : "検索"}
        </button>
      </div>
    </Form>
  );
}
