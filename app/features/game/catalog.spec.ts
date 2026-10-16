import { expect, it } from "vitest";
import { actionDamage } from "./catalog";
import { sampleCatalog } from "./catalog.fixtures";

it("boosts only the selected target or all enemies without affecting ordinary attacks", () => {
  const action = {
    name: "ファイア",
    item_id: null,
    skill: { ...sampleCatalog.skills[0], multiplier: 2, amount: 3 },
  };
  expect(actionDamage(10, action, "a", "a")).toBe(23);
  expect(actionDamage(10, action, "b", "a")).toBe(10);
  expect(
    actionDamage(
      10,
      { ...action, skill: { ...action.skill, target: "all_enemies" } },
      "b",
      "a",
    ),
  ).toBe(23);
  expect(
    actionDamage(10, { ...action, skill: sampleCatalog.skills[1] }, "a", "a"),
  ).toBe(10);
  expect(actionDamage(10, null, "a", "a")).toBe(10);
});
