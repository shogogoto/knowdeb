import {
  Baseline,
  BookUser,
  BrainCircuit,
  Calendar,
  GitFork,
  List,
  TextInitial,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import UserAvatar from "~/features/user/UserAvatar";
import StatViewItem from "~/shared/components/stats/StatViewItem";
import { Card, CardContent, CardFooter } from "~/shared/components/ui/card";
import type {
  ResourceInfo,
  ResourceStats,
} from "~/shared/generated/fastAPI.schemas";
import { cn } from "~/shared/lib/utils";

type Props = {
  info: ResourceInfo;
  className?: string;
};

export default function ResourceCard({ info, className }: Props) {
  const { resource } = info;

  return (
    <Link to={`/resource/${resource.uid}`} draggable={false} className="block">
      <Card className={cn("w-full max-w-3xl hover:bg-muted/40", className)}>
        <ResourceCardContent info={info} />
        <ResourceCardFooter stats={info.resource_stats} />
      </Card>
    </Link>
  );
}

function ResourceCardContent({ info }: Props) {
  const { user, resource } = info;
  return (
    <CardContent className="grid gap-2">
      <h3 className="font-bold text-lg">{resource.name}</h3>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <UserAvatar user={user} className="size-5" />
        <span>{user.display_name || user.username}</span>
      </div>
      {resource.authors && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookUser className="size-4" />
          <span>{resource.authors.join(", ")}</span>
        </div>
      )}
      {resource.published && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4" />
          <span>
            Published: {new Date(resource.published).toLocaleDateString()}
          </span>
        </div>
      )}
      {resource.updated && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4" />
          <span>
            Updated: {new Date(resource.updated).toLocaleDateString()}
          </span>
        </div>
      )}
    </CardContent>
  );
}

function ResourceCardFooter({ stats }: { stats: ResourceStats }) {
  const statItems = createStatView(stats);
  return (
    <CardFooter>
      <div className="flex flex-wrap items-center gap-x-3">{statItems}</div>
    </CardFooter>
  );
}

function createStatView(stats: ResourceStats) {
  const items = {
    n_char: { Icon: Baseline, label: "文字数", value: stats.n_char },
    n_sentence: { Icon: List, label: "単文数", value: stats.n_sentence },
    n_term: { Icon: TextInitial, label: "用語数", value: stats.n_term },
    n_edge: { Icon: GitFork, label: "関係数", value: stats.n_edge },
    avg_deg: {
      Icon: Users,
      label: "平均次数",
      value: stats.average_degree.toFixed(2),
    },
    density: {
      Icon: BrainCircuit,
      label: "密度",
      value:
        stats.density != null
          ? `${(stats.density * 100).toFixed(1)}%`
          : undefined,
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
