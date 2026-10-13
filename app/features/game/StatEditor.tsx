import { Heart, Minus, Plus, Shield, Swords, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/shared/components/ui/button";
import {
  type Allocation,
  type GameBalance,
  emptyAllocation,
  gameRequest,
  playerStats,
} from "./battle";
import type { GameState } from "./state";

const statDefinitions = [
  {
    key: "hp",
    label: "最大HP",
    Icon: Heart,
    value: (stats: ReturnType<typeof playerStats>) => stats.maxHp,
    increase: (balance: GameBalance) => balance.hp_per_point,
  },
  {
    key: "attack",
    label: "攻撃力",
    Icon: Swords,
    value: (stats: ReturnType<typeof playerStats>) => stats.attack,
    increase: (balance: GameBalance) => balance.attack_per_point,
  },
  {
    key: "defense",
    label: "守備力",
    Icon: Shield,
    value: (stats: ReturnType<typeof playerStats>) => stats.defense,
    increase: (balance: GameBalance) => balance.defense_per_point,
  },
  {
    key: "seconds",
    label: "持ち時間",
    Icon: Timer,
    value: (stats: ReturnType<typeof playerStats>) => stats.answerSeconds,
    increase: (balance: GameBalance) => balance.seconds_per_point,
    suffix: "秒",
  },
] as const;

export default function StatEditor({
  level,
  allocation,
  balance,
  inBattle,
  currentHp,
  onSaved,
}: {
  level: number;
  allocation?: Allocation;
  balance: GameBalance;
  inBattle: boolean;
  currentHp?: number;
  onSaved: (state: GameState) => void;
}) {
  const [draft, setDraft] = useState(allocation ?? emptyAllocation);
  useEffect(() => {
    setDraft(allocation ?? emptyAllocation);
  }, [allocation]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const budget = Math.max(0, level - 1) * 3;
  const used = Object.values(draft).reduce((sum, n) => sum + n, 0);
  const remaining = Math.max(0, budget - used);
  const stats = playerStats(draft, balance);

  function adjust(key: keyof Allocation, amount: number) {
    setDraft((current) => {
      if (
        amount > 0 &&
        Object.values(current).reduce((sum, n) => sum + n, 0) >= budget
      )
        return current;
      if (amount < 0 && current[key] <= 0) return current;
      return { ...current, [key]: current[key] + amount };
    });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setBusy(true);
        setError(undefined);
        void gameRequest<GameState>("allocation", draft, "PUT")
          .then(onSaved)
          .catch((cause) => setError(cause.message))
          .finally(() => setBusy(false));
      }}
    >
      <div className="flex items-end justify-between gap-3 rounded-lg border bg-muted/20 px-3 py-2">
        <div>
          <p className="text-xs text-muted-foreground">未使用の育成ポイント</p>
          <p className="text-xl font-semibold tabular-nums">
            {remaining}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              / {budget}
            </span>
          </p>
        </div>
        <p className="text-right text-xs text-muted-foreground">
          Lvアップごとに3ポイント
        </p>
      </div>

      {inBattle && (
        <output className="text-sm text-muted-foreground">
          戦闘中はステータスを変更できません。
        </output>
      )}

      <fieldset
        disabled={busy || inBattle}
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {statDefinitions.map((definition) => {
          const { key, label, Icon, value, increase } = definition;
          const suffix = "suffix" in definition ? definition.suffix : undefined;
          const stat = key as keyof Allocation;
          return (
            <div
              key={key}
              className="flex min-w-0 items-center gap-3 rounded-lg border bg-card p-3"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-semibold tabular-nums">
                  {value(stats)}
                  {suffix ?? ""}
                </p>
                {key === "hp" && currentHp !== undefined && (
                  <p className="text-xs text-muted-foreground tabular-nums">
                    現在HP {Math.min(currentHp, stats.maxHp)}/{stats.maxHp}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  +{increase(balance)}
                  {suffix ?? ""} / ポイント · 割り振り {draft[stat]}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label={`${label}のポイントを減らす`}
                  disabled={draft[stat] === 0}
                  onClick={() => adjust(stat, -1)}
                >
                  <Minus aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label={`${label}にポイントを割り振る`}
                  disabled={remaining === 0}
                  onClick={() => adjust(stat, 1)}
                >
                  <Plus aria-hidden="true" />
                </Button>
              </div>
            </div>
          );
        })}
      </fieldset>

      <p className="text-xs text-muted-foreground">
        HPへの割り振りは最大HPを増やしますが、現在HPは回復しません。振り直しは無料です。
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={busy || inBattle || used === 0}
          onClick={() => setDraft({ ...emptyAllocation })}
        >
          振り直す
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={busy || inBattle || used > budget}
        >
          {busy ? "保存中…" : "割り振りを保存"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
