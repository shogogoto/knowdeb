import { useEffect, useState } from "react";
import { IconPicker } from "~/features/game/GameIcon";
import {
  type EnemyDefinition,
  type GameCatalog,
  type ItemDefinition,
  type SkillDefinition,
  effectLabels,
  requestGameCatalog,
} from "~/features/game/catalog";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";

type Kind = keyof GameCatalog;
const names = { skills: "スキル", items: "アイテム", enemies: "敵" };
const selectClass = "h-9 min-w-0 rounded-md border bg-background px-2 text-sm";
export default function CatalogEditor({ kind }: { kind: Kind }) {
  const [catalog, setCatalog] = useState<GameCatalog>();
  const [error, setError] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let active = true;
    void requestGameCatalog(true)
      .then((value) => {
        if (active) setCatalog(value);
      })
      .catch((cause) => {
        if (active) setError(cause.message);
      });
    return () => {
      active = false;
    };
  }, []);
  const update = (
    id: string,
    patch: Partial<SkillDefinition & ItemDefinition & EnemyDefinition>,
  ) => {
    setCatalog((current) =>
      current
        ? {
            ...current,
            [kind]: current[kind].map((item) =>
              item.id === id ? { ...item, ...patch } : item,
            ),
          }
        : current,
    );
    setSaved(false);
  };
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!catalog || saving) return;
    setSaving(true);
    setError(undefined);
    setSaved(false);
    try {
      setCatalog(await requestGameCatalog(true, catalog));
      setSaved(true);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "保存できませんでした。",
      );
    } finally {
      setSaving(false);
    }
  }
  function add() {
    if (!catalog) return;
    const id = `${kind.slice(0, -1)}_${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`;
    const base = {
      id,
      name: `新しい${names[kind]}`,
      icon: "sparkles",
      enabled: true,
    };
    const item =
      kind === "skills"
        ? {
            ...base,
            effect: "attack",
            target: "enemy",
            amount: 0,
            multiplier: 1,
            mp_cost: 0,
          }
        : kind === "items"
          ? {
              ...base,
              skill_id:
                catalog.skills.find((s) => s.effect !== "equip_attack")?.id ??
                "",
              kind: "consumable",
              price: null,
            }
          : { ...base, icon: "ghost", boss: false, attack_skill_id: null };
    setCatalog({ ...catalog, [kind]: [...catalog[kind], item] });
    setSaved(false);
  }
  return (
    <section
      className="mx-auto max-w-5xl space-y-4 p-4 sm:p-6"
      aria-label={`${names[kind]}定義`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{names[kind]}</h2>
        <Button
          type="button"
          disabled={
            !catalog || saving || (kind === "items" && !catalog.skills.length)
          }
          onClick={add}
        >
          追加
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      {!catalog && !error && <p>読み込み中…</p>}
      {catalog && (
        <form onSubmit={save} className="space-y-4">
          <fieldset disabled={saving} className="space-y-4">
            {catalog[kind].map((item) => (
              <article
                key={item.id}
                className="space-y-4 rounded-xl border p-4"
                aria-label={item.name}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <IconPicker
                    label={`${item.name}の素材`}
                    value={item.icon}
                    onChange={(icon) => update(item.id, { icon })}
                  />
                  <label
                    htmlFor={`${item.id}-name`}
                    className="min-w-40 flex-1 text-sm"
                  >
                    名前
                    <Input
                      id={`${item.id}-name`}
                      required
                      maxLength={80}
                      value={item.name}
                      onChange={(e) =>
                        update(item.id, { name: e.target.value })
                      }
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) =>
                        update(item.id, { enabled: e.target.checked })
                      }
                    />
                    有効
                  </label>
                </div>
                {"effect" in item && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <label className="grid gap-1 text-sm">
                      効果
                      <select
                        className={selectClass}
                        value={item.effect}
                        onChange={(e) => {
                          const effect = e.target
                            .value as SkillDefinition["effect"];
                          update(item.id, {
                            effect,
                            target: ["attack", "debuff", "ailment"].includes(
                              effect,
                            )
                              ? "enemy"
                              : "self",
                            stat: "attack",
                            ...(effect === "ailment"
                              ? { ailment: "poison", amount: item.amount || 5 }
                              : {}),
                            amount_mode: [
                              "recover_moves",
                              "equip_attack",
                            ].includes(effect)
                              ? "fixed"
                              : (item.amount_mode ?? "fixed"),
                          });
                        }}
                      >
                        {Object.entries(effectLabels).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                    {["attack", "debuff", "ailment"].includes(item.effect) && (
                      <label className="grid gap-1 text-sm">
                        対象
                        <select
                          className={selectClass}
                          value={item.target}
                          onChange={(e) =>
                            update(item.id, {
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
                    {item.effect === "attack" && (
                      <label
                        htmlFor={`${item.id}-multiplier`}
                        className="text-sm"
                      >
                        攻撃倍率
                        <Input
                          id={`${item.id}-multiplier`}
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          required
                          value={
                            Number.isFinite(item.multiplier)
                              ? item.multiplier
                              : ""
                          }
                          onChange={(e) =>
                            update(item.id, {
                              multiplier: e.target.valueAsNumber,
                            })
                          }
                        />
                      </label>
                    )}
                    <label htmlFor={`${item.id}-amount`} className="text-sm">
                      {item.effect === "attack" ? "加算ダメージ" : "効果量"}
                      <Input
                        id={`${item.id}-amount`}
                        type="number"
                        min={0}
                        max={10000}
                        required
                        value={Number.isFinite(item.amount) ? item.amount : ""}
                        onChange={(e) =>
                          update(item.id, { amount: e.target.valueAsNumber })
                        }
                      />
                    </label>
                    {!["recover_moves", "equip_attack"].includes(
                      item.effect,
                    ) && (
                      <label className="grid gap-1 text-sm">
                        効果量の指定
                        <select
                          className={selectClass}
                          value={item.amount_mode ?? "fixed"}
                          onChange={(e) =>
                            update(item.id, {
                              amount_mode: e.target
                                .value as SkillDefinition["amount_mode"],
                            })
                          }
                        >
                          <option value="fixed">固定値</option>
                          <option value="percent">ステータスの割合（%）</option>
                        </select>
                      </label>
                    )}
                    {["buff", "debuff", "ailment"].includes(item.effect) && (
                      <>
                        {item.effect !== "ailment" && (
                          <label className="grid gap-1 text-sm">
                            対象ステータス
                            <select
                              className={selectClass}
                              value={item.stat ?? "attack"}
                              onChange={(e) =>
                                update(item.id, {
                                  stat: e.target
                                    .value as SkillDefinition["stat"],
                                })
                              }
                            >
                              <option value="attack">攻撃力</option>
                              {item.effect === "buff" && (
                                <option value="defense">守備力</option>
                              )}
                            </select>
                          </label>
                        )}
                        <label
                          htmlFor={`${item.id}-duration`}
                          className="grid gap-1 text-sm"
                        >
                          持続ターン
                          <Input
                            id={`${item.id}-duration`}
                            type="number"
                            min={1}
                            max={20}
                            required
                            value={
                              Number.isFinite(item.duration_turns ?? 3)
                                ? (item.duration_turns ?? 3)
                                : ""
                            }
                            onChange={(e) =>
                              update(item.id, {
                                duration_turns: e.target.valueAsNumber,
                              })
                            }
                          />
                        </label>
                        <label
                          htmlFor={`${item.id}-stacks`}
                          className="grid gap-1 text-sm"
                        >
                          重複上限（1＝重複せず更新）
                          <Input
                            id={`${item.id}-stacks`}
                            type="number"
                            min={1}
                            max={10}
                            required
                            value={
                              Number.isFinite(item.stack_limit ?? 1)
                                ? (item.stack_limit ?? 1)
                                : ""
                            }
                            onChange={(e) =>
                              update(item.id, {
                                stack_limit: e.target.valueAsNumber,
                              })
                            }
                          />
                        </label>
                      </>
                    )}
                    <label htmlFor={`${item.id}-mp`} className="text-sm">
                      消費MP
                      <Input
                        id={`${item.id}-mp`}
                        type="number"
                        min={0}
                        max={10000}
                        required
                        value={
                          Number.isFinite(item.mp_cost) ? item.mp_cost : ""
                        }
                        onChange={(e) =>
                          update(item.id, { mp_cost: e.target.valueAsNumber })
                        }
                      />
                    </label>
                  </div>
                )}
                {"effect" in item && (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.requires_specialty ?? false}
                      onChange={(e) =>
                        update(item.id, {
                          requires_specialty: e.target.checked,
                        })
                      }
                    />
                    ボス撃破で開放
                  </label>
                )}
                {"effect" in item &&
                  [
                    "attack",
                    "heal_hp",
                    "heal_mp",
                    "buff",
                    "debuff",
                    "ailment",
                  ].includes(item.effect) && (
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.castable !== false}
                        onChange={(e) =>
                          update(item.id, { castable: e.target.checked })
                        }
                      />
                      ガンビットから直接使用（オフならアイテム専用）
                    </label>
                  )}
                {"skill_id" in item && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="grid gap-1 text-sm">
                      種類
                      <select
                        className={selectClass}
                        value={item.kind}
                        onChange={(e) => {
                          const value = e.target
                            .value as ItemDefinition["kind"];
                          const skill = catalog.skills.find(
                            (s) =>
                              (s.effect === "equip_attack") ===
                              (value === "weapon"),
                          );
                          update(item.id, {
                            kind: value,
                            skill_id: skill?.id ?? "",
                          });
                        }}
                      >
                        <option value="consumable">消耗品</option>
                        <option value="weapon">武器</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-sm">
                      発動スキル
                      <select
                        className={selectClass}
                        required
                        value={item.skill_id}
                        onChange={(e) =>
                          update(item.id, { skill_id: e.target.value })
                        }
                      >
                        <option value="" disabled>
                          選択
                        </option>
                        {catalog.skills
                          .filter(
                            (s) =>
                              (s.effect === "equip_attack") ===
                              (item.kind === "weapon"),
                          )
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                              {!s.enabled && "（無効）"}
                            </option>
                          ))}
                      </select>
                    </label>
                    <label htmlFor={`${item.id}-price`} className="text-sm">
                      価格（空欄は非売品）
                      <Input
                        id={`${item.id}-price`}
                        type="number"
                        min={0}
                        max={1000000}
                        value={
                          item.price !== null && Number.isFinite(item.price)
                            ? item.price
                            : ""
                        }
                        onChange={(e) =>
                          update(item.id, {
                            price:
                              e.target.value === ""
                                ? null
                                : e.target.valueAsNumber,
                          })
                        }
                      />
                    </label>
                  </div>
                )}
                {"boss" in item && (
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.boss}
                        onChange={(e) =>
                          update(item.id, { boss: e.target.checked })
                        }
                      />
                      ボス用
                    </label>
                    <label className="grid gap-1 text-sm">
                      攻撃スキル
                      <select
                        className={selectClass}
                        value={item.attack_skill_id ?? ""}
                        onChange={(e) =>
                          update(item.id, {
                            attack_skill_id: e.target.value || null,
                          })
                        }
                      >
                        <option value="">通常攻撃</option>
                        {catalog.skills
                          .filter((s) => s.effect === "attack")
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                      </select>
                    </label>
                  </div>
                )}
              </article>
            ))}
          </fieldset>
          <div className="flex justify-center">
            <Button type="submit" disabled={saving}>
              {saving ? "保存中…" : "保存"}
            </Button>
          </div>
          {saved && <output className="block text-center">保存しました</output>}
        </form>
      )}
    </section>
  );
}
