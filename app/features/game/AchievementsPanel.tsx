import type { Growth } from "~/features/gamification/ResourceGrowth";
import { canonicalSentenceId } from "~/features/tanbun/detail/cache";
import type { GameSave } from "./domain";

export default function AchievementsPanel({
  save,
  resources,
}: {
  save: GameSave;
  resources: Growth[];
}) {
  const resourceNames = new Map(
    resources.map((resource) => [
      canonicalSentenceId(resource.resource_id),
      resource.resource_name || "ダンジョン",
    ]),
  );
  const clears = Object.entries(save.clears).filter(([, count]) => count > 0);
  const totalClears = clears.reduce((total, [, count]) => total + count, 0);
  const bosses = Object.entries(save.bossClears ?? {}).flatMap(
    ([resourceId, levels]) => levels.map((level) => ({ resourceId, level })),
  );
  const unlocked = save.unlockedDungeons ?? [];

  return (
    <div className="space-y-4">
      <section
        className="rounded-lg border p-4"
        aria-labelledby="dungeon-records"
      >
        <h3 id="dungeon-records" className="font-medium">
          ダンジョン攻略
        </h3>
        <p className="mt-1 text-2xl font-semibold tabular-nums">
          {totalClears}回
        </p>
        {clears.length > 0 && (
          <ul className="mt-3 divide-y text-sm">
            {clears.map(([resourceId, count]) => (
              <li
                key={resourceId}
                className="flex justify-between gap-3 py-2 first:pt-0 last:pb-0"
              >
                <span className="truncate">
                  {resourceNames.get(canonicalSentenceId(resourceId)) ??
                    "ダンジョン"}
                </span>
                <span className="shrink-0 tabular-nums">{count}回</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border p-4" aria-labelledby="boss-records">
        <h3 id="boss-records" className="font-medium">
          ボス撃破
        </h3>
        <p className="mt-1 text-2xl font-semibold tabular-nums">
          {bosses.length}体
        </p>
        {bosses.length > 0 && (
          <ul className="mt-3 divide-y text-sm">
            {bosses.map(({ resourceId, level }) => (
              <li
                key={`${resourceId}-${level}`}
                className="flex justify-between gap-3 py-2 first:pt-0 last:pb-0"
              >
                <span className="truncate">
                  {resourceNames.get(canonicalSentenceId(resourceId)) ??
                    "ダンジョン"}
                </span>
                <span className="shrink-0">達成度 {level}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className="rounded-lg border p-4"
        aria-labelledby="unlocked-records"
      >
        <h3 id="unlocked-records" className="font-medium">
          開放したダンジョン
        </h3>
        <p className="mt-1 text-2xl font-semibold tabular-nums">
          {unlocked.length}件
        </p>
        {unlocked.length > 0 && (
          <ul className="mt-3 divide-y text-sm">
            {unlocked.map((dungeon) => (
              <li
                key={dungeon.resourceId}
                className="flex justify-between gap-3 py-2 first:pt-0 last:pb-0"
              >
                <span className="truncate">{dungeon.name}</span>
                <span className="shrink-0">達成度 {dungeon.achievement}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
