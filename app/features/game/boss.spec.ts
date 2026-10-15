import { expect, it, vi } from "vitest";
import { mapBosses } from "./boss";
import { ENTRANCE, PLACES_PER_REGION } from "./exploration";

vi.mock("./exploration", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./exploration")>()),
  PLACES_PER_REGION: 3,
}));

it("anchors bosses to the unlock threshold using the configured region size", () => {
  const places = Array.from({ length: 10 * PLACES_PER_REGION }, (_, i) => ({
    id: `p${i}`,
    region: Math.floor(i / PLACES_PER_REGION),
  }));
  const map = { current: ENTRANCE, places, edges: [] };
  expect(
    mapBosses({ ...map, places: places.slice(0, 5 * PLACES_PER_REGION - 1) }),
  ).toEqual([]);
  expect(mapBosses(map)).toEqual([
    { id: "@boss:5", level: 5, region: 4, last: "p14" },
    { id: "@boss:10", level: 10, region: 9, last: "p29" },
  ]);
});

it("uses the actual unlock place's region on a legacy map", () => {
  const places = Array.from({ length: 5 * PLACES_PER_REGION }, (_, i) => ({
    id: `p${i}`,
    region: 2,
  }));
  expect(mapBosses({ current: ENTRANCE, places, edges: [] })[0]).toMatchObject({
    level: 5,
    region: 2,
    last: places.at(-1)?.id,
  });
});
