import { type DungeonMap, PLACES_PER_REGION } from "./exploration";

export const BOSS_LEVELS = [5, 10, 15, 20] as const;

/** Anchor each boss to the place that actually unlocks its achievement. */
export function mapBosses(map: DungeonMap) {
  return BOSS_LEVELS.flatMap((level) => {
    const place = map.places[level * PLACES_PER_REGION - 1];
    if (!place) return [];
    return [
      {
        id: `@boss:${level}`,
        level,
        region: place.region,
        last: place.id,
      },
    ];
  });
}
