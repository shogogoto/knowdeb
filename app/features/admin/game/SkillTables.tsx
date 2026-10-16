import { useState } from "react";
import { IconPicker } from "~/features/game/GameIcon";
import SkillEffect from "~/features/game/SkillEffect";
import {
  type SkillDefinition,
  animationLabels,
  effectLabels,
} from "~/features/game/catalog";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";

const selectClass = "h-9 rounded-md border bg-background px-2 text-sm";
export const skillGroups = [
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
  add,
}: {
  skills: SkillDefinition[];
  update: (id: string, patch: Partial<SkillDefinition>) => void;
  add: (effect: SkillDefinition["effect"]) => void;
}) {
  const [preview, setPreview] = useState<{ id: string; key: number }>();
  return (
    <div className="space-y-6">
      {skillGroups.map(([title, effects]) => {
        const status = ["buff", "debuff", "ailment"].includes(effects[0]);
        const stat = effects[0] === "buff" || effects[0] === "debuff";
        const headers = [
          "名前",
          "素材",
          "効果",
          "対象",
          ...(stat ? ["対象ステータス"] : []),
          "効果量",
          ...(title !== "その他" ? ["指定方式"] : []),
          ...(title === "攻撃" ? ["攻撃倍率"] : []),
          ...(status ? ["持続ターン", "重複上限"] : []),
          "消費MP",
          "演出",
          "プレビュー",
          "有効",
        ];
        const rows = skills.filter((s) =>
          (effects as readonly string[]).includes(s.effect),
        );
        return (
          <section key={title} aria-label={`${title}スキル`}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="font-semibold">{title}</h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                aria-label={`${title}スキルを追加`}
                onClick={() => add(effects[0])}
              >
                追加
              </Button>
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full whitespace-nowrap text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    {headers.map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="p-2 text-left font-medium"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => {
                    const numeric = (
                      label: string,
                      key:
                        | "amount"
                        | "multiplier"
                        | "mp_cost"
                        | "duration_turns"
                        | "stack_limit",
                      min: number,
                      max: number,
                      fallback = 0,
                      step = 1,
                    ) => (
                      <Input
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
                              ? s[key]
                              : ""
                        }
                        onChange={(e) =>
                          update(s.id, { [key]: e.target.valueAsNumber })
                        }
                      />
                    );
                    return (
                      <tr
                        key={s.id}
                        aria-label={s.name}
                        className="border-t [&>td]:p-2"
                      >
                        <td>
                          <Input
                            aria-label="名前"
                            value={s.name}
                            required
                            maxLength={80}
                            className="w-36"
                            onChange={(e) =>
                              update(s.id, { name: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <IconPicker
                            label={`${s.name}の素材`}
                            value={s.icon}
                            onChange={(icon) => update(s.id, { icon })}
                          />
                        </td>
                        <td>
                          <select
                            aria-label="効果"
                            className={selectClass}
                            value={s.effect}
                            onChange={(e) =>
                              update(s.id, {
                                effect: e.target
                                  .value as SkillDefinition["effect"],
                              })
                            }
                          >
                            {effects.map((effect) => (
                              <option key={effect} value={effect}>
                                {effectLabels[effect]}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          {["attack", "debuff", "ailment"].includes(
                            s.effect,
                          ) ? (
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
                          ) : (
                            "自分"
                          )}
                        </td>
                        {stat && (
                          <td>
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
                          </td>
                        )}
                        <td>
                          {numeric(
                            s.effect === "attack" ? "加算ダメージ" : "効果量",
                            "amount",
                            s.effect === "ailment" ? 1 : 0,
                            10000,
                          )}
                        </td>
                        {title !== "その他" && (
                          <td>
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
                              <option value="percent">割合（%）</option>
                            </select>
                          </td>
                        )}
                        {title === "攻撃" && (
                          <td>
                            {numeric("攻撃倍率", "multiplier", 0, 10, 1, 0.1)}
                          </td>
                        )}
                        {status && (
                          <>
                            <td>
                              {numeric(
                                "持続ターン",
                                "duration_turns",
                                1,
                                20,
                                3,
                              )}
                            </td>
                            <td>
                              {numeric("重複上限", "stack_limit", 1, 10, 1)}
                            </td>
                          </>
                        )}
                        <td>{numeric("消費MP", "mp_cost", 0, 10000)}</td>
                        <td>
                          <select
                            aria-label="演出"
                            className={selectClass}
                            value={s.animation ?? "none"}
                            onChange={(e) =>
                              update(s.id, {
                                animation: e.target
                                  .value as SkillDefinition["animation"],
                              })
                            }
                          >
                            {Object.entries(animationLabels).map(
                              ([key, label]) => (
                                <option key={key} value={key}>
                                  {label}
                                </option>
                              ),
                            )}
                          </select>
                        </td>
                        <td className="relative">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            aria-label={`${s.name}の演出を再生`}
                            onClick={() =>
                              setPreview({
                                id: s.id,
                                key: (preview?.key ?? 0) + 1,
                              })
                            }
                          >
                            再生
                          </Button>
                          {preview?.id === s.id && (
                            <SkillEffect
                              key={preview.key}
                              animation={s.animation ?? "none"}
                            />
                          )}
                        </td>
                        <td>
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
                  {!rows.length && (
                    <tr>
                      <td
                        colSpan={headers.length}
                        className="p-3 text-muted-foreground"
                      >
                        未登録
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
