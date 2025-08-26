import { Link } from "react-router";
import { HistoryItemIcon } from "./HistoryItemIcon";
import { useHistory } from "./hooks";
import type { HistoryItemType } from "./types";

function HistoryItem({ history }: { history: HistoryItemType }) {
  return (
    <li className="flex items-center hover:bg-muted rounded-md">
      <HistoryItemIcon url={history.url} className="mr-2" />
      <Link to={history.url} className="truncate flex-1">
        {history.title}
      </Link>
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
