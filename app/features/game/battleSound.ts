export function playBattleSound(correct: boolean, impactLevel = 0): void {
  if (typeof window === "undefined") return;

  const AudioContextClass = window.AudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const level = Math.max(0, Math.min(3, impactLevel));

  oscillator.type = correct ? "triangle" : "sawtooth";
  oscillator.frequency.setValueAtTime(
    correct ? [520, 660, 820, 1040][level] : 170,
    now,
  );
  if (correct && level >= 2) {
    oscillator.frequency.setValueAtTime(level === 3 ? 1320 : 990, now + 0.09);
  }

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(correct ? 0.11 : 0.08, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (correct ? 0.2 : 0.16));
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + (correct ? 0.21 : 0.17));
  oscillator.onended = () => void context.close();
  void context.resume();
}
