/** Original, procedurally composed loops. No music assets or network requests. */
export type MusicScene = "explore" | "battle";
type Preferences = { enabled: boolean; volume: number };
const defaults: Preferences = { enabled: true, volume: 0.25 };
const storageKey = "game-bgm";
let preferences = defaults;
let loaded = false;
const subscribers = new Set<() => void>();
const scenes = new Map<symbol, MusicScene>();
let engine: MusicEngine | undefined;

export function musicPreferences(): Preferences {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (saved) {
        preferences = {
          enabled: typeof saved.enabled === "boolean" ? saved.enabled : true,
          volume: Number.isFinite(saved.volume)
            ? Math.max(0, Math.min(1, saved.volume))
            : defaults.volume,
        };
      }
    } catch {
      // Unavailable storage must not prevent playback or navigation.
    }
  }
  return preferences;
}

export const serverMusicPreferences = () => defaults;
export function subscribeMusic(listener: () => void) {
  subscribers.add(listener);
  return () => subscribers.delete(listener);
}
export function setMusicPreferences(update: Partial<Preferences>) {
  const current = musicPreferences();
  preferences = {
    enabled: update.enabled ?? current.enabled,
    volume: Math.max(0, Math.min(1, update.volume ?? current.volume)),
  };
  try {
    localStorage.setItem(storageKey, JSON.stringify(preferences));
  } catch {
    // Private browsing/storage limits do not disable the controls.
  }
  engine?.setVolume(preferences.enabled ? preferences.volume : 0);
  for (const listener of subscribers) listener();
  if (preferences.enabled && preferences.volume > 0) unlockMusic();
  else engine?.pause();
}

function scene(): MusicScene {
  return [...scenes.values()].includes("battle") ? "battle" : "explore";
}
function unlockMusic() {
  if (
    !scenes.size ||
    document.hidden ||
    !musicPreferences().enabled ||
    preferences.volume === 0
  )
    return;
  try {
    if (!engine && window.AudioContext)
      engine = new MusicEngine(new window.AudioContext());
    engine?.setScene(scene());
    engine?.setVolume(preferences.volume);
    void engine?.resume();
  } catch {
    // Unsupported or blocked audio is optional; gameplay must still work.
  }
}
function visibilityChanged() {
  if (document.hidden) engine?.pause();
  else if (engine && musicPreferences().enabled && preferences.volume > 0)
    void engine.resume();
}

/** Multiple UI owners share one stream; a battle overrides dungeon ambience. */
export function registerMusic(mode: MusicScene) {
  const owner = Symbol(mode);
  scenes.set(owner, mode);
  if (scenes.size === 1) {
    document.addEventListener("pointerdown", unlockMusic, { capture: true });
    document.addEventListener("keydown", unlockMusic, { capture: true });
    document.addEventListener("visibilitychange", visibilityChanged);
  }
  engine?.setScene(scene());
  return () => {
    scenes.delete(owner);
    if (scenes.size) engine?.setScene(scene());
    else {
      document.removeEventListener("pointerdown", unlockMusic, true);
      document.removeEventListener("keydown", unlockMusic, true);
      document.removeEventListener("visibilitychange", visibilityChanged);
      engine?.close();
      engine = undefined;
    }
  };
}

type Track = { gain: GainNode; next: number; step: number; seconds: number };
/** Two quiet layers crossfade; scheduling follows the audio clock, not frame rate. */
export class MusicEngine {
  private master: GainNode;
  private tracks: Record<MusicScene, Track>;
  private timer?: ReturnType<typeof setInterval>;
  private closed = false;
  private playbackRevision = 0;
  private mode?: MusicScene;

