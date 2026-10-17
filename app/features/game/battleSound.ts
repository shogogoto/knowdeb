import type { SkillDefinition, SkillSound } from "./catalog";

type Preset = Exclude<SkillSound, "auto" | "none">;
const presets: Record<
  Preset,
  {
    frequency: number;
    end: number;
    filter: number;
    noise: number;
    duration: number;
    weight: number;
  }
> = {
  impact: {
    frequency: 110,
    end: 40,
    filter: 1500,
    noise: 0.18,
    duration: 0.12,
    weight: 0.12,
  },
  slash: {
    frequency: 160,
    end: 60,
    filter: 4500,
    noise: 0.22,
    duration: 0.16,
    weight: 0.08,
  },
  fire: {
    frequency: 80,
    end: 35,
    filter: 700,
    noise: 0.26,
    duration: 0.4,
    weight: 0.1,
  },
  lightning: {
    frequency: 65,
    end: 30,
    filter: 5000,
    noise: 0.32,
    duration: 0.22,
    weight: 0.13,
  },
  heal: {
    frequency: 440,
    end: 880,
    filter: 1800,
    noise: 0.015,
    duration: 0.4,
    weight: 0.07,
  },
  buff: {
    frequency: 330,
    end: 660,
    filter: 2400,
    noise: 0.025,
    duration: 0.3,
    weight: 0.07,
  },
  debuff: {
    frequency: 220,
    end: 80,
    filter: 600,
    noise: 0.08,
    duration: 0.3,
    weight: 0.07,
  },
  poison: {
    frequency: 160,
    end: 65,
    filter: 450,
    noise: 0.06,
    duration: 0.3,
    weight: 0.08,
  },
  curse: {
    frequency: 110,
    end: 35,
    filter: 350,
    noise: 0.1,
    duration: 0.45,
    weight: 0.1,
  },
};

export function playSkillSound(
  skill: Pick<SkillDefinition, "sound" | "effect"> & {
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
    sound === "auto" ? (automatic[skill.effect] ?? "impact") : sound,
  );
}

/** Short local Web Audio presets; no downloads or third-party audio licences. */
export function playBattleSound(
  correct: boolean,
  impactLevel = 0,
  sound: Preset = "impact",
): void {
  if (typeof window === "undefined" || !window.AudioContext) return;
  let context: AudioContext | undefined;
  try {
    context = new window.AudioContext();
    const audio = context;
    const level = Math.max(0, Math.min(3, impactLevel));
    const preset = presets[sound];
    const now = audio.currentTime;
    const duration = correct
      ? preset.duration + level * 0.025
      : Math.max(0.18, preset.duration);
    const buffer = audio.createBuffer(
      1,
      Math.ceil(audio.sampleRate * duration),
      audio.sampleRate,
    );
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    const crack = audio.createBufferSource();
    crack.buffer = buffer;
    const filter = audio.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = correct
      ? preset.filter + level * 350
      : preset.filter * 0.67;
    filter.Q.value = 0.6;
    const envelope = audio.createGain();
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(
      correct ? preset.noise + level * 0.07 : Math.min(0.3, preset.noise * 1.5),
      now + 0.003,
    );
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    crack.connect(filter);
    filter.connect(envelope);
    envelope.connect(audio.destination);
    const body = audio.createOscillator();
    body.type = "sine";
    body.frequency.setValueAtTime(
      correct ? preset.frequency + level * 15 : preset.frequency * 0.77,
      now,
    );
    body.frequency.exponentialRampToValueAtTime(preset.end, now + duration);
    const weight = audio.createGain();
    weight.gain.setValueAtTime(0.0001, now);
    weight.gain.exponentialRampToValueAtTime(
      preset.weight + level * 0.035,
      now + 0.004,
    );
    weight.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    body.connect(weight);
    weight.connect(audio.destination);
    crack.onended = () => {
      void audio.close().catch(() => undefined);
    };
    crack.start(now);
    crack.stop(now + duration + 0.02);
    body.start(now);
    body.stop(now + duration);
    void audio.resume().catch(() => {
      void audio.close().catch(() => undefined);
    });
  } catch {
    if (context) void context.close().catch(() => undefined);
  }
}
