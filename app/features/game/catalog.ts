import { networkFetch } from "~/shared/lib/networkFetch";
import { spriteAnimationLabels } from "./effectAssets";

export type SkillDefinition = {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  effect:
    | "attack"
    | "heal_hp"
    | "heal_mp"
    | "recover_moves"
    | "equip_attack"
    | "buff"
    | "debuff"
    | "ailment";
  target: "enemy" | "all_enemies" | "self";
  amount: number;
  multiplier: number;
  mp_cost: number;
  animation?: SkillAnimation;
  amount_mode?: "fixed" | "percent";
  stat?: "attack" | "defense" | "maxHp";
  duration_turns?: number;
  stack_limit?: number;
  ailment?: "poison";
};
export type ItemDefinition = {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  skill_id: string;
  kind: "weapon" | "consumable";
  price: number | null;
};
export type EnemyDefinition = {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  boss: boolean;
  attack_skill_id: string | null;
};
export type GameCatalog = {
  skills: SkillDefinition[];
  items: ItemDefinition[];
  enemies: EnemyDefinition[];
  player_skills?: { skill_id: string; enabled: boolean }[];
  specialty_skills?: SpecialtySkillUse[];
  triggers?: {
    id: string;
    name: string;
    condition: GambitRule["condition"];
    threshold: number;
    enabled: boolean;
  }[];
};
export type SpecialtySkillUse = {
  skill_id: string;
  enabled: boolean;
  quiz_required: boolean;
  quiz_seconds: number;
  wrong_multiplier: number;
  power_coefficient: number;
};
export const animationLabels = {
  none: "なし",
  slash: "斬撃",
  impact: "打撃",
  fire: "炎",
  lightning: "雷",
  heal: "回復の光",
  ripple: "回復の波紋",
  buff: "上昇オーラ",
  debuff: "下降オーラ",
  poison: "毒の煙",
  ...spriteAnimationLabels,
} as const;
export type SkillAnimation = keyof typeof animationLabels;
export type GambitRule = {
  enabled: boolean;
  condition:
    | "always"
    | "hp_below"
    | "mp_below"
    | "enemy_count"
    | "buff_present"
    | "buff_absent"
    | "poisoned";
  threshold: number;
  action: "skill" | "item" | "specialty";
  definition_id: string;
  trigger_id?: string | null;
};
export type BattleAction = {
  skill: SkillDefinition;
  item_id: string | null;
  name: string;
};
export const effectLabels: Record<SkillDefinition["effect"], string> = {
  attack: "攻撃",
  heal_hp: "HP回復",
  heal_mp: "MP回復",
  recover_moves: "歩数回復",
  equip_attack: "装備：攻撃力",
  buff: "buff：能力向上",
  debuff: "debuff：能力低下",
  ailment: "状態変化：毒",
};
export async function requestGameCatalog(
  admin = false,
  value?: GameCatalog,
): Promise<GameCatalog> {
  const base =
    import.meta.env.VITE_API_BASE_URL ?? "https://knowde.onrender.com";
  const response = await networkFetch(
    `${base}/${admin ? "admin/game" : "game"}/catalog`,
    {
      credentials: "include",
      cache: "no-store",
      ...(value
        ? {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value),
          }
        : {}),
    },
  );
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      typeof body?.detail === "string"
        ? body.detail
        : "ゲーム定義を読み書きできませんでした。",
    );
  }
  return response.json();
}

/** Only the selected attack action changes outgoing damage; answers still decide hits. */
export function actionDamage(
  damage: number,
  action: BattleAction | null | undefined,
  enemyId: string,
  firstEnemyId?: string,
  sourceAttack = damage,
) {
  if (
    !action ||
    action.skill.effect !== "attack" ||
    (action.skill.target === "enemy" && enemyId !== firstEnemyId)
  )
    return damage;
  return Math.min(
    100000,
    Math.max(
      1,
      Math.floor(damage * action.skill.multiplier) +
        effectAmount(action.skill, sourceAttack),
    ),
  );
}

export type BattleEffect = {
  skill: SkillDefinition;
  target_id: string;
  starts_turn: number;
  expires_turn: number;
};
export function effectAmount(skill: SkillDefinition, base: number) {
  return skill.amount_mode === "percent"
    ? Math.floor((base * skill.amount) / 100)
    : skill.amount;
}
export function modifiedStat(
  base: number,
  battle: { turn: number; effects?: BattleEffect[] } | null | undefined,
  target: string,
  stat: string,
) {
  const change = (battle?.effects ?? [])
    .filter(
      (e) =>
        e.target_id === target &&
        e.skill.stat === stat &&
        ["buff", "debuff"].includes(e.skill.effect) &&
        e.starts_turn <= (battle?.turn ?? 0) &&
        (battle?.turn ?? 0) < e.expires_turn,
    )
    .reduce(
      (sum, e) =>
        sum +
        effectAmount(e.skill, base) * (e.skill.effect === "buff" ? 1 : -1),
      0,
    );
  return Math.max(0, Math.min(100000, base + change));
}

export function poisonDamage(
  maximumHp: number,
  battle: { turn: number; effects?: BattleEffect[] } | null | undefined,
  target: string,
) {
  return Math.min(
    100000,
    (battle?.effects ?? [])
      .filter(
        (e) =>
          e.target_id === target &&
          e.skill.effect === "ailment" &&
          e.starts_turn <= (battle?.turn ?? 0) &&
          (battle?.turn ?? 0) < e.expires_turn,
      )
      .reduce((sum, e) => sum + effectAmount(e.skill, maximumHp), 0),
  );
}
