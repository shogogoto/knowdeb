import { LoaderCircle, Search, Settings } from "lucide-react";
import { useContext } from "react";
import { Form, useNavigation } from "react-router";
import { Button } from "~/shared/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/shared/components/ui/collapsible";
import { Input } from "~/shared/components/ui/input";
import SearchContext from "../SearchContext";
import SearchConfig from "./SearchConfig";

export default function SearchBar() {
  const navigation = useNavigation();
  const { immediateQ, setImmediateQ } = useContext(SearchContext);

  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <Form className="container mx-auto">
      <div className="container mx-auto p-2">
        <Collapsible>
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
                value={immediateQ}
                name="q"
                onChange={(ev) => {
                  setImmediateQ(ev.target.value);
                }}
                placeholder="検索文字列を入力..."
                className="w-full border dark:bg-gray-800 pl-10"
                //disabled={isLoading}
              />
            </div>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                //disabled={isLoading}
              >
                <Settings />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="w-full">
            <SearchConfig />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Form>
  );
}
