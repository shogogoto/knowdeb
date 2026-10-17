import { expect, it } from "vitest";
import {
  type SkillDefinition,
  actionDamage,
  effectAmount,
  modifiedStat,
  normalizeSkill,
  poisonDamage,
} from "./catalog";
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

it("ticks poison separately from stats only during its active turns", () => {
  const skill: SkillDefinition = normalizeSkill({
    ...sampleCatalog.skills[0],
    effect: "ailment",
    amount_mode: "percent",
    amount: 10,
  });
  const e = { skill, target_id: "enemy", starts_turn: 1, expires_turn: 3 };
  expect(poisonDamage(50, { turn: 0, effects: [e] }, "enemy")).toBe(0);
  expect(poisonDamage(50, { turn: 1, effects: [e, e] }, "enemy")).toBe(10);
  expect(poisonDamage(50, { turn: 3, effects: [e] }, "enemy")).toBe(0);
  expect(modifiedStat(20, { turn: 1, effects: [e] }, "enemy", "attack")).toBe(
    20,
  );
});

it("applies additive percentage changes against the original stat for their duration", () => {
  const skill: SkillDefinition = normalizeSkill({
    ...sampleCatalog.skills[0],
    effect: "buff",
    target: "self",
    stat: "attack",
    amount_mode: "percent",
    amount: 50,
  });
  const effect = {
    skill,
    target_id: "player",
    starts_turn: 1,
    expires_turn: 3,
  };
  expect(
    modifiedStat(10, { turn: 0, effects: [effect] }, "player", "attack"),
  ).toBe(10);
  expect(
    modifiedStat(
      10,
      { turn: 1, effects: [effect, effect] },
      "player",
      "attack",
    ),
  ).toBe(20);
  expect(
    modifiedStat(10, { turn: 1, effects: [effect] }, "player", "defense"),
  ).toBe(10);
  expect(
    modifiedStat(10, { turn: 3, effects: [effect] }, "player", "attack"),
  ).toBe(10);
  expect(effectAmount(skill, 35)).toBe(17);
});
