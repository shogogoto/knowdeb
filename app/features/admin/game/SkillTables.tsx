import { IconPicker } from "~/features/game/GameIcon";
import { type SkillDefinition, effectLabels } from "~/features/game/catalog";
import { Input } from "~/shared/components/ui/input";

const selectClass = "h-9 rounded-md border bg-background px-2 text-sm";
const groups = [
  ["回復", ["heal_hp", "heal_mp"]],
  ["攻撃", ["attack"]],
  ["buff", ["buff"]],
  ["debuff", ["debuff"]],
  ["状態異常", ["ailment"]],
  ["その他", ["recover_moves", "equip_attack"]],
] as const;

export default function SkillTables({
  skills,
  update,
}: {
  skills: SkillDefinition[];
  update: (id: string, patch: Partial<SkillDefinition>) => void;
}) {
  return (
    <div className="space-y-6">
      {groups.map(([title, effects]) => (
        <section key={title} aria-label={`${title}スキル`}>
          <h3 className="mb-2 font-semibold">{title}</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  {[
                    "スキル",
                    "効果・対象",
                    "効果量",
                    "消費・出題",
                    "Power補正・誤答",
                    "有効",
                  ].map((h) => (
                    <th key={h} className="p-2 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {skills
                  .filter((s) =>
                    (effects as readonly string[]).includes(s.effect),
                  )
                  .map((s) => {
                    const numeric = (
                      label: string,
                      key: keyof SkillDefinition,
                      min: number,
                      max: number,
                      step = 1,
                      fallback = 0,
                    ) => (
                      <label
                        htmlFor={`${s.id}-${key}`}
                        className="grid gap-1 text-xs"
                      >
                        {label}
                        <Input
                          id={`${s.id}-${key}`}
                          aria-label={label}
                          className="w-24"
                          type="number"
                          required
                          min={min}
                          max={max}
                          step={step}
                          value={
                            s[key] === undefined
                              ? fallback
                              : Number.isFinite(s[key])
                                ? (s[key] as number)
                                : ""
                          }
                          onChange={(e) =>
                            update(s.id, { [key]: e.target.valueAsNumber })
                          }
                        />
                      </label>
                    );
                    const status = ["buff", "debuff", "ailment"].includes(
                      s.effect,
                    );
                    return (
                      <tr
                        key={s.id}
                        aria-label={s.name}
                        className="border-t align-top"
                      >
                        <td className="space-y-2 p-2">
                          <Input
                            aria-label="名前"
                            value={s.name}
                            required
                            maxLength={80}
                            className="min-w-32"
                            onChange={(e) =>
                              update(s.id, { name: e.target.value })
                            }
                          />
                          <IconPicker
                            label={`${s.name}の素材`}
                            value={s.icon}
                            onChange={(icon) => update(s.id, { icon })}
                          />
                        </td>
                        <td className="space-y-2 p-2">
                          <label className="grid gap-1 text-xs">
                            効果
                            <select
                              aria-label="効果"
                              className={selectClass}
                              value={s.effect}
                              onChange={(e) => {
                                const effect = e.target
                                  .value as SkillDefinition["effect"];
                                update(s.id, {
                                  effect,
                                  target: [
                                    "attack",
                                    "debuff",
                                    "ailment",
                                  ].includes(effect)
                                    ? "enemy"
                                    : "self",
                                  stat: "attack",
                                  amount_mode: "fixed",
                                  ...(effect === "ailment"
                                    ? { amount: Math.max(1, s.amount) }
                                    : {}),
                                });
                              }}
                            >
                              {Object.entries(effectLabels).map(
                                ([id, label]) => (
                                  <option key={id} value={id}>
                                    {label}
                                  </option>
                                ),
                              )}
                            </select>
                          </label>
                          {["attack", "debuff", "ailment"].includes(
                            s.effect,
                          ) && (
                            <label className="grid gap-1 text-xs">
                              対象
                              <select
                                aria-label="対象"
                                className={selectClass}
                                value={s.target}
                                onChange={(e) =>
                                  update(s.id, {
                                    target: e.target
                                      .value as SkillDefinition["target"],
                                  })
                                }
                              >
                                <option value="enemy">敵1体</option>
                                <option value="all_enemies">敵全体</option>
                              </select>
                            </label>
                          )}
                          {["buff", "debuff"].includes(s.effect) && (
                            <label className="grid gap-1 text-xs">
                              対象ステータス
                              <select
                                aria-label="対象ステータス"
                                className={selectClass}
                                value={s.stat ?? "attack"}
                                onChange={(e) =>
                                  update(s.id, {
                                    stat: e.target
                                      .value as SkillDefinition["stat"],
                                    ...(e.target.value === "maxHp"
                                      ? { amount_mode: "percent" }
                                      : {}),
                                  })
                                }
                              >
                                <option value="attack">攻撃力</option>
                                {s.effect === "buff" && (
                                  <>
                                    <option value="defense">守備力</option>
                                    <option value="maxHp">
                                      最大HP（バブル）
                                    </option>
                                  </>
                                )}
                              </select>
                            </label>
                          )}
                        </td>
                        <td className="space-y-2 p-2">
                          {numeric(
                            s.effect === "attack" ? "加算ダメージ" : "効果量",
                            "amount",
                            s.effect === "ailment" ? 1 : 0,
                            10000,
                          )}
                          {!["recover_moves", "equip_attack"].includes(
                            s.effect,
                          ) && (
                            <label className="grid gap-1 text-xs">
                              効果量の指定
                              <select
                                aria-label="効果量の指定"
                                className={selectClass}
                                value={s.amount_mode ?? "fixed"}
                                disabled={s.stat === "maxHp"}
                                onChange={(e) =>
                                  update(s.id, {
                                    amount_mode: e.target.value as
                                      | "fixed"
                                      | "percent",
                                  })
                                }
                              >
                                <option value="fixed">固定値</option>
                                <option value="percent">
                                  対象能力の割合（%）
                                </option>
                              </select>
                            </label>
                          )}
                          {s.effect === "attack" &&
                            numeric("攻撃倍率", "multiplier", 0, 10, 0.1, 1)}
                          {status && (
                            <>
                              {numeric(
                                "持続ターン",
                                "duration_turns",
                                1,
                                20,
                                1,
                                3,
                              )}
                              {numeric(
                                "重複上限（1＝重複せず更新）",
                                "stack_limit",
                                1,
                                10,
                                1,
                                1,
                              )}
                            </>
                          )}
                        </td>
                        <td className="space-y-2 p-2">
                          {numeric("消費MP", "mp_cost", 0, 10000)}
                          <label className="flex items-center gap-1 text-xs">
                            <input
                              type="checkbox"
                              checked={s.requires_specialty ?? false}
                              onChange={(e) =>
                                update(s.id, {
                                  requires_specialty: e.target.checked,
                                  quiz_required: e.target.checked,
                                })
                              }
                            />
                            専門分野用
                          </label>
                          <label className="flex items-center gap-1 text-xs">
                            <input
                              type="checkbox"
                              checked={
                                s.quiz_required ?? s.requires_specialty ?? false
                              }
                              onChange={(e) =>
                                update(s.id, {
                                  quiz_required: e.target.checked,
                                })
                              }
                            />
                            専用クイズ
                          </label>
                          {(s.quiz_required || s.requires_specialty) &&
                            numeric(
                              "専用クイズ秒数 / 問",
                              "quiz_seconds",
                              5,
                              300,
                              1,
                              30,
                            )}
                          <label className="flex items-center gap-1 text-xs">
                            <input
                              type="checkbox"
                              checked={s.castable !== false}
                              onChange={(e) =>
                                update(s.id, { castable: e.target.checked })
                              }
                            />
                            直接使用可
                          </label>
                        </td>
                        <td className="space-y-2 p-2">
                          {numeric(
                            "Power係数",
                            "power_coefficient",
                            0,
                            1000,
                            0.1,
                            1,
                          )}
                          {!status ? (
                            numeric("誤答時倍率", "wrong_multiplier", 0, 1, 0.1)
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              正解で付与／誤答で不付与
                            </span>
                          )}
                        </td>
                        <td className="p-2">
                          <input
                            aria-label="有効"
                            type="checkbox"
                            checked={s.enabled}
                            onChange={(e) =>
                              update(s.id, { enabled: e.target.checked })
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
