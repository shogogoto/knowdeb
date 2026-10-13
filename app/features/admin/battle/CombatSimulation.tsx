import { useState } from "react";
import { emptyAllocation, playerStats } from "~/features/game/battle";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/shared/components/ui/table";
import { type CombatSimulationResult, requestCombatSimulation } from "./api";
import type { BattleSettings } from "./api";

export default function CombatSimulation({
  settings,
}: { settings: BattleSettings }) {
  const stats = playerStats(emptyAllocation, settings);
  const player = {
    hp: stats.maxHp,
    attack: stats.attack,
    defense: stats.defense,
  };
  const [enemy, setEnemy] = useState({ hp: 28, attack: 16 });
  const [results, setResults] = useState<
    (CombatSimulationResult & { id: string })[]
  >([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  return (
    <section
      aria-label="戦闘の試算"
      className="space-y-4 rounded-lg border p-4 sm:p-5"
    >
      <div>
        <h3 className="font-semibold">戦闘の試算</h3>
      </div>
      <form
        className="space-y-3"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setError(undefined);
          try {
            const result = await requestCombatSimulation({
              player,
              enemy: { ...enemy },
              balance: settings,
            });
            setResults((previous) => [
              ...previous,
              { ...result, id: crypto.randomUUID() },
            ]);
          } catch (cause) {
            setError(
              cause instanceof Error
                ? cause.message
                : "戦闘を試算できませんでした。",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <fieldset className="space-y-3 rounded-md border p-3">
            <legend className="px-1 text-sm font-medium">
              プレイヤーの初期値
            </legend>
            <p className="text-sm tabular-nums">
              HP {player.hp} · 攻 {player.attack} · 守 {player.defense}
            </p>
          </fieldset>
          <fieldset className="space-y-3 rounded-md border p-3">
            <legend className="px-1 text-sm font-medium">敵</legend>
            {(["hp", "attack"] as const).map((stat) => {
              const label = `敵の${{ hp: "HP", attack: "攻撃力" }[stat]}`;
              return (
                <div
                  key={stat}
                  className="flex items-center justify-between gap-3"
                >
                  <Label htmlFor={`combat-enemy-${stat}`}>{label}</Label>
                  <Input
                    id={`combat-enemy-${stat}`}
                    className="w-28"
                    type="number"
                    required
                    min={stat === "hp" ? 1 : 0}
                    max={100000}
                    step={1}
                    value={enemy[stat]}
                    onChange={(event) =>
                      setEnemy({ ...enemy, [stat]: Number(event.target.value) })
                    }
                  />
                </div>
              );
            })}
          </fieldset>
        </div>
        <Button type="submit" disabled={busy}>
          {busy ? "試算中…" : "戦闘を試算して比較に追加"}
        </Button>
      </form>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {results.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium">戦闘条件ごとの比較</h4>
            <Button
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => setResults([])}
            >
              戦闘試算をクリア
            </Button>
          </div>
          <div className="overflow-x-auto rounded-md border">
            <Table aria-label="戦闘試算比較" className="whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  {[
                    "試算",
                    "プレイヤーHP",
                    "攻",
                    "守",
                    "敵HP",
                    "敵の攻",
                    "攻倍率",
                    "守除数",
                    "乱数幅",
                    "正解時 → 敵（幅）",
                    "誤答時 → 自分（幅）",
                    "撃破までの正解",
                    "敗北までの誤答",
                  ].map((heading) => (
                    <TableHead key={heading}>{heading}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={result.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{result.player.hp}</TableCell>
                    <TableCell>{result.player.attack}</TableCell>
                    <TableCell>{result.player.defense}</TableCell>
                    <TableCell>{result.enemy.hp}</TableCell>
                    <TableCell>{result.enemy.attack}</TableCell>
                    <TableCell>
                      {result.balance.damage_attack_multiplier}
                    </TableCell>
                    <TableCell>
                      {result.balance.damage_defense_divisor}
                    </TableCell>
                    <TableCell>
                      ±{result.balance.damage_variance_percent}%
                    </TableCell>
                    <TableCell>
                      {result.damage_to_enemy}（{result.damage_to_enemy_min}〜
                      {result.damage_to_enemy_max}）
                    </TableCell>
                    <TableCell>
                      {result.damage_to_player}（{result.damage_to_player_min}〜
                      {result.damage_to_player_max}）
                    </TableCell>
                    <TableCell>
                      {result.correct_answers_to_defeat === null
                        ? "撃破不可"
                        : `${result.correct_answers_to_defeat}回`}
                    </TableCell>
                    <TableCell>
                      {result.incorrect_answers_to_defeat}回
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
      <p className="text-xs text-muted-foreground">
        能力値一定・HP回復なしでの目安です。試算は保存せず、ゲームのHP・回答履歴・XPには影響しません。比較結果はこの画面を離れるまで残ります。
      </p>
    </section>
  );
}
