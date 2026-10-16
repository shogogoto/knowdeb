import { useEffect, useState } from "react";
import {
  type EnemyDefinition,
  type GameCatalog,
  type ItemDefinition,
  type SkillDefinition,
  requestGameCatalog,
} from "~/features/game/catalog";
import { Button } from "~/shared/components/ui/button";
import DefinitionTables from "./DefinitionTables";
import ShopTable from "./ShopTable";
import SkillTables from "./SkillTables";

type Kind = "skills" | "items" | "enemies" | "shop";
const names = {
  skills: "スキル",
  items: "アイテム",
  enemies: "敵",
  shop: "ショップ",
};
export default function CatalogEditor({ kind }: { kind: Kind }) {
  const [catalog, setCatalog] = useState<GameCatalog>();
  const [deletions, setDeletions] = useState(new Set<string>());
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
  function change(next: GameCatalog) {
    setCatalog(next);
    setSaved(false);
    setError(undefined);
  }
  const update = (
    id: string,
    patch: Partial<SkillDefinition & ItemDefinition & EnemyDefinition>,
  ) => {
    if (!catalog || kind === "shop") return;
    change({
      ...catalog,
      [kind]: catalog[kind].map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    });
  };
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!catalog || saving) return;
    const references = [
      ...catalog.items
        .filter((i) => deletions.has(i.skill_id))
        .map((i) => `アイテム「${i.name}」`),
      ...catalog.enemies
        .filter((e) => e.attack_skill_id && deletions.has(e.attack_skill_id))
        .map((e) => `敵「${e.name}」`),
    ];
    if (references.length) {
      setError(
        `削除するスキルを${references.join("、")}が使用しています。先に参照を変更してください。`,
      );
      return;
    }
    setSaving(true);
    setError(undefined);
    setSaved(false);
    try {
      const next = deletions.size
        ? {
            ...catalog,
            skills: catalog.skills.filter((s) => !deletions.has(s.id)),
            player_skills: catalog.player_skills?.filter(
              (u) => !deletions.has(u.skill_id),
            ),
            specialty_skills: catalog.specialty_skills?.filter(
              (u) => !deletions.has(u.skill_id),
            ),
          }
        : catalog;
      setCatalog(await requestGameCatalog(true, next));
      setDeletions(new Set());
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
    if (!catalog || kind === "shop") return;
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
            }
          : { ...base, icon: "ghost", boss: false, attack_skill_id: null };
    change({ ...catalog, [kind]: [...catalog[kind], item] });
  }
  return (
    <section
      className={`mx-auto w-full min-w-0 space-y-4 p-4 sm:p-6 ${kind === "skills" ? "max-w-[96rem]" : "max-w-5xl"}`}
      aria-label={`${names[kind]}定義`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{names[kind]}</h2>
        {kind !== "skills" && kind !== "shop" && (
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
              <SkillTables
                skills={catalog.skills}
                update={update}
                add={add}
                deletions={deletions}
                toggleDelete={(id) => {
                  setDeletions((current) => {
                    const next = new Set(current);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                  });
                  setSaved(false);
                  setError(undefined);
                }}
              />
            )}
            {(kind === "items" || kind === "enemies") && (
              <DefinitionTables kind={kind} catalog={catalog} update={update} />
            )}
            {kind === "shop" && (
              <ShopTable
                catalog={catalog}
                onChange={(shop) => change({ ...catalog, shop })}
              />
            )}
          </fieldset>
          {deletions.size > 0 && (
            <output className="block text-sm text-muted-foreground">
              削除予約 {deletions.size}件 · 保存で確定します。
            </output>
          )}
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
