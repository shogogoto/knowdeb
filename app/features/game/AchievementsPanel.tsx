import type { Growth } from "~/features/gamification/ResourceGrowth";
import { canonicalSentenceId } from "~/features/tanbun/detail/cache";
import type { GameSave } from "./domain";

export default function AchievementsPanel({
  save,
  resources,
}: { save: GameSave; resources: Growth[] }) {
  const records = new Map<string, { name: string; achievement: number }>();
  const names = new Map(
    resources.map((r) => [canonicalSentenceId(r.resource_id), r.resource_name]),
  );
  const add = (id: string, name?: string, achievement = 0) => {
    const key = canonicalSentenceId(id);
    const previous = records.get(key);
    records.set(key, {
      name: name || previous?.name || names.get(key) || "ダンジョン",
      achievement: Math.max(previous?.achievement ?? 0, achievement),
    });
  };
  for (const dungeon of save.unlockedDungeons ?? [])
    add(dungeon.resourceId, dungeon.name, dungeon.achievement);
  for (const id of save.visitedDungeons ?? []) add(id);
  for (const id of Object.keys(save.clears)) add(id);
  for (const dungeon of Object.values(save.dungeons ?? {}))
    add(dungeon.run.resourceId, dungeon.run.name);
  if (save.run) add(save.run.resourceId, save.run.name);
  // Achievement counts explored places, not three-kill laps.
  for (const [id, map] of Object.entries(save.maps ?? {}))
    add(id, undefined, Math.floor(map.places.length / 5));
  return (
    <section aria-label="ダンジョンの達成度" className="space-y-3">
      {records.size === 0 ? (
        <p className="text-sm text-muted-foreground">
          まだダンジョンを探索していません。
        </p>
      ) : (
        <ul className="divide-y rounded-lg border px-4 text-sm">
          {[...records].map(([id, record]) => (
            <li
              key={id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <span className="min-w-0 break-words">{record.name}</span>
              <span className="shrink-0 tabular-nums">
                達成度 {record.achievement}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
