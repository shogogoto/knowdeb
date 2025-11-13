import { LayoutGrid, List } from "lucide-react";
import type { Dispatch } from "react";
import { Button } from "~/shared/components/ui/button";

export type ViewMode = "list" | "tile";

type Props = {
  mode: ViewMode;
  setMode: Dispatch<ViewMode>;
};

export default function ViewSwitcher({ mode, setMode }: Props) {
  return (
    <>
      <Button
        onClick={() => setMode("list")}
        variant={mode === "list" ? "secondary" : "ghost"}
        size="icon"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => setMode("tile")}
        variant={mode === "tile" ? "secondary" : "ghost"}
        size="icon"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </>
  );
}
