import { Link } from "react-router";
import useSWR from "swr";
import { Button } from "~/shared/components/ui/button";
import { gameRequest } from "./battle";

type Progress = { done: number; total: number; claimed: boolean };

export default function ReviewRewards({ userId }: { userId: string }) {
  const { data, error, isLoading } = useSWR(
    ["game-shop", userId],
    () => gameRequest<{ review: Progress; quiz_review?: Progress }>("shop"),
    { revalidateOnFocus: true },
  );
  return (
    <div className="space-y-3 text-sm">
      {error && <p role="alert">復習の進捗を取得できませんでした。</p>}
      <div className="space-y-1">
        <p className="font-medium">今日の見たよ → 歩数回復薬 ×1</p>
        <p className="text-muted-foreground">
          {isLoading
            ? "読み込み中…"
            : data?.review.claimed
              ? "今日の報酬は受け取り済み"
              : data?.review.total
                ? `${data.review.done} / ${data.review.total}`
                : "「今日」の復習を始めると対象が決まります。"}
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/review?preset=default">復習へ</Link>
        </Button>
      </div>
      <div className="space-y-1">
        <p className="font-medium">今日の復習クイズ20問 → 歩数回復薬 ×1</p>
        <p className="text-muted-foreground">
          {isLoading
            ? "読み込み中…"
            : data?.quiz_review?.claimed
              ? "今日の報酬は受け取り済み"
              : `${Math.min(20, data?.quiz_review?.done ?? 0)} / 20`}
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/review?view=quiz&preset=default">クイズを解く</Link>
        </Button>
      </div>
    </div>
  );
}
