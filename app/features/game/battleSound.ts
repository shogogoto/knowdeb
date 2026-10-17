import type { SkillAnimation, SkillDefinition, SkillSound } from "./catalog";

type Preset = Exclude<SkillSound, "auto" | "none">;
/** Locally hosted CC0 recordings; provenance: public/game-assets/sounds/SOURCES.md. */
export const battleSoundFiles: Record<Preset, string> = {
  impact: "/game-assets/sounds/impact.wav",
  slash: "/game-assets/sounds/slash.wav",
  fire: "/game-assets/sounds/fire.wav",
  lightning: "/game-assets/sounds/lightning.wav",
  heal: "/game-assets/sounds/heal.wav",
  buff: "/game-assets/sounds/buff.wav",
  debuff: "/game-assets/sounds/debuff.wav",
  poison: "/game-assets/sounds/poison.wav",
  curse: "/game-assets/sounds/curse.wav",
};
const animationSounds: Partial<Record<SkillAnimation, Preset>> = {
  slash: "slash",
  fire: "fire",
  lightning: "lightning",
  oga_slash_1: "slash",
  oga_slash_2: "slash",
  oga_slash_3: "slash",
  oga_slash_4: "slash",
  oga_slash_5: "slash",
  oga_spell_2: "fire",
  oga_spell_3: "fire",
  oga_spell_4: "fire",
  oga_spell_5: "fire",
  oga_spell_6: "fire",
  oga_spell_8: "lightning",
  oga_effect_5: "fire",
  oga_arcane_5: "lightning",
};
const voices = new Set<HTMLAudioElement>();
const maxVoices = 8;

export function stopBattleSounds(): void {
  for (const audio of voices) {
    audio.pause();
    audio.onended = null;
    audio.onerror = null;
  }
  voices.clear();
}

export function playSkillSound(
  skill: Pick<SkillDefinition, "sound" | "effect" | "animation"> & {
    ailment?: "poison" | "curse";
  },
  correct = true,
  impactLevel = 0,
): void {
  const sound = skill.sound ?? "auto";
  if (sound === "none") return;
  const automatic: Partial<Record<SkillDefinition["effect"], Preset>> = {
    heal_hp: "heal",
    heal_mp: "heal",
    buff: "buff",
    debuff: "debuff",
    ailment: skill.ailment ?? "poison",
  };
  playBattleSound(
    correct,
    impactLevel,
    sound === "auto"
      ? (automatic[skill.effect] ??
          (skill.animation && animationSounds[skill.animation]) ??
          "impact")
      : sound,
  );
}

export function playBattleSound(
  correct: boolean,
  impactLevel = 0,
  sound: Preset = "impact",
): void {
  if (typeof window === "undefined" || !window.Audio) return;
  try {
    if (voices.size >= maxVoices) {
      const oldest = voices.values().next().value;
      oldest?.pause();
      if (oldest) voices.delete(oldest);
    }
    const audio = new window.Audio(battleSoundFiles[sound]);
    audio.volume = correct
      ? 0.55 + Math.max(0, Math.min(3, impactLevel)) * 0.1
      : 0.7;
    const release = () => {
      voices.delete(audio);
      audio.onended = null;
      audio.onerror = null;
    };
    audio.onended = release;
    audio.onerror = release;
    voices.add(audio);
    // Autoplay denial or a missing asset must never interrupt a quiz.
    void audio.play().catch(release);
  } catch {
    // Audio is optional, including on browsers without media playback.
  }
}
