import { LoaderCircle, Search, Settings } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Form, useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useDebounce } from "~/hooks/useDebounce";
import SearchContext from "../SearchContext";
import SearchConfig from "./SearchConfig";

export default function SearchBar() {
  const navigation = useNavigation();
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

  return (
    <Form className="container mx-auto">
      <div className="container mx-auto p-2">
        <Popover>
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
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isLoading}
              >
                <Settings />
              </Button>
            </PopoverTrigger>
          </div>
          <PopoverContent className="w-full">
            <SearchConfig />
          </PopoverContent>
        </Popover>
      </div>
    </Form>
  );
}
