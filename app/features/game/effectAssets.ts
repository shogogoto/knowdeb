import manifest from "./effectSpriteManifest.json";

/** Stable IDs shared with the server allow-list; existing CSS IDs stay valid. */
export const spriteAnimationLabels = {
  oga_slash_1: "弧の斬撃",
  oga_slash_2: "回転斬撃",
  oga_slash_3: "残像斬撃",
  oga_slash_4: "突き",
  oga_slash_5: "一閃",
  oga_spell_1: "蒼い光柱",
  oga_spell_2: "炎の刃",
  oga_spell_3: "火球",
  oga_spell_4: "炎の紋章",
  oga_spell_5: "交差する炎",
  oga_spell_6: "炎の奔流",
  oga_spell_7: "エネルギー球",
  oga_spell_8: "雷球",
  oga_spell_9: "雨滴",
  oga_spell_10: "黒煙",
  oga_effect_1: "爆発",
  oga_effect_2: "大爆発",
  oga_effect_3: "緑の衝撃波",
  oga_effect_4: "氷の噴出",
  oga_effect_5: "炎のオーラ",
} as const satisfies Record<keyof typeof manifest, string>;
export type SpriteAnimation = keyof typeof spriteAnimationLabels;
export function spriteAsset(animation: string) {
  if (!Object.hasOwn(manifest, animation)) return undefined;
  const id = animation as SpriteAnimation;
  return {
    ...manifest[id],
    src: `/game-assets/effects/${id}.webp`,
    poster: `/game-assets/effects/${id}-poster.webp`,
    label: spriteAnimationLabels[id],
  };
}
