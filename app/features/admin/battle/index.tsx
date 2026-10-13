import { useEffect, useState } from "react";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import CombatSimulation from "./CombatSimulation";
import FormulaSettings from "./FormulaSettings";
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
const formulaLabels: Partial<Record<keyof typeof fields, string>> = {
  enemy_hp: "基礎HP",
  enemy_attack: "基礎攻撃力",
  power_hp: "Power補正",
  power_attack: "Power補正",
  region_hp_growth_percent: "HP成長率",
  region_attack_growth_percent: "攻の成長率",
  enemy_variance_percent: "ばらつき",
  damage_attack_multiplier: "倍率",
  damage_defense_divisor: "除数",
  damage_variance_percent: "乱数幅",
  enemy_types: "初期種類数",
  enemy_types_per_region: "増加種類数",
  quizzes_per_enemy_coefficient: "問数係数",
  min_enemies: "最小数",
  max_encounter_enemies: "最大数",
  encounter_growth_rate: "増加率",
};
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
    formula: "damage",
    keys: [
      "damage_attack_multiplier",
      "damage_defense_divisor",
      "damage_variance_percent",
    ],
  },
  {
    label: "敵ステータスの計算",
    formula: "stats",
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
    formula: "roster",
    rules: [
      "クイズセット間の共有・未割り当てを許可",
      "ロスターの変更は「ダンジョン母集団 → 敵だけ再構成」で反映",
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
  const settingInput = (kind: keyof typeof fields, compact = false) => {
    const [label, min, max, step] = fields[kind];
    const input = (
      <Input
        id={`battle-${kind}`}
        form="game-settings"
        aria-label={label}
        title={label}
        type="number"
        min={min}
        max={max}
        step={step}
        required
        disabled={saving}
        className={compact ? "w-20 shrink-0" : "w-28 shrink-0"}
        value={settings?.[kind] ?? ""}
        onChange={(event) => {
          setSaved(false);
          setSettings(
            (current) =>
              current && {
                ...current,
                [kind]: Number(event.target.value),
              },
          );
        }}
      />
    );
    return compact ? (
      <span className="relative my-2 inline-flex shrink-0">
        <Label
          htmlFor={`battle-${kind}`}
          className="absolute -top-5 left-0 whitespace-nowrap text-xs text-muted-foreground"
        >
          {formulaLabels[kind] ?? label}
        </Label>
        {input}
      </span>
    ) : (
      input
    );
  };
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
                    {"rules" in group && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {group.rules.map((rule) => (
                          <li key={rule}>{rule}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {"formula" in group ? (
                    <FormulaSettings
                      kind={group.formula}
                      input={(kind) => settingInput(kind, true)}
                    />
                  ) : (
                    <div className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                      {group.keys.map((kind) => {
                        const [label] = fields[kind];
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
                            {settingInput(kind)}
                          </div>
                        );
                      })}
                    </div>
                  )}
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
