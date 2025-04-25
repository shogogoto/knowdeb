import { type Dispatch, type SetStateAction, useState } from "react";
import { Form, useNavigation } from "react-router";
import { SearchByTextKnowdeGetType } from "~/generated/fastAPI.schemas";

export default function SearchBar() {
  const [q, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchByTextKnowdeGetType>(
    SearchByTextKnowdeGetType.CONTAINS,
  );
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
            onChange={(e) => setQuery(e.target.value)}
            placeholder="検索文字列を入力..."
            className="w-full p-2 border dark:bg-gray-800"
          />
        </div>
        <SearchOption val={searchType} set={setSearchType} />
        <button
          type="submit"
          className="md:w-auto px-4 py-2 border bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "検索中..." : "検索"}
        </button>
      </div>
      {/* {error && ( */}
      {/*   <div className="mt-2 text-red-600 dark:text-red-400">{error}</div> */}
      {/* )} */}
    </Form>
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
