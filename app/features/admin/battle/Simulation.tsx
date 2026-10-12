import { useState } from "react";
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
import {
  type BattleSettings,
  type EnemyBalanceSimulation,
  requestEnemyBalanceSimulation,
} from "./api";

const range = (values: number[]) => {
  if (!values.length) return "—";
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? String(min) : `${min}〜${max}`;
};

export default function Simulation({
  settings,
  labels,
  mode = "stats",
}: {
  settings: BattleSettings;
  labels: Partial<Record<keyof BattleSettings, string>>;
  mode?: "stats" | "roster";
}) {
  const [power, setPower] = useState(100);
  const [achievement, setAchievement] = useState(1);
  const [results, setResults] = useState<
    (EnemyBalanceSimulation & { id: string })[]
  >([]);
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const current = results[selected];

  async function simulate(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    try {
      const result = await requestEnemyBalanceSimulation({
        balance: { ...settings },
        power,
        achievement,
        average_relations: 0,
      });
      setSelected(results.length);
      setResults((previous) => [
        ...previous,
        { ...result, id: crypto.randomUUID() },
      ]);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "敵を試算できませんでした。",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-label={
        mode === "stats" ? "敵能力の試算" : "ロスター・同時出現数の試算"
      }
      className="space-y-4 rounded-lg border p-4 sm:p-5"
    >
      <div>
        <h3 className="font-semibold">
          {mode === "stats" ? "敵能力の試算" : "ロスター・同時出現数の試算"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          この上の設定を編集して試算できます。保存は不要です。結果は条件変更後も残ります。実際の生成と同じ計算を使用し、クイズの割り当てと個体差は再現可能なサンプルです。
        </p>
      </div>
      <form onSubmit={simulate} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "ダンジョンのPower",
              name: "Power",
              value: power,
              setter: setPower,
              min: 0,
              max: 1000000000,
            },
            {
              label: "領域（達成度帯）",
              name: "達成度",
              value: achievement,
              setter: setAchievement,
              min: 1,
              max: 20,
            },
          ]
            .filter((field) => mode === "stats" || field.name !== "Power")
            .map((field) => (
              <div className="space-y-1 text-sm" key={field.name}>
                <Label htmlFor={`simulation-${mode}-${field.name}`}>
                  {field.label}
                </Label>
                <Input
                  id={`simulation-${mode}-${field.name}`}
                  aria-label={`${mode === "stats" ? "敵能力" : "ロスター"}の試算に使う${field.name}`}
                  type="number"
                  required
                  min={field.min}
                  max={field.max}
                  step={1}
                  value={field.value}
                  onChange={(event) => field.setter(Number(event.target.value))}
                />
              </div>
            ))}
        </div>
        <Button type="submit" disabled={busy}>
          {busy
            ? "試算中…"
            : `${mode === "stats" ? "敵能力" : "ロスター"}を試算して比較に追加`}
        </Button>
      </form>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {results.length > 0 ? (
        <>
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium">条件ごとの比較</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => {
                setResults([]);
                setSelected(0);
              }}
            >
              結果をクリア
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            試算の行を選ぶと、そのときの設定と敵一覧を下に表示します。
          </p>
          <div className="overflow-x-auto rounded-md border">
            <Table aria-label={`${mode}試算比較`} className="whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>試算</TableHead>
                  {mode === "stats" && <TableHead>Power</TableHead>}
                  <TableHead>領域</TableHead>
                  {mode === "stats" && <TableHead>ばらつき</TableHead>}
                  <TableHead>補正値の変更</TableHead>
                  {mode === "roster" ? (
                    <>
                      <TableHead>母集団</TableHead>
                      <TableHead>敵の種類（予定→実際）</TableHead>
                      <TableHead>固定問数 / 敵</TableHead>
                      <TableHead>割り当て済み</TableHead>
                      <TableHead>未割り当て</TableHead>
                      <TableHead>同時出現</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>HP</TableHead>
                      <TableHead>攻撃力</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow
                    key={result.id}
                    data-state={selected === index ? "selected" : undefined}
                    className="cursor-pointer"
                    onClick={() => setSelected(index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") setSelected(index);
                    }}
                  >
                    <TableCell>
                      <Button
                        type="button"
                        size="sm"
                        variant={selected === index ? "secondary" : "outline"}
                        aria-label={`試算 ${index + 1}`}
                        aria-pressed={selected === index}
                        onClick={() => setSelected(index)}
                      >
                        試算 {index + 1}
                        {selected === index && (
                          <span className="text-xs">表示中</span>
                        )}
                      </Button>
                    </TableCell>
                    {mode === "stats" && <TableCell>{result.power}</TableCell>}
                    <TableCell>{result.achievement}</TableCell>
                    {mode === "stats" && (
                      <TableCell>
                        ±{result.balance.enemy_variance_percent}%
                      </TableCell>
                    )}
                    <TableCell className="min-w-32 max-w-64 whitespace-normal text-xs">
                      {index === 0
                        ? "基準"
                        : Object.entries(labels)
                            .filter(
                              ([key]) =>
                                key !== "enemy_variance_percent" &&
                                result.balance[key as keyof BattleSettings] !==
                                  results[0].balance[
                                    key as keyof BattleSettings
                                  ],
                            )
                            .map(
                              ([key, label]) =>
                                `${label}: ${result.balance[key as keyof BattleSettings]}`,
                            )
                            .join(" / ") || "基準と同じ"}
                    </TableCell>
                    {mode === "roster" ? (
                      <>
                        <TableCell>{result.pool_quiz_count}問</TableCell>
                        <TableCell>
                          {result.requested_enemy_types}→{result.enemies.length}
                          種類
                        </TableCell>
                        <TableCell>
                          {range(
                            result.enemies.map((enemy) => enemy.quiz_count),
                          )}
                          問
                        </TableCell>
                        <TableCell>{result.assigned_quiz_count}問</TableCell>
                        <TableCell>{result.unassigned_quiz_count}問</TableCell>
                        <TableCell>
                          {result.min_encounter_enemies}〜
                          {result.max_encounter_enemies}体
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>
                          {range(result.enemies.map((enemy) => enemy.hp))}
                        </TableCell>
                        <TableCell>
                          {range(result.enemies.map((enemy) => enemy.attack))}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {current && (
            <section aria-label="選択した試算の敵" className="space-y-3">
              <h4 className="font-medium">試算 {selected + 1} の敵一覧</h4>
              {current.warnings?.map((warning) => (
                <p key={warning} className="text-sm text-amber-500">
                  {warning}
                </p>
              ))}
              <details className="rounded-md border p-3 text-sm">
                <summary className="cursor-pointer">
                  この試算に使ったゲームバランス設定
                </summary>
                <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {Object.entries(labels).map(([key, label]) => (
                    <div key={key} className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd>{current.balance[key as keyof BattleSettings]}</dd>
                    </div>
                  ))}
                </dl>
              </details>
              <div className="overflow-x-auto rounded-md border">
                <Table aria-label={`${mode}試算の敵一覧`}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>敵</TableHead>
                      {mode === "roster" ? (
                        <TableHead>固定クイズ数</TableHead>
                      ) : (
                        <>
                          <TableHead>HP</TableHead>
                          <TableHead>攻撃力</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {current.enemies.map((enemy) => (
                      <TableRow key={enemy.index}>
                        <TableCell>敵 {enemy.index}</TableCell>
                        {mode === "roster" ? (
                          <TableCell>{enemy.quiz_count}問</TableCell>
                        ) : (
                          <>
                            <TableCell>{enemy.hp}</TableCell>
                            <TableCell>{enemy.attack}</TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          条件や補正値を変えて試算すると、比較行が追加されます。
        </p>
      )}
    </section>
  );
}
