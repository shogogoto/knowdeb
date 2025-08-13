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
import HybridTooltip from "~/components/HybridTooltip";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { TooltipProvider } from "~/components/ui/tooltip";
import type {
  KStats,
  Knowde,
  KnowdeAdditional,
  MResource,
} from "~/generated/fastAPI.schemas";
import { cn } from "~/lib/utils";
import { Highlight } from "../Highlight";

type Props = {
  k: Knowde;
  index?: number;
  query?: string;
};

export default function KnowdeCard({ k, index, query }: Props) {
  const score = k.stats?.score || 0;

  const card = (
    <Card key={k.uid} className="w-full max-w-3xl">
      <KnowdeCardContent k={k} query={query} />
      <KnowdeCardFooter k={k} index={index} />
    </Card>
  );

  if (score === 0) {
    return card;
  }
  return (
    <Link
      to={`/knowde/${k.uid}`}
      draggable={false} // テキストをコピペできるため
    >
      {card}
    </Link>
  );
}

type KProps = {
  k: Knowde;
  className?: string;
  resource?: MResource;
  query?: string;
};

export function KnowdeCardContent({ k, className, resource, query }: KProps) {
  return (
    <CardContent>
      <div className="flex flex-wrap items-start gap-2">
        {k.term?.names?.map((name) => (
          <span
            key={name}
            className={cn(
              "rounded-full font-bold text-green-800  dark:text-green-500",
              className,
            )}
          >
            <Highlight text={name} query={query ?? ""} />
          </span>
        ))}
      </div>
      {k.sentence !== "<<<not defined>>>" && (
        <span className="break-all">
          <Highlight text={k.sentence} query={query ?? ""} />
        </span>
      )}
      <div className="flex flex-wrap items-center gap-x-4 mt-4 text-sm text-muted-foreground">
        {resource && (
          <div className="text-sm text-muted-foreground space-x-2">
            <Link to={`/resource/${resource.uid}`} className="hover:underline">
              {resource.name}
            </Link>
            {/* <span>{resource?.authors}</span> */}
            {/* <span>{resource?.published}</span> */}
          </div>
        )}
        <AdditionalItem additional={k.additional} />
      </div>
    </CardContent>
  );
}

export function KnowdeCardFooter({ k, index }: KProps & { index?: number }) {
  return (
    <CardFooter className="flex justify-between">
      <TooltipProvider>
        <StatView stats={k.stats} />
      </TooltipProvider>
      {index !== undefined && <Badge>#{index}</Badge>}
    </CardFooter>
  );
}

function StatView({
  stats,
  collapsible,
}: { stats: KStats | undefined; collapsible?: boolean }) {
  const score_it = { Icon: Award, label: "スコア", value: stats?.score || 0 };

  const items = [
    { Icon: BookText, label: "詳細数", value: stats?.n_detail },
    { Icon: ChevronsUp, label: "前提数", value: stats?.n_premise },
    { Icon: ChevronsDown, label: "結論数", value: stats?.n_conclusion },
    { Icon: GitFork, label: "参照数", value: stats?.n_refer },
    { Icon: GitPullRequest, label: "被参照数", value: stats?.n_referred },
    { Icon: ArrowUpFromDot, label: "前提距離", value: stats?.dist_axiom },
    { Icon: ArrowDownToDot, label: "結論距離", value: stats?.dist_leaf },
  ];

  const score_c = <StatItem {...score_it} />;
  const items_c = items.map(
    (stat) =>
      stat.value != null && (
        <StatItem
          key={stat.label}
          Icon={stat.Icon}
          label={stat.label}
          value={stat.value}
        />
      ),
  );
  const className = "flex flex-wrap items-center gap-x-2";
  if (collapsible)
    return (
      <Collapsible>
        <div className={className}>
          <CollapsibleTrigger>{score_c}</CollapsibleTrigger>
          <CollapsibleContent className={className}>
            {items_c}
          </CollapsibleContent>
        </div>
      </Collapsible>
    );

  return (
    <div className={className}>
      {score_c}
      {items_c}
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
    <HybridTooltip content={label}>
      <div className="flex items-center gap-1">
        <Icon className="size-4 cursor-pointer text-muted-foreground" />
        <div className="font-mono text-sm text-right">{value}</div>
      </div>
    </HybridTooltip>
  );
}

function AdditionalItem({
  additional,
}: { additional: KnowdeAdditional | undefined }) {
  if (!additional) {
    return null;
  }
  return (
    <>
      {additional.when && (
        <span className="flex items-center">
          <Calendar className="size-4" />
          {additional.when}
        </span>
      )}
      {additional.where && (
        <span className="flex items-center">
          <MapPin className="size-4" />
          {additional.where}
        </span>
      )}
      {additional.by && (
        <span className="flex items-center">
          <User className="size-4" />
          {additional.by}
        </span>
      )}
    </>
  );
}
