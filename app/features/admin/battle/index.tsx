import { Fragment, useEffect, useState } from "react";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import CombatSimulation from "./CombatSimulation";
import Simulation from "./Simulation";
import { type BattleSettings, requestBattleSettings } from "./api";

const fields = {
  base_hp: ["初期HP", 1, 10000, 1],
  base_attack: ["初期攻", 1, 1000, 1],
  base_defense: ["初期守", 0, 1000, 1],
  base_seconds: ["初期持ち時間（秒）", 5, 300, 1],
  hp_per_point: ["HP / 育成ポイント", 1, 100, 1],
  attack_per_point: ["攻 / 育成ポイント", 1, 100, 1],
  defense_per_point: ["守 / 育成ポイント", 1, 100, 1],
  seconds_per_point: ["秒 / 育成ポイント", 1, 30, 1],
  enemy_hp: ["敵の基礎HP", 1, 10000, 1],
  enemy_attack: ["敵の基礎攻", 1, 1000, 1],
  power_hp: ["PowerのHP補正", 0, 100, 0.1],
  power_attack: ["Powerの攻補正", 0, 100, 0.1],
  region_hp_growth_percent: ["達成度帯ごとのHP成長率（%）", 0, 1000, 1],
  region_attack_growth_percent: ["達成度帯ごとの攻成長率（%）", 0, 1000, 1],
  enemy_variance_percent: ["敵能力のばらつき（±%）", 0, 50, 1],
  damage_attack_multiplier: ["攻撃力の倍率", 0, 10, 0.1],
  damage_defense_divisor: [
    "守備力の除数（大きいほど軽減が小さい）",
    0.1,
    100,
    0.1,
  ],
  damage_variance_percent: ["ダメージの乱数幅（±%）", 0, 50, 1],
  enemy_types: ["領域ごとの敵の種類数", 1, 20, 1],
  enemy_types_per_region: ["領域が進むごとの種類数の増加", 0, 20, 1],
  quizzes_per_enemy_coefficient: ["達成度あたりの固定クイズ数", 0.1, 5, 0.1],
  min_enemies: ["同時出現数の下端", 1, 20, 1],
  max_encounter_enemies: ["同時出現数の上端", 1, 20, 1],
  encounter_growth_rate: ["同時出現数の増加率", 0, 10, 0.1],
} as const;
const rangePairs = {
  min_enemies: {
    label: "同時出現数",
    upper: "max_encounter_enemies",
  },
} as const;
const rangeUpperKeys = new Set<string>(
  Object.values(rangePairs).map((pair) => pair.upper),
);
const groups = [
  {
    label: "プレイヤーの初期値",
    keys: ["base_hp", "base_attack", "base_defense", "base_seconds"],
  },
  {
    label: "育成ポイントあたりの上昇量",
    keys: [
      "hp_per_point",
      "attack_per_point",
      "defense_per_point",
      "seconds_per_point",
    ],
  },
  {
    label: "ダメージ計算",
    description: "ダメージ = max(1, 攻 × 倍率 − 守 ÷ 除数) ± 乱数",
    keys: [
      "damage_attack_multiplier",
      "damage_defense_divisor",
      "damage_variance_percent",
    ],
  },
  {
    label: "敵ステータスの計算",
    description:
      "能力 = (基礎値 + log(1 + Power) × Power補正) × [1 + (達成度帯 − 1) × 成長率 / 100] × 個体差",
    keys: [
      "enemy_hp",
      "enemy_attack",
      "power_hp",
      "power_attack",
      "region_hp_growth_percent",
      "region_attack_growth_percent",
      "enemy_variance_percent",
    ],
  },
  {
    label: "敵ロスターと遭遇の抽選",
    rules: [
      "種類数 = 初期数 + (達成度 − 1) × 増加数",
      "固定問数 = 達成度 × 係数",
      "クイズセット間の共有・未割り当てを許可",
      "ロスターの変更は「ダンジョン母集団 → 敵だけ再構成」で反映",
      "出現範囲 = 基準の両端 × [1 + (達成度 − 1) × 増加率]",
      "出現数は範囲内から抽選し、設定変更は次の戦闘から反映",
      "同じ種類の敵も複数出現",
      "小数は切り上げ、同時出現は最大20体",
    ],
    keys: [
      "enemy_types",
      "enemy_types_per_region",
      "quizzes_per_enemy_coefficient",
      "min_enemies",
      "max_encounter_enemies",
      "encounter_growth_rate",
    ],
  },
] as const;

