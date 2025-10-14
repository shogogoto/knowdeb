import { ScrollArea } from "~/shared/components/ui/scroll-area";
import History from "~/shared/history";
import { useHistory } from "~/shared/history/hooks";

export function HistoryAside() {
  const { histories } = useHistory();
  const count = histories.length;

  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-[320px] border-l p-4 hidden sm:block">
      <p>履歴 {count}</p>
      <ScrollArea className="h-full w-full">
        <History />
      </ScrollArea>
    </aside>
  );
}
