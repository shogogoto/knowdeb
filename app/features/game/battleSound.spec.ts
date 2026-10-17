import { vi } from "vitest";
import { playBattleSound, playSkillSound } from "./battleSound";

const parameter = () => ({
  value: 0,
  setValueAtTime: vi.fn(),
  exponentialRampToValueAtTime: vi.fn(),
});
const node = () => ({ connect: vi.fn(), start: vi.fn(), stop: vi.fn() });
let context: {
  currentTime: number;
  sampleRate: number;
  destination: object;
  createBuffer: ReturnType<typeof vi.fn>;
  createBufferSource: ReturnType<typeof vi.fn>;
  createBiquadFilter: ReturnType<typeof vi.fn>;
  createGain: ReturnType<typeof vi.fn>;
  createOscillator: ReturnType<typeof vi.fn>;
  resume: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
};
let crack: ReturnType<typeof node> & { buffer?: unknown; onended?: () => void };
let body: ReturnType<typeof node> & {
  type: string;
  frequency: ReturnType<typeof parameter>;
};
beforeEach(() => {
  crack = node();
  body = { ...node(), type: "", frequency: parameter() };
  context = {
    currentTime: 0,
    sampleRate: 1000,
    destination: {},
    createBuffer: vi.fn((_channels, length) => ({
      getChannelData: () => new Float32Array(length),
    })),
    createBufferSource: vi.fn(() => crack),
    createBiquadFilter: vi.fn(() => ({
      ...node(),
      type: "",
      frequency: parameter(),
      Q: parameter(),
    })),
    createGain: vi.fn(() => ({ ...node(), gain: parameter() })),
    createOscillator: vi.fn(() => body),
    resume: vi.fn(async () => undefined),
    close: vi.fn(async () => undefined),
  };
  vi.stubGlobal(
    "AudioContext",
    class {
      constructor() {
        Object.assign(this, context);
      }
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

it.each([true, false])(
  "uses a noise transient and a low thump, then releases the audio context (correct=%s)",
  (correct) => {
    playBattleSound(correct, 3);
    expect(context.createBufferSource).toHaveBeenCalledOnce();
    expect(context.createBiquadFilter).toHaveBeenCalledOnce();
    expect(body.type).toBe("sine");
    expect(body.frequency.setValueAtTime.mock.calls[0][0]).toBeLessThan(200);
    expect(body.frequency.exponentialRampToValueAtTime.mock.calls[0][0]).toBe(
      40,
    );
    expect(crack.start).toHaveBeenCalledWith(0);
    expect(crack.stop.mock.calls[0][0]).toBeLessThan(0.3);
    crack.onended?.();
    expect(context.close).toHaveBeenCalledOnce();
  },
);
it("does not break gameplay when audio is unavailable or rejected", async () => {
  context.resume.mockRejectedValueOnce(new Error("blocked"));
  expect(() => playBattleSound(true)).not.toThrow();
  await Promise.resolve();
  expect(context.close).toHaveBeenCalled();
  vi.stubGlobal("AudioContext", undefined);
  expect(() => playBattleSound(false)).not.toThrow();
});

it("keeps an explicitly silent skill silent", () => {
  playSkillSound({ effect: "attack", sound: "none" });
  expect(context.createBufferSource).not.toHaveBeenCalled();
});

it.each([
  "slash",
  "fire",
  "lightning",
  "heal",
  "buff",
  "debuff",
  "poison",
  "curse",
] as const)("plays the selected %s preset", (sound) => {
  playSkillSound({ effect: "attack", sound });
  expect(crack.start).toHaveBeenCalledOnce();
  expect(body.frequency.setValueAtTime.mock.calls[0][0]).toBeGreaterThan(0);
});

it("resolves automatic recovery and curse sounds from their actual effects", () => {
  playSkillSound({ effect: "heal_mp" });
  expect(body.frequency.setValueAtTime).toHaveBeenLastCalledWith(440, 0);
  playSkillSound({ effect: "ailment", ailment: "curse" });
  expect(body.frequency.setValueAtTime).toHaveBeenLastCalledWith(110, 0);
});
