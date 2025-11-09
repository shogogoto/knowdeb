import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import type {
  UserAchievement,
  UserActivity,
} from "~/shared/generated/fastAPI.schemas";
import { cn } from "~/shared/lib/utils";

type ActivityStatProps = {
  label: string;
  value: number;
  total: number;
  colorClass: string;
};

function ActivityStat({ label, value, total, colorClass }: ActivityStatProps) {
  const sign = value > 0 ? "+" : "";
  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={cn("text-2xl font-bold", colorClass)}>
        {sign}
        {value}
      </div>
      <div className="text-xs text-muted-foreground">合計: {total}</div>
    </div>
  );
}

type Props = {
  activity: UserActivity;
};

export default function ActivityBoard({ activity }: Props) {
  const { current, latest } = activity;
  const weeklyActivity: UserAchievement = {
    n_char: current.n_char - (latest?.n_char ?? 0),
    n_sentence: current.n_sentence - (latest?.n_sentence ?? 0),
    n_resource: current.n_resource - (latest?.n_resource ?? 0),
    created: current.created, // createdはcurrentのものをそのまま使う
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>今週の活動量</CardTitle>
      </CardHeader>
      <CardContent>
        {current ? (
          <div className="flex justify-around space-x-4">
            <ActivityStat
              label="文字数"
              value={weeklyActivity.n_char}
              total={current.n_char}
              colorClass="text-blue-500"
            />
            <ActivityStat
              label="文章数"
              value={weeklyActivity.n_sentence}
              total={current.n_sentence}
              colorClass="text-green-500"
            />
            <ActivityStat
              label="リソース数"
              value={weeklyActivity.n_resource}
              total={current.n_resource}
              colorClass="text-purple-500"
            />
          </div>
        ) : (
          <p>アクティビティデータがありません。</p>
        )}
      </CardContent>
    </Card>
  );
}
