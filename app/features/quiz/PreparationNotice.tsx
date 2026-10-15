import type { QuizPreparationState } from "./api";

export const preparationLabels = {
  idle: "準備待ち",
  queued: "準備待ち",
  running: "クイズ準備中",
  ready: "準備完了",
  failed: "クイズの準備に失敗しました",
  exhausted: "作成できるクイズが不足しています",
};

export default function PreparationNotice({
  preparation,
}: { preparation?: QuizPreparationState }) {
  if (!preparation || ["idle", "ready"].includes(preparation.status))
    return null;
  return (
    <output
      className={`text-xs ${preparation.status === "failed" ? "text-destructive" : "text-muted-foreground"}`}
    >
      <span className="block">{preparationLabels[preparation.status]}</span>
      {preparation.error && <span className="block">{preparation.error}</span>}
    </output>
  );
}
