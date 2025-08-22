import { File, Lightbulb, Search, User } from "lucide-react";
import { Link } from "react-router";
import { cn } from "../lib/utils";
import { useHistory } from "./hooks";
import type { HistoryItemType } from "./types";

const historyTypes = ["user", "knowde", "resource", "search"] as const;
type HistoryType = (typeof historyTypes)[number];

type Style = {
  Icon: React.ComponentType | undefined;
  color: string;
};

const historyTypeStyles: Record<HistoryType, Style> = {
  user: {
    Icon: User,
    color: "text-purple-500",
  },
  knowde: {
    Icon: Lightbulb,
    color: "text-blue-500",
  },
  resource: {
    Icon: File,
    color: "text-amber-700", // brownに近い色
  },
  search: {
    Icon: Search,
    color: "text-cyan-500",
  },
};
export function getHistoryTypeStyleByInclusion(str: string): Style {
  for (const keyword of historyTypes) {
    if (str.includes(keyword)) {
      return historyTypeStyles[keyword];
    }
  }

  return { Icon: undefined, color: "text-muted-foreground" };
}

function HistoryItem({ history }: { history: HistoryItemType }) {
  const { Icon, color } = getHistoryTypeStyleByInclusion(history.url);
  return (
    <li className={cn("flex hover:bg-muted rounded-md truncate", color)}>
      {Icon && <Icon />}
      <Link to={history.url}>{history.title}</Link>
    </li>
  );
}

type Props = {
  histories: readonly HistoryItemType[];
};

export function HistoryList({ histories }: Props) {
  if (histories && histories.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">履歴なし</p>
    );
  }
  return (
    <ul>
      {histories.map((history) => (
        <HistoryItem key={history.id} history={history} />
      ))}
    </ul>
  );
}

export default function History() {
  const { histories } = useHistory();
  return <HistoryList histories={histories} />;
}
