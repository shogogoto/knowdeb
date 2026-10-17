import { canonicalSentenceId } from "~/features/tanbun/detail/cache";
import type { GameSave } from "./domain";

/** Use the same explored-place count for map cards and the achievements tab. */
export function exploredPlaceCount(save: GameSave, resourceId: string): number {
  const key = canonicalSentenceId(resourceId);
  const counts = [
    ...Object.entries(save.maps ?? {})
      .filter(([id]) => canonicalSentenceId(id) === key)
      .map(([, map]) => map.places.length),
    ...Object.values(save.dungeons ?? {})
      .filter((dungeon) => canonicalSentenceId(dungeon.run.resourceId) === key)
      .map((dungeon) => new Set(dungeon.run.readIds).size),
    ...(save.run && canonicalSentenceId(save.run.resourceId) === key
      ? [new Set(save.run.readIds).size]
      : []),
  ];
  return Math.max(0, ...counts);
}
