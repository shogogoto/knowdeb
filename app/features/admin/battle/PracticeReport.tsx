import { useEffect, useState } from "react";
import type { LiveEnemy, playerStats } from "~/features/game/battle";
import { Button } from "~/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/shared/components/ui/table";
import type { EnemyActual } from "./PracticeBattle";
import {
  type BattleSettings,
  type CombatSimulationResult,
  requestCombatSimulation,
} from "./api";

/** Predictions use the production server calculator and the frozen encounter. */
export default function PracticeReport({
  player,
  settings,
  enemies,
  actual,
  damageReceived,
}: {
  player: ReturnType<typeof playerStats>;
  settings: BattleSettings;
  enemies: LiveEnemy[];
  actual: Record<string, EnemyActual>;
  damageReceived: number;
}) {
  const [predictions, setPredictions] = useState<CombatSimulationResult[]>();
  const [error, setError] = useState<string>();
  const [attempt, setAttempt] = useState(0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: attempt explicitly retries a failed read.
  useEffect(() => {
    let mounted = true;
    setError(undefined);
    void Promise.all(
      enemies.map((enemy) =>
        requestCombatSimulation({
          player: {
            hp: player.maxHp,
            attack: player.attack,
            defense: player.defense,
          },
          enemy: { hp: enemy.hp, attack: enemy.attack },
          balance: settings,
        }),
      ),
    )
      .then((value) => {
        if (mounted) setPredictions(value);
      })
      .catch((cause) => {
        if (mounted)
          setError(
            cause instanceof Error
              ? cause.message
              : "想定値を取得できませんでした。",
          );
      });
    return () => {
      mounted = false;
    };
  }, [player, settings, enemies, attempt]);

  return (
    <div className="mt-3 space-y-3">
      <p className="text-sm">
        HP {player.maxHp} · 攻 {player.attack} · 守 {player.defense} ·
        被ダメージ合計 {damageReceived}
      </p>
      {error ? (
        <div className="flex items-center gap-2">
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAttempt((value) => value + 1)}
          >
            想定値を再取得
          </Button>
        </div>
      ) : !predictions ? (
        <output className="text-sm text-muted-foreground">
          想定値を読み込み中…
        </output>
      ) : null}
      <div className="overflow-x-auto">
        <Table aria-label="想定と実績">
          <TableHeader>
            <TableRow>
              {[
                "敵",
                "HP／攻",
                "与ダメージ／正解（想定）",
                "被ダメージ／誤答（想定）",
                "撃破までの正解（想定）",
                "正解（実績）",
                "与ダメージ合計（実績）",
                "結果",
              ].map((label) => (
                <TableHead key={label}>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {enemies.map((enemy, index) => {
              const prediction = predictions?.[index];
              const observed = actual[enemy.id];
              const hits = prediction
                ? prediction.damage_to_enemy_min === 0
                  ? "撃破不可"
                  : `${Math.ceil(enemy.hp / prediction.damage_to_enemy_max)}〜${Math.ceil(enemy.hp / prediction.damage_to_enemy_min)}回`
                : "—";
              return (
                <TableRow key={enemy.id}>
                  <TableCell className="whitespace-nowrap">
                    {index + 1}. {enemy.name}
                  </TableCell>
                  <TableCell>
                    {enemy.hp}／{enemy.attack}
                  </TableCell>
                  <TableCell>
                    {prediction
                      ? `${prediction.damage_to_enemy_min}〜${prediction.damage_to_enemy_max}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {prediction
                      ? `${prediction.damage_to_player_min}〜${prediction.damage_to_player_max}`
                      : "—"}
                  </TableCell>
                  <TableCell>{hits}</TableCell>
                  <TableCell>{observed?.correct ?? 0}回</TableCell>
                  <TableCell>{observed?.damage ?? 0}</TableCell>
                  <TableCell>
                    {observed?.defeated ? "撃破" : "未撃破"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        与ダメージ合計は残りHPを超えた分も含みます。
      </p>
    </div>
  );
}