export default function BattleSettingsManager() {
  const [settings, setSettings] = useState<BattleSettings>();
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let active = true;
    requestBattleSettings().then(
      (value) => {
        if (active) setSettings(value);
      },
      (cause) => {
        if (active) setError(cause.message);
      },
    );
    return () => {
      active = false;
    };
  }, []);
  return (
    <section className="mx-auto max-w-5xl space-y-4 p-4 sm:p-6">
      <h2 className="text-lg font-semibold">ゲームバランス</h2>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      <div className="space-y-6">
        {saved && <output className="block">ゲーム設定を保存しました</output>}
        {settings && (
          <div className="space-y-4">
            <form
              id="game-settings"
              onSubmit={(event) => {
                event.preventDefault();
                setError(undefined);
                setSaved(false);
                if (settings.min_enemies > settings.max_encounter_enemies) {
                  setError("下限は上限以下にしてください。");
                  return;
                }
                setSaving(true);
                void requestBattleSettings(settings)
                  .then((value) => {
                    setSettings(value);
                    setSaved(true);
                  })
                  .catch((cause) => setError(cause.message))
                  .finally(() => setSaving(false));
              }}
            />
            <div className="space-y-5">
              {groups.map((group) => (
                <section
                  key={group.label}
                  aria-label={group.label}
                  className="overflow-hidden rounded-lg border"
                >
                  <div className="border-b bg-muted/40 px-4 py-3">
                    <h3 className="font-medium">{group.label}</h3>
                    {"description" in group && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {group.description}
                      </p>
                    )}
                    {"rules" in group && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {group.rules.map((rule) => (
                          <li key={rule}>{rule}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                    {group.keys.map((kind) => {
                      if (rangeUpperKeys.has(kind)) return null;
                      const pair =
                        kind in rangePairs
                          ? rangePairs[kind as keyof typeof rangePairs]
                          : undefined;
                      if (pair) {
                        return (
                          <fieldset
                            key={kind}
                            aria-label={pair.label}
                            className="flex min-w-0 items-center justify-between gap-3 px-4 py-3"
                          >
                            <span className="text-sm font-medium">
                              {pair.label}
                            </span>
                            <div className="flex items-center gap-2">
                              {[kind, pair.upper].map((bound, index) => {
                                const [label, min, max, step] = fields[bound];
                                return (
                                  <Fragment key={bound}>
                                    <Input
                                      id={`battle-${bound}`}
                                      form="game-settings"
                                      aria-label={label}
                                      type="number"
                                      min={min}
                                      max={max}
                                      step={step}
                                      required
                                      disabled={saving}
                                      className="w-20"
                                      value={settings[bound]}
                                      onChange={(event) =>
                                        setSettings({
                                          ...settings,
                                          [bound]: Number(event.target.value),
                                        })
                                      }
                                    />
                                    {index === 0 && (
                                      <span aria-hidden="true">〜</span>
                                    )}
                                  </Fragment>
                                );
                              })}
                            </div>
                          </fieldset>
                        );
                      }
                      const [label, min, max, step] = fields[kind];
                      return (
                        <div
                          key={kind}
                          className="flex min-w-0 items-center justify-between gap-4 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <Label
                              htmlFor={`battle-${kind}`}
                              className="whitespace-normal"
                            >
                              {label}
                            </Label>
                          </div>
                          <Input
                            id={`battle-${kind}`}
                            form="game-settings"
                            type="number"
                            min={min}
                            max={max}
                            step={step}
                            required
                            disabled={saving}
                            className="w-28 shrink-0"
                            value={settings[kind]}
                            onChange={(event) => {
                              setSettings({
                                ...settings,
                                [kind]: Number(event.target.value),
                              });
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  {group.label === "ダメージ計算" && (
                    <CombatSimulation settings={settings} />
                  )}
                  {(group.label === "敵ステータスの計算" ||
                    group.label === "敵ロスターと遭遇の抽選") && (
                    <Simulation
                      settings={settings}
                      mode={
                        group.label === "敵ステータスの計算"
                          ? "stats"
                          : "roster"
                      }
                      labels={Object.fromEntries(
                        group.keys.map((key) => [key, fields[key][0]]),
                      )}
                    />
                  )}
                </section>
              ))}
            </div>
            <Button disabled={saving} type="submit" form="game-settings">
              {saving ? "保存中…" : "保存"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
