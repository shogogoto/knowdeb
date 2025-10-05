import { LoaderCircle, Search, Settings } from "lucide-react";
import { Button } from "~/shared/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/shared/components/ui/collapsible";
import { Input } from "~/shared/components/ui/input";

type Props = {
  isLoading?: boolean;
  q: string;
  setQ: (s: string) => void;
} & React.PropsWithChildren;

export default function SearchBar({ isLoading, q, setQ, children }: Props) {
  return (
    <div className="container mx-auto">
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
                value={q}
                name="q" // このname属性はもう機能しません
                onChange={(ev) => {
                  setQ(ev.target.value);
                }}
                placeholder="検索文字列を入力..."
                className="w-full border dark:bg-gray-800 pl-10"
              />
            </div>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Settings"
              >
                <Settings />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="w-full">{children}</CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
