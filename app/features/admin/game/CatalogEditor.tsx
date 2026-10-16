import { useEffect, useState } from "react";
import { IconPicker } from "~/features/game/GameIcon";
import {
  type EnemyDefinition,
  type GameCatalog,
  type ItemDefinition,
  type SkillDefinition,
  requestGameCatalog,
} from "~/features/game/catalog";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import SkillTables from "./SkillTables";

type Kind = "skills" | "items" | "enemies";
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
  function add(effect: SkillDefinition["effect"] = "attack") {
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
            effect,
            target: ["attack", "debuff", "ailment"].includes(effect)
              ? "enemy"
              : "self",
            amount: effect === "ailment" ? 5 : 0,
            multiplier: 1,
            mp_cost: 0,
            animation: "none",
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
      className={`mx-auto w-full min-w-0 space-y-4 p-4 sm:p-6 ${kind === "skills" ? "max-w-[96rem]" : "max-w-5xl"}`}
      aria-label={`${names[kind]}定義`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{names[kind]}</h2>
        {kind !== "skills" && (
          <Button
            type="button"
            disabled={
              !catalog || saving || (kind === "items" && !catalog.skills.length)
            }
            onClick={() => add()}
          >
            追加
          </Button>
        )}
      </div>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      {!catalog && !error && <p>読み込み中…</p>}
      {catalog && (
        <form onSubmit={save} className="space-y-4">
          <fieldset disabled={saving} className="min-w-0 space-y-4">
            {kind === "skills" && (
              <SkillTables skills={catalog.skills} update={update} add={add} />
            )}
            {catalog[kind]
              .filter(() => kind !== "skills")
              .map((item) => (
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
