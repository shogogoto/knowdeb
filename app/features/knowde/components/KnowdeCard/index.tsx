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
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type {
  KStats,
  Knowde,
  KnowdeAdditional,
} from "~/generated/fastAPI.schemas";
import { cn } from "~/lib/utils";

type Props = {
  row: Knowde;
  index?: number;
};

export default function KnowdeCard({ row, index }: Props) {
  const k = row;
  return (
    <Card key={k.uid} className="w-full max-w-2xl">
      <KnowdeCardContent k={k} />
      <KnowdeCardFooter k={k} index={index} />
    </Card>
  );
}

type KProps = { k: Knowde; className?: string };

export function KnowdeCardContent({ k, className }: KProps) {
  return (
    <CardContent>
      <div className="flex items-start gap-2">
        {k.term?.names?.map((name) => (
          <span
            key={name}
            className={cn(
              "inline-block rounded-full font-bold text-green-800  dark:text-green-300",
              className,
            )}
          >
            {name}
          </span>
        ))}
      </div>

      {k.sentence !== "<<<not defined>>>" && (
        <span className="break-all">{k.sentence}</span>
      )}
      <AdditionalItem additional={k.additional} />
    </CardContent>
  );
}

export function KnowdeCardFooter({
  k,
  index,
  className,
}: KProps & { index?: number }) {
  return (
    <CardFooter className="flex justify-between">
      <TooltipProvider>
        <StatView stats={k.stats} />
      </TooltipProvider>
      {index !== undefined && (
        <Badge asChild>
          <Link
            to={`/knowde/${k.uid}`}
            className={cn(
              "text-sm underline hover:text-blue-600 hover:decoration-blue-600",
              className,
            )}
          >
            #{index}
          </Link>
        </Badge>
      )}
    </CardFooter>
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

function AdditionalItem({
  additional,
}: { additional: KnowdeAdditional | undefined }) {
  if (!additional) {
    return null;
  }
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-sm text-muted-foreground">
      {additional.when && (
        <span className="flex items-center gap-1">
          <Calendar className="size-4" />
          {additional.when}
        </span>
      )}
      {additional.where && (
        <span className="flex items-center gap-1">
          <MapPin className="size-4" />
          {additional.where}
        </span>
      )}
      {additional.by && (
        <span className="flex items-center gap-1">
          <User className="size-4" />
          {additional.by}
        </span>
      )}
    </div>
  );
}
