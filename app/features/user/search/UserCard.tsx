import { Baseline, LibraryBig, List } from "lucide-react";
import { Link } from "react-router";
import StatViewItem from "~/shared/components/stats/StatViewItem";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/shared/components/ui/card";
import type {
  UserAchievement,
  UserSearchRow,
} from "~/shared/generated/fastAPI.schemas";
import UserAvatar from "../UserAvatar";

type Props = {
  row: UserSearchRow;
};

export function UserCard({ row }: Props) {
  const { user, archivement } = row;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <UserAvatar user={user} />
          <div className="flex items-baseline space-x-2">
            <Link
              to={`/user/${user.username || user.uid}`}
              className="font-semibold text-lg hover:underline"
            >
              {user.display_name || user.username}
            </Link>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {user.profile}
        </p>
      </CardContent>
      <UserCardFooter stats={archivement} />
    </Card>
  );
}

function UserCardFooter({ stats }: { stats: UserAchievement }) {
  const statItems = createStatView(stats);
  return (
    <CardFooter className="flex space-x-4 text-sm text-muted-foreground">
      <div className="flex flex-wrap items-center gap-x-3">{statItems}</div>
    </CardFooter>
  );
}

function createStatView(stats: UserAchievement) {
  const items = {
    n_char: { Icon: Baseline, label: "文字数", value: stats.n_char },
    n_sentence: { Icon: List, label: "単文数", value: stats.n_sentence },
    n_resource: {
      Icon: LibraryBig,
      label: "リソース数",
      value: stats.n_resource,
    },
  };

  return Object.values(items).map((item) => (
    <StatViewItem
      key={item.label}
      Icon={item.Icon}
      label={item.label}
      value={item.value}
    />
  ));
}
