import { LoaderCircle } from "lucide-react";
import { useContext, useState } from "react";
import { Form, useNavigation, useSubmit } from "react-router";
import SearchContext from "../SearchContext";
import SearchConfig from "./SearchConfig";

export default function SearchBar() {
  const searchContext = useContext(SearchContext);
  const navigation = useNavigation();
  const submit = useSubmit();
  const [isShown, setShown] = useState(false);

  if (!searchContext) {
    throw new Error("SearchBar must be used within a SearchProvider");
  }

  const {
    q,
    setQ,
    searchOption,
    setSearchOption,
    paging,
    setPaging,
    order,
    setOrderBy,
  } = searchContext;

  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";

  const toggleShow = () => setShown(!isShown);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset to page 1 when performing a new search
    setPaging((prev) => ({ ...prev, page: 1 }));

    // Prepare search parameters
    const formData = new FormData();
    formData.append("q", q);
    formData.append("search_type", searchOption);
    formData.append("page", "1");
    formData.append("size", paging.size?.toString() || "100");

    // Add ordering parameters
    Object.entries(order).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    submit(formData, { method: "get", action: "/search" });
  };

  return (
    <Form
      action="/search"
      method="get"
      className="container mx-auto p-4"
      onSubmit={handleSearch}
    >
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
              value={value.toString()}
            />
          ),
      )}
    </Form>
  );
}
