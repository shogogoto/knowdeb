import type { GameCatalog } from "./catalog";

/** Isolated examples for UI stories and tests, never used as live fallbacks. */
export const sampleCatalog: GameCatalog = {
  skills: [
    {
      id: "fire",
      name: "ファイア",
      icon: "flame",
      enabled: true,
      effect: "attack",
      target: "enemy",
      amount: 0,
      multiplier: 1.5,
      mp_cost: 3,
    },
    {
      id: "heal",
      name: "ケアル",
      icon: "heart",
      enabled: true,
      effect: "heal_hp",
      target: "self",
      amount: 20,
      multiplier: 1,
      mp_cost: 3,
    },
    {
      id: "potion",
      name: "薬の回復",
      icon: "flask",
      enabled: true,
      effect: "heal_hp",
      target: "self",
      amount: 20,
      multiplier: 1,
      mp_cost: 0,
    },
  ],
  player_skills: [
    { skill_id: "fire", enabled: true },
    { skill_id: "heal", enabled: true },
  ],
  specialty_skills: [],
  items: [
    {
      id: "healing_potion",
      name: "回復薬",
      icon: "flask",
      enabled: true,
      skill_id: "potion",
      kind: "consumable",
      price: 30,
    },
  ],
  enemies: [
    {
      id: "ghost",
      name: "ゴースト",
      icon: "ghost",
      enabled: true,
      boss: false,
      attack_skill_id: null,
    },
  ],
};
