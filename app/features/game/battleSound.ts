/** A short noise crack and low thump, rather than a pitched electronic jingle. */
export function playBattleSound(correct: boolean, impactLevel = 0): void {
  if (typeof window === "undefined" || !window.AudioContext) return;
  let context: AudioContext | undefined;
  try {
    context = new window.AudioContext();
    const audio = context;
    const level = Math.max(0, Math.min(3, impactLevel));
    const now = audio.currentTime;
    const duration = correct ? 0.12 + level * 0.025 : 0.18;
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
    filter.frequency.value = correct ? 1500 + level * 350 : 1000;
    filter.Q.value = 0.6;
    const envelope = audio.createGain();
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(
      correct ? 0.18 + level * 0.07 : 0.3,
      now + 0.003,
    );
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    crack.connect(filter);
    filter.connect(envelope);
    envelope.connect(audio.destination);
    const body = audio.createOscillator();
    body.type = "sine";
    body.frequency.setValueAtTime(correct ? 110 + level * 15 : 85, now);
    body.frequency.exponentialRampToValueAtTime(40, now + duration);
    const weight = audio.createGain();
    weight.gain.setValueAtTime(0.0001, now);
    weight.gain.exponentialRampToValueAtTime(0.12 + level * 0.035, now + 0.004);
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
