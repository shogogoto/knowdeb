import { Book, FileText, History, Search, User } from "lucide-react";
import { Link } from "react-router";
import { useHighlightByHash, useHistory } from "~/features/history/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import { ScrollArea } from "~/shared/components/ui/scroll-area";
import { cn } from "~/shared/lib/utils";
import type { HistoryType } from "../types";
import { formatRelativeTime } from "../utils";

const historyTypeStyles: Record<
  HistoryType,
  {
    icon: React.ElementType;
    color: string;
  }
> = {
  user: {
    icon: User,
    color: "text-purple-500",
  },
  knowde: {
    icon: Book,
    color: "text-blue-500",
  },
  resource: {
    icon: FileText,
    color: "text-amber-700", // brownに近い色
  },
  search: {
    icon: Search,
    color: "text-cyan-500",
  },
};

export function HistoryList() {
  const { histories } = useHistory();
  useHighlightByHash();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History size={20} />
          <span>閲覧履歴</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!histories || histories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            閲覧履歴はありません。
          </p>
        ) : (
          <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
            <div className="space-y-4">
              {histories.map((item) => {
                const style = historyTypeStyles[item.type];
                const Icon = style.icon;
                return (
                  <Link
                    key={item.id}
                    id={`history-${item.id}`}
                    to={`${item.url}#history-${item.id}`}
                    className="block p-2 -m-2 rounded-md hover:bg-accent"
                  >
                    <div className="flex items-center gap-4">
                      <Icon
                        className={cn("h-5 w-5 flex-shrink-0", style.color)}
                      />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium leading-none truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(item.timestamp)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
