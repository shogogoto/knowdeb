import {
  Baseline,
  Book,
  BrainCircuit,
  Calendar,
  FileText,
  GitFork,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import UserAvatar from "~/features/user/UserAvatar";
import HybridTooltip from "~/shared/components/HybridTooltip";
import { Card, CardContent, CardFooter } from "~/shared/components/ui/card";
import { TooltipProvider } from "~/shared/components/ui/tooltip";
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
  return (
    <CardFooter>
      <TooltipProvider>
        <ResourceStatViews stats={stats} />
      </TooltipProvider>
    </CardFooter>
  );
}

function StatViewItem({
  Icon,
  label,
  value,
  mobileDisabled,
}: {
  Icon: LucideIcon;
  label: string;
  value: number | string | undefined;
  mobileDisabled?: boolean;
}) {
  return (
    <HybridTooltip content={label} mobileDisabled={mobileDisabled}>
      <div className="flex items-center gap-1">
        <Icon className="size-4 cursor-pointer text-muted-foreground" />
        <div className="font-mono text-sm text-right">{value}</div>
      </div>
    </HybridTooltip>
  );
}

function createResourceStatView(
  stats: ResourceStats,
  mobileDisabled?: boolean,
) {
  const f = (stat: {
    Icon: LucideIcon;
    label: string;
    value?: number | string;
  }) =>
    stat.value != null &&
    stat.value !== 0 && (
      <StatViewItem
        key={stat.label}
        Icon={stat.Icon}
        label={stat.label}
        value={stat.value}
        mobileDisabled={mobileDisabled}
      />
    );

  const items = {
    n_char: { Icon: FileText, label: "文字数", value: stats.n_char },
    n_sentence: { Icon: Baseline, label: "文章数", value: stats.n_sentence },
    n_term: { Icon: Book, label: "用語数", value: stats.n_term },
    n_edge: { Icon: GitFork, label: "関係数", value: stats.n_edge },
    avg_deg: {
      Icon: Users,
      label: "平均次数",
      value: stats.average_degree.toFixed(2),
    },
    density: {
      Icon: BrainCircuit,
      label: "密度",
      value: stats.density?.toFixed(3),
    },
  };

  return Object.values(items).map(f);
}

function ResourceStatViews({ stats }: { stats: ResourceStats }) {
  const statItems = createResourceStatView(stats);
  return <div className="flex flex-wrap items-center gap-x-3">{statItems}</div>;
}
