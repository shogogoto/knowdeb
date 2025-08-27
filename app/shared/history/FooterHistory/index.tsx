import { History } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/shared/components/ui/dialog";
import { HistoryList } from "~/shared/history";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, []);

  if (!isMobile) {
    return null;
  }

  return (
    <div className="flex">
      <div className="container flex items-center h-full max-w-screen-2xl">
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex-shrink-0 px-2 cursor-pointer">
              <History size="1.25em" className="text-muted-foreground" />
            </div>
          </DialogTrigger>
          <DialogContent className="w-80">
            <HistoryList histories={histories} />
          </DialogContent>
        </Dialog>

        <div
          ref={scrollContainerRef}
          className="flex-1 w-0 overflow-x-auto whitespace-nowrap no-scrollbar"
        >
          {histories.map((item) => (
            <Link
              key={item.id}
              to={item.url}
              className="inline-flex items-center text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              <HistoryItemIcon url={item.url} className="flex-shrink-0" />
              <span className="truncate">
                {item.title.length > 2
                  ? `${item.title.substring(0, 3)}`
                  : item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
