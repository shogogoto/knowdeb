import { LoaderCircle, Search, Settings } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Form, useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useDebounce } from "~/hooks/useDebounce";
import SearchContext from "../SearchContext";
import SearchConfig from "./SearchConfig";

export default function SearchBar() {
  const navigation = useNavigation();
  const [isShown, setShown] = useState(false);
  const { q, setQ } = useContext(SearchContext);

  // Local state for the input to make typing responsive.
  const [inputValue, setInputValue] = useState(q);
  // Debounce the local input value.
  const debouncedInputValue = useDebounce(inputValue, 300);

  // Only update the global SearchContext when the debounced value changes.
  useEffect(() => {
    setQ(debouncedInputValue);
  }, [debouncedInputValue, setQ]);

  // Sync from global context to local state if q changes externally.
  useEffect(() => {
    setInputValue(q);
  }, [q]);

  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";
  const toggleShow = () => setShown(!isShown);

  return (
    <Form action="/search" method="get" className="container mx-auto p-4">
      <div className="container mx-auto p-4">
        <div className="flex w-full items-center gap-2">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {isLoading ? (
                <LoaderCircle className="animate-spin text-muted-foreground" />
              ) : (
                <Search className="text-muted-foreground" />
              )}
            </div>
            <Input
              type="search"
              value={inputValue}
              name="q"
              onChange={(ev) => {
                setInputValue(ev.target.value);
              }}
              placeholder="検索文字列を入力..."
              className="w-full border dark:bg-gray-800 pl-10"
              disabled={isLoading}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleShow}
            disabled={isLoading}
          >
            <Settings />
          </Button>
        </div>
        {isShown && <SearchConfig />}
      </div>
    </Form>
  );
}
