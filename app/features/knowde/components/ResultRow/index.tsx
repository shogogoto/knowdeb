import {
  ArrowDownToDot,
  ArrowUpFromDot,
  Award,
  BookText,
  ChevronsDown,
  ChevronsUp,
  GitFork,
  GitPullRequest,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { KnowdeWithStats } from "~/generated/fastAPI.schemas";

type Props = {
  row: KnowdeWithStats;
  index: number;
  isOpen?: boolean;
};

export default function ResultRow({ row, index }: Props) {
  const stats = [
    { Icon: Award, label: "スコア", value: row.stats?.score },
    { Icon: BookText, label: "詳細数", value: row.stats?.n_detail },
    { Icon: ChevronsUp, label: "前提数", value: row.stats?.n_premise },
    { Icon: ChevronsDown, label: "結論数", value: row.stats?.n_conclusion },
    { Icon: GitFork, label: "参照数", value: row.stats?.n_refer },
    { Icon: GitPullRequest, label: "被参照数", value: row.stats?.n_referred },
    { Icon: ArrowUpFromDot, label: "前提距離", value: row.stats?.dist_axiom },
    { Icon: ArrowDownToDot, label: "結論距離", value: row.stats?.dist_leaf },
  ];

  return (
    <div
      key={row.knowde.uid}
      className="flex flex-col gap-2 p-4 border border-gray-200 rounded-md dark:border-gray-700"
    >
      <div className="flex items-start gap-2">
        <div className="font-semibold">
          <span>#{index}</span>
        </div>

        <DefCard kn={row} />
        <div className="ml-auto">
          <div className="border">{row.knowde.when}</div>
        </div>
      </div>

      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center">
          {stats.map(
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
      </TooltipProvider>
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

function DefCard({ kn }: { kn: KnowdeWithStats }) {
  const k = kn.knowde;
  return (
    <div className="break-all">
      <Link to={`/knowde/${k.uid}`} className="hover:underline">
        {k.term?.names && (
          <span className="font-semibold text-green-700 dark:text-green-600">
            {k.term.names.join(", ")}:&nbsp;
          </span>
        )}
        {k.sentence}
      </Link>
    </div>
  );
}
