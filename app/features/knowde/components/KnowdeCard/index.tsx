import {
  ArrowDownToDot,
  ArrowUpFromDot,
  Award,
  BookText,
  Calendar,
  ChevronsDown,
  ChevronsUp,
  GitFork,
  GitPullRequest,
  MapPin,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { KStats, KnowdeWithStats } from "~/generated/fastAPI.schemas";

type Props = {
  row: KnowdeWithStats;
  index: number;
  isOpen?: boolean;
};

export default function KnowdeCard({ row, index }: Props) {
  const k = row.knowde;
  return (
    <Card key={k.uid} className="w-full max-w-2xl">
      {k.term && (
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle>{k.term?.names?.join(", ")}</CardTitle>
          </div>
        </CardHeader>
      )}
      {k.sentence !== "<<<not defined>>>" && (
        <CardContent>
          <p className="break-all">{k.sentence}</p>
          {(k.when || k.where || k.by) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-sm text-muted-foreground">
              {k.when && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  {k.when}
                </span>
              )}
              {k.where && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {k.where}
                </span>
              )}
              {k.by && (
                <span className="flex items-center gap-1">
                  <User className="size-4" />
                  {k.by}
                </span>
              )}
            </div>
          )}
        </CardContent>
      )}
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <StatView stats={row.stats} />
        </TooltipProvider>
        <Link
          to={`/knowde/${k.uid}`}
          className="text-sm text-muted-foreground underline hover:text-blue-600 hover:decoration-blue-600"
        >
          #{index}
        </Link>
      </CardFooter>
    </Card>
  );
}

function StatView({ stats }: { stats: KStats | undefined }) {
  const items = [
    { Icon: Award, label: "スコア", value: stats?.score },
    { Icon: BookText, label: "詳細数", value: stats?.n_detail },
    { Icon: ChevronsUp, label: "前提数", value: stats?.n_premise },
    { Icon: ChevronsDown, label: "結論数", value: stats?.n_conclusion },
    { Icon: GitFork, label: "参照数", value: stats?.n_refer },
    { Icon: GitPullRequest, label: "被参照数", value: stats?.n_referred },
    { Icon: ArrowUpFromDot, label: "前提距離", value: stats?.dist_axiom },
    { Icon: ArrowDownToDot, label: "結論距離", value: stats?.dist_leaf },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {items.map(
        (stat) =>
          stat.value != null && (
            <StatItem
              key={stat.label}
              Icon={stat.Icon}
              label={stat.label}
              value={stat.value}
            />
          ),
      )}
    </div>
  );
}

function StatItem({
  Icon,
  label,
  value,
}: {
  Icon: LucideIcon;
  label: string;
  value: number | undefined;
}) {
  return (
    <Tooltip>
      <div className="flex items-center gap-1">
        <TooltipTrigger asChild>
          <Icon className="size-4 cursor-pointer text-muted-foreground" />
        </TooltipTrigger>
        <div className="font-mono text-sm text-right">{value}</div>
      </div>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
