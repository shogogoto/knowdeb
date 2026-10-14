import { Crown } from "lucide-react";
import { canonicalSentenceId } from "~/features/tanbun/detail/cache";
import { Button } from "~/shared/components/ui/button";
import type { GameSave } from "./domain";
import { dungeonMap } from "./exploration";

export default function BossPanel({
  save,
  busy,
  error,
  onChallenge,
}: {
  save: GameSave;
  busy: boolean;
  error?: string;
  onChallenge: (level: number) => void;
}) {
  const run = save.run;
  if (!run) return <p>ダンジョンに入るとボスに挑戦できます。</p>;
  const achievement = Math.floor(dungeonMap(save, run).places.length / 5);
  const clears = save.bossClears?.[canonicalSentenceId(run.resourceId)] ?? [];
  const canFight =
    !busy &&
    !save.battleFeedback &&
    run.hp > 0 &&
    run.moves < 5 &&
    (run.phase === "path" || run.phase === "cleared");
  return (
    <div className="space-y-3">
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        {run.name} · 達成度 {achievement}
      </p>
      {[5, 10, 15, 20].map((level) => (
        <div
          key={level}
          className="flex items-center gap-3 rounded-lg border p-3"
        >
          <Crown className="size-6 shrink-0 text-amber-400" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">達成度 {level}のボス</p>
            <p className="text-xs text-muted-foreground">
              {clears.includes(level)
                ? "撃破済み"
                : achievement >= level
                  ? "撃破で専門分野を開放"
                  : `達成度 ${level}で挑戦可能`}
            </p>
          </div>
          <Button
            variant="outline"
            disabled={!canFight || achievement < level}
            onClick={() => onChallenge(level)}
          >
            {clears.includes(level) ? "再挑戦 · 1歩" : "挑戦 · 1歩"}
          </Button>
        </div>
      ))}
      {!canFight && (
        <p className="text-sm text-muted-foreground">
          戦闘を終え、HPと歩数がある状態で挑戦してください。
        </p>
      )}
    </div>
  );
}
