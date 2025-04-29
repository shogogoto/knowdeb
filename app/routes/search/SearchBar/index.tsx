import { useState } from "react";
import { Form, useNavigation } from "react-router";
import { SearchByTextKnowdeGetType } from "~/generated/fastAPI.schemas";
import SearchConfig from "./SearchConfig";
import { type OrderBy, type Paging, defaultOrderBy } from "./types";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [searchOption, setSearchOption] = useState<SearchByTextKnowdeGetType>(
    SearchByTextKnowdeGetType.CONTAINS,
  );
  const [paging, setPaging] = useState<Paging>({ page: 1, size: 100 });
  const [order, setOrderBy] = useState<OrderBy>(defaultOrderBy);
  const navigation = useNavigation();
  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";

  const [isShown, setShown] = useState(false);
  const toggleShow = () => setShown(!isShown);
  return (
    <Form action="/search" className="container mx-auto p-4">
      {/* {Object.entries(order).map(([key, value]) => `[${key}= ${value}]`)} */}
      <div className="flex w-full">
        <input
          type="search"
          value={q}
          name="q"
          onChange={(e) => setQ(e.target.value)}
          placeholder="検索文字列を入力..."
          className="w-full border dark:bg-gray-800"
        />
        <button
          type="submit"
          className="md:w-auto px-2 border bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "..." : "🔍"}
        </button>
        <button type="button" className="md:w-auto px-2" onClick={toggleShow}>
          ⚙
        </button>
      </div>
      {isShown && (
        <SearchConfig
          paging={paging}
          order={order}
          setPaging={setPaging}
          setOrderBy={setOrderBy}
          searchOption={searchOption}
          setSearchOption={setSearchOption}
        />
      )}
    </Form>
  );
}
