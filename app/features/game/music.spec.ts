import { vi } from "vitest";

const cleanups: (() => void)[] = [];
function own(cleanup: () => void) {
  cleanups.push(cleanup);
  return cleanup;
}

function audioParameter() {
  return {
    value: 0,
    setTargetAtTime: vi.fn(),
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  };
}
function gainNode() {
  return { gain: audioParameter(), connect: vi.fn(), disconnect: vi.fn() };
}
function oscillatorNode() {
  return {
    type: "sine",
    frequency: audioParameter(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: undefined,
  };
}
class TestAudioContext {
  static instances: TestAudioContext[] = [];
  currentTime = 0;
  destination = {};
  gains: ReturnType<typeof gainNode>[] = [];
  oscillators: ReturnType<typeof oscillatorNode>[] = [];
  resume = vi.fn(async (): Promise<void> => {});
  suspend = vi.fn(async () => undefined);
  close = vi.fn(async () => undefined);
  constructor() {
    TestAudioContext.instances.push(this);
  }
  createGain() {
    const gain = gainNode();
    this.gains.push(gain);
    return gain;
  }
  createBiquadFilter() {
    return { type: "lowpass", frequency: audioParameter(), connect: vi.fn() };
  }
  createOscillator() {
    const oscillator = oscillatorNode();
    this.oscillators.push(oscillator);
    return oscillator;
  }
}

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  localStorage.clear();
  vi.runOnlyPendingTimers();
  TestAudioContext.instances = [];
  vi.stubGlobal("AudioContext", TestAudioContext);
});
afterEach(() => {
  for (const cleanup of cleanups.splice(0).reverse()) cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("starts only on interaction, shares one stream, crossfades scenes and closes on exit", async () => {
  const { registerMusic, musicPreferences, setMusicPreferences } = await import(
    "./music"
  );
  const explore = own(registerMusic("explore"));
  expect(TestAudioContext.instances).toHaveLength(0);
  document.dispatchEvent(new Event("pointerdown"));
  expect(musicPreferences()).toEqual({ enabled: false });
  expect(TestAudioContext.instances).toHaveLength(0);
  setMusicPreferences({ enabled: true });
  await vi.advanceTimersByTimeAsync(0);
  const context = TestAudioContext.instances[0];
  expect(context.oscillators.length).toBeGreaterThan(0);
  expect(vi.getTimerCount()).toBe(1);
  const battle = own(registerMusic("battle"));
  expect(context.gains[1].gain.setTargetAtTime).toHaveBeenLastCalledWith(
    0,
    0,
    0.4,
  );
  expect(context.gains[2].gain.setTargetAtTime).toHaveBeenLastCalledWith(
    1,
    0,
    0.4,
  );
  document.dispatchEvent(new Event("keydown"));
  await Promise.resolve();
  expect(TestAudioContext.instances).toHaveLength(1);
  expect(vi.getTimerCount()).toBe(1);
  battle();
  expect(context.gains[1].gain.setTargetAtTime).toHaveBeenLastCalledWith(
    1,
    0,
    0.4,
  );
  expect(context.close).not.toHaveBeenCalled();
  explore();
  expect(context.close).toHaveBeenCalledOnce();
  expect(vi.getTimerCount()).toBe(0);
  document.dispatchEvent(new Event("keydown"));
  expect(TestAudioContext.instances).toHaveLength(1);
});

it("pauses hidden tabs and muted music without continuing the scheduler", async () => {
  localStorage.setItem("game-bgm", JSON.stringify({ enabled: true }));
  vi.runOnlyPendingTimers();
  const { registerMusic, setMusicPreferences } = await import("./music");
  const stop = own(registerMusic("battle"));
  document.dispatchEvent(new Event("pointerdown"));
  await Promise.resolve();
  const context = TestAudioContext.instances[0];
  const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
  document.dispatchEvent(new Event("visibilitychange"));
  expect(context.suspend).toHaveBeenCalledOnce();
  expect(vi.getTimerCount()).toBe(0);
  hidden.mockReturnValue(false);
  document.dispatchEvent(new Event("visibilitychange"));
  await Promise.resolve();
  expect(vi.getTimerCount()).toBe(1);
  setMusicPreferences({ enabled: false });
  await vi.advanceTimersByTimeAsync(0);
  expect(vi.getTimerCount()).toBe(0);
  document.dispatchEvent(new Event("pointerdown"));
  expect(vi.getTimerCount()).toBe(0);
  setMusicPreferences({ enabled: true });
  await vi.advanceTimersByTimeAsync(0);
  expect(vi.getTimerCount()).toBe(1);
  stop();
});

it("restores saved preferences and tolerates unavailable audio and storage", async () => {
  localStorage.setItem(
    "game-bgm",
    JSON.stringify({ enabled: false, volume: 0.4 }),
  );
  const { registerMusic, musicPreferences, setMusicPreferences } = await import(
    "./music"
  );
  expect(musicPreferences()).toEqual({ enabled: false });
  vi.stubGlobal("AudioContext", undefined);
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  const stop = own(registerMusic("explore"));
  expect(() => setMusicPreferences({ enabled: true })).not.toThrow();
  document.dispatchEvent(new Event("pointerdown"));
  expect(TestAudioContext.instances).toHaveLength(0);
  stop();
});

it("does not restart an audio context after its owner leaves during resume", async () => {
  localStorage.setItem("game-bgm", JSON.stringify({ enabled: true }));
  vi.runOnlyPendingTimers();
  let resolve: (() => void) | undefined;
  const { registerMusic } = await import("./music");
  class PendingContext extends TestAudioContext {
    resume = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );
  }
  vi.stubGlobal("AudioContext", PendingContext);
  const stop = own(registerMusic("explore"));
  document.dispatchEvent(new Event("pointerdown"));
  const context = TestAudioContext.instances[0];
  stop();
  resolve?.();
  await Promise.resolve();
  expect(context.close).toHaveBeenCalledOnce();
  expect(vi.getTimerCount()).toBe(0);
});