  constructor(private context: AudioContext) {
    this.master = context.createGain();
    this.master.gain.value = 0;
    this.master.connect(context.destination);
    const track = (bpm: number, cutoff: number): Track => {
      const gain = context.createGain();
      gain.gain.value = 0;
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = cutoff;
      gain.connect(filter);
      filter.connect(this.master);
      return {
        gain,
        next: context.currentTime + 0.05,
        step: 0,
        seconds: 30 / bpm,
      };
    };
    this.tracks = { explore: track(72, 1400), battle: track(104, 2000) };
    this.setScene("explore");
  }

  setVolume(volume: number) {
    this.master.gain.setTargetAtTime(volume, this.context.currentTime, 0.1);
  }
  setScene(mode: MusicScene) {
    if (this.mode === mode) return;
    const changed = this.mode !== mode;
    this.mode = mode;
    for (const [name, track] of Object.entries(this.tracks)) {
      track.gain.gain.setTargetAtTime(
        name === mode ? 1 : 0,
        this.context.currentTime,
        0.4,
      );
    }
    if (changed && this.timer) {
      const track = this.tracks[mode];
      const root = [50, 46, 53, 48][Math.floor((track.step % 64) / 16)];
      this.note(
        track,
        root,
        this.context.currentTime + 0.05,
        track.seconds * 8,
        0.12,
      );
      this.note(
        track,
        root + 7,
        this.context.currentTime + 0.05,
        track.seconds * 8,
        0.08,
      );
    }
  }
  async resume() {
    if (this.closed || this.timer) return;
    const revision = this.playbackRevision;
    try {
      await this.context.resume();
      if (
        this.closed ||
        this.timer ||
        document.hidden ||
        revision !== this.playbackRevision
      )
        return;
      for (const track of Object.values(this.tracks))
        track.next = this.context.currentTime + 0.05;
      this.schedule();
      this.timer = setInterval(() => this.schedule(), 100);
    } catch {
      // The next user gesture can retry browser autoplay permission.
    }
  }
  pause() {
    this.playbackRevision += 1;
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
    void this.context.suspend().catch(() => undefined);
  }
  close() {
    this.closed = true;
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
    void this.context.close().catch(() => undefined);
  }

  private note(
    track: Track,
    midi: number,
    at: number,
    length: number,
    strength: number,
    type: OscillatorType = "sine",
  ) {
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    envelope.gain.setValueAtTime(0.0001, at);
    envelope.gain.exponentialRampToValueAtTime(
      strength,
      at + Math.min(0.12, length / 4),
    );
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + length);
    oscillator.connect(envelope);
    envelope.connect(track.gain);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
    oscillator.start(at);
    oscillator.stop(at + length + 0.02);
  }

  private schedule() {
    for (const [name, track] of Object.entries(this.tracks)) {
      while (track.next < this.context.currentTime + 0.5) {
        // Skip expired beats after a long main-thread stall; never burst notes.
        if (track.next < this.context.currentTime) {
          track.next = this.context.currentTime + 0.05;
        }
        const step = track.step % 64;
        const root = [50, 46, 53, 48][Math.floor(step / 16)];
        const beat = step % 16;
        if (name === this.mode) {
          if (beat === 0) {
            this.note(track, root, track.next, track.seconds * 15, 0.12);
            this.note(track, root + 7, track.next, track.seconds * 14, 0.08);
          }
          if ([2, 7, 12].includes(beat)) {
            const interval = beat === 7 ? 19 : beat === 12 ? 24 : 12;
            this.note(
              track,
              root + interval,
              track.next,
              track.seconds * 3,
              0.08,
              "triangle",
            );
          }
          if (name === "battle" && beat % 4 === 0) {
            this.note(
              track,
              root - 12,
              track.next,
              track.seconds * 1.5,
              0.14,
              "triangle",
            );
            this.note(track, 30, track.next, 0.14, 0.1);
          }
          if (name === "battle" && beat % 4 === 2) {
            this.note(track, 90, track.next, 0.06, 0.025);
          }
        }
        track.step += 1;
        track.next += track.seconds;
      }
    }
  }
}
