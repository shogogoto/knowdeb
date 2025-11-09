import { ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import type { UserActivity } from "~/shared/generated/fastAPI.schemas";
import { cn } from "~/shared/lib/utils";

type ActivityStatProps = {
  label: string;
  latest?: number;
  current: number;
};

function ActivityStat({ label, latest, current }: ActivityStatProps) {
  const diff = current - (latest ?? 0);
  const sign = diff > 0 ? "+" : "";

  let textColorClass = "text-gray-500"; // ゼロの場合のデフォルト
  if (diff > 0) {
    textColorClass = "text-red-500"; // 正の場合
  } else if (diff < 0) {
    textColorClass = "text-blue-500"; // 負の場合
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={cn("text-2xl font-bold", textColorClass)}>
        {sign}
        {diff}
      </div>
      <div className="text-xs text-muted-foreground">{latest}</div>
    </div>
  );
}

function ActivityTitle({
  start,
  end,
  isOpen,
}: { start: string | undefined; end: string; isOpen?: boolean }) {
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const startDate = formatDate(start);
  const endDate = formatDate(end);

  const calcDays = (start: string | undefined, end: string) => {
    if (!start) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const days = calcDays(start, end);

  return (
    <CardTitle className="flex flex-col items-center w-full">
      <div className="flex items-center justify-center relative w-full">
        <p>{days}日間の活動量</p>
        <ChevronDown
          className={cn(
            "absolute right-0 h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        {startDate} ~ {endDate}
      </p>
    </CardTitle>
  );
}

type Props = {
  activity: UserActivity;
  isOpen?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function ActivityBoard({ activity, isOpen, ...props }: Props) {
  const { current, latest } = activity;
  return (
    <Card
      className="bg-transparent shadow-none border-none cursor-pointer hover:bg-accent"
      {...props}
    >
      <CardHeader>
        <ActivityTitle
          start={latest?.created}
          end={current.created}
          isOpen={isOpen}
        />
      </CardHeader>
      <CardContent>
        {current ? (
          <div className="flex justify-around space-x-4">
            <ActivityStat
              label="文字数"
              latest={latest?.n_char}
              current={current.n_char}
            />
            <ActivityStat
              label="単文数"
              latest={latest?.n_sentence}
              current={current.n_sentence}
            />
            <ActivityStat
              label="リソース数"
              latest={latest?.n_resource}
              current={current.n_resource}
            />
          </div>
        ) : (
          <p>アクティビティデータがありません。</p>
        )}
      </CardContent>
    </Card>
  );
}
