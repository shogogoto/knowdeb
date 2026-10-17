import { readFileSync } from "node:fs";
import { vi } from "vitest";
import {
  battleSoundFiles,
  playBattleSound,
  playSkillSound,
  stopBattleSounds,
} from "./battleSound";

class TestAudio {
  static instances: TestAudio[] = [];
  volume = 1;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  play = vi.fn(async () => undefined);
  pause = vi.fn();
  constructor(public src: string) {
    TestAudio.instances.push(this);
  }
}
beforeEach(() => {
  TestAudio.instances = [];
  vi.stubGlobal("Audio", TestAudio);
});
afterEach(() => {
  stopBattleSounds();
  vi.unstubAllGlobals();
});

it.each(Object.keys(battleSoundFiles) as (keyof typeof battleSoundFiles)[])(
  "plays a real, locally bundled WAV for %s",
  (sound) => {
    playSkillSound({ effect: "attack", sound });
    const audio = TestAudio.instances[0];
    expect(audio.src).toBe(battleSoundFiles[sound]);
    expect(audio.play).toHaveBeenCalledOnce();
    const wav = readFileSync(`public${audio.src}`);
    expect(wav.toString("ascii", 0, 4)).toBe("RIFF");
    expect(wav.toString("ascii", 8, 12)).toBe("WAVE");
    expect(wav.length).toBeGreaterThan(5000);
    expect(wav.length).toBeLessThan(2000000);
    expect(wav.readUInt32LE(40)).toBe(wav.length - 44);
    audio.onended?.();
    stopBattleSounds();
    expect(audio.pause).not.toHaveBeenCalled();
  },
);

it("keeps the lightning phrase and its quiet decay instead of a 1.2-second slice", () => {
  const wav = readFileSync(`public${battleSoundFiles.lightning}`);
  const seconds = wav.readUInt32LE(40) / wav.readUInt32LE(28);
  expect(seconds).toBeGreaterThan(3);
  expect(seconds).toBeLessThan(4);
  let peak = 0;
  let tail = 0;
  for (let offset = 44; offset < wav.length; offset += 2)
    peak = Math.max(peak, Math.abs(wav.readInt16LE(offset)));
  for (let offset = wav.length - 3200; offset < wav.length; offset += 2)
    tail = Math.max(tail, Math.abs(wav.readInt16LE(offset)));
  expect(tail / peak).toBeLessThan(0.02);
});

it("keeps explicitly silent skills silent", () => {
  playSkillSound({ effect: "attack", animation: "fire", sound: "none" });
  expect(TestAudio.instances).toHaveLength(0);
});

it.each([
  ["fire", "fire"],
  ["oga_spell_3", "fire"],
  ["lightning", "lightning"],
  ["oga_spell_8", "lightning"],
  ["slash", "slash"],
] as const)(
  "matches automatic %s animation to %s audio",
  (animation, sound) => {
    playSkillSound({ effect: "attack", animation });
    expect(TestAudio.instances[0].src).toBe(battleSoundFiles[sound]);
  },
);

it("prioritizes explicit sound, then effect, over animation", () => {
  playSkillSound({ effect: "attack", animation: "fire", sound: "slash" });
  playSkillSound({ effect: "heal_mp", animation: "fire" });
  playSkillSound({ effect: "ailment", ailment: "curse" });
  expect(TestAudio.instances.map((audio) => audio.src)).toEqual([
    battleSoundFiles.slash,
    battleSoundFiles.heal,
    battleSoundFiles.curse,
  ]);
});

it("uses the same impact sample for both sides without pitch shifting", () => {
  playBattleSound(true, 3);
  playBattleSound(false);
  expect(TestAudio.instances.map((audio) => audio.src)).toEqual([
    battleSoundFiles.impact,
    battleSoundFiles.impact,
  ]);
  expect(TestAudio.instances[0].volume).toBeCloseTo(0.85);
});

it("stops playing effects when music is disabled", async () => {
  const { setMusicPreferences } = await import("./music");
  playBattleSound(true);
  setMusicPreferences({ enabled: false });
  expect(TestAudio.instances[0].pause).toHaveBeenCalledOnce();
});

it("limits overlapping voices", () => {
  for (let i = 0; i < 9; i++) playBattleSound(true);
  expect(TestAudio.instances[0].pause).toHaveBeenCalledOnce();
  expect(TestAudio.instances[1].pause).not.toHaveBeenCalled();
});

it("releases rejected or failed playback without interrupting gameplay", async () => {
  playBattleSound(true);
  TestAudio.instances[0].onerror?.();
  const rejected = vi.fn().mockRejectedValue(new Error("autoplay blocked"));
  vi.stubGlobal(
    "Audio",
    class extends TestAudio {
      play = rejected;
    },
  );
  expect(() => playBattleSound(false)).not.toThrow();
  await Promise.resolve();
  await Promise.resolve();
  stopBattleSounds();
  expect(
    TestAudio.instances.every((audio) => !audio.pause.mock.calls.length),
  ).toBe(true);
  vi.stubGlobal("Audio", undefined);
  expect(() => playBattleSound(false)).not.toThrow();
});
