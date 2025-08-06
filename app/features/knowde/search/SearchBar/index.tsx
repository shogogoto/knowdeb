import { LoaderCircle } from "lucide-react";
import { useContext, useState } from "react";
import { Form, useNavigation, useSubmit } from "react-router";
import { PageContext } from "~/components/Pagenation/PageProvider";
import SearchContext from "../SearchContext";
import SearchConfig from "./SearchConfig";

export default function SearchBar() {
  const searchContext = useContext(SearchContext);
  const { paging, setPaging } = useContext(PageContext);
  const navigation = useNavigation();
  const submit = useSubmit();
  const [isShown, setShown] = useState(false);

  if (!searchContext) {
    throw new Error("SearchBar must be used within a SearchProvider");
  }

  const { q, setQ, searchOption, setSearchOption, order, setOrderBy } =
    searchContext;

  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";

  const toggleShow = () => setShown(!isShown);

  return (
    <Form action="/search" method="get" className="container mx-auto p-4">
      <div className="flex w-full relative">
        <input
          type="search"
          value={q}
          name="q"
          onChange={(ev) => {
            setQ(ev.target.value);
          }}
          placeholder="検索文字列を入力..."
          className="w-full border dark:bg-gray-800"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="md:w-auto px-2 border bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? <LoaderCircle className="animate-spin" /> : "🔍"}
        </button>
        <button
          type="button"
          className="md:w-auto px-2"
          onClick={toggleShow}
          disabled={isLoading}
        >
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

      {/* Hidden inputs to ensure all parameters are included in form submission */}
      <input type="hidden" name="page" value={paging.page?.toString() || "1"} />
      <input
        type="hidden"
        name="size"
        value={paging.size?.toString() || "100"}
      />
      <input type="hidden" name="search_type" value={searchOption} />

      {/* Order parameters */}
      {Object.entries(order).map(
        ([key, value]) =>
          value !== undefined && (
            <input
              key={key}
              type="hidden"
              name={key}
              value={value?.toString()}
            />
          ),
      )}
    </Form>
  );
}
