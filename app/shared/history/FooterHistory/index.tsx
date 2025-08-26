import { History } from "lucide-react";
import { Link } from "react-router";
import HybridTooltip from "~/shared/components/HybridTooltip";
import { HistoryItemIcon } from "~/shared/history/HistoryItemIcon";
import { useHistory } from "~/shared/history/hooks";
import type { HistoryItemType } from "~/shared/history/types";
import { useIsMobile } from "~/shared/hooks/use-mobile";

type Props = {
  histories?: readonly HistoryItemType[];
};

export function FooterHistory({ histories: initialHistories }: Props) {
  const isMobile = useIsMobile();
  const { histories: historiesFromHook } = useHistory();
  const histories = initialHistories ?? historiesFromHook;

  if (!isMobile) {
    return null;
  }

  return (
    <div className="flex">
      <div className="container flex items-center h-full max-w-screen-2xl">
        <HybridTooltip content="履歴">
          <div className="flex-shrink-0 px-2">
            <History size="1.25em" className="text-muted-foreground" />
          </div>
        </HybridTooltip>
        <div className="flex-1 w-0 overflow-x-auto whitespace-nowrap no-scrollbar">
          {histories.map((item) => (
            <Link
              key={item.id}
              to={item.url}
              className="inline-flex items-center py-1 mx-1 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              <HistoryItemIcon url={item.url} className="mr-1 flex-shrink-0" />
              <span className="truncate">
                {item.title.length > 2
                  ? `${item.title.substring(0, 2)}...`
                  : item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
