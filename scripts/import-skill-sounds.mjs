// Convert the downloaded CC0 sources in sounds/SOURCES.md into short PCM WAVs.
// Usage: PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chrome node scripts/import-skill-sounds.mjs /tmp/source-dir
// Requires the existing Playwright installation. No network access or synthesis.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const input = process.argv[2];
if (!input) throw new Error("Provide the extracted source directory.");
const output = resolve("public/game-assets/sounds");
const sources = {
  impact: ["punch.ogg"],
  slash: ["rpg/blade_01.ogg"],
  fire: ["rpg/spell_fire_01.ogg"],
  lightning: ["lightning.ogg", 0.4, 1.6],
  heal: ["cure/Cure1.wav"],
  buff: ["cure/Cure2.wav"],
  debuff: ["rpg/spell_02.ogg"],
  poison: ["rpg/creature_slime_01.ogg"],
  curse: ["rpg/creature_monster_01.ogg"],
};
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
});
try {
  const page = await browser.newPage();
  await mkdir(output, { recursive: true });
  for (const [id, [file, start = 0, end = 3]] of Object.entries(sources)) {
    const base64 = (await readFile(resolve(input, file))).toString("base64");
    const samples = await page.evaluate(
      async ({ base64, start, end }) => {
        const context = new OfflineAudioContext(1, 1, 32000);
        const decoded = await context.decodeAudioData(
          Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer,
        );
        const mono = new Float32Array(decoded.length);
        for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
          const data = decoded.getChannelData(channel);
          for (let i = 0; i < data.length; i++)
            mono[i] += data[i] / decoded.numberOfChannels;
        }
        let first = Math.floor(start * decoded.sampleRate);
        let last = Math.min(mono.length, Math.floor(end * decoded.sampleRate));
        let peak = 0;
        for (let i = first; i < last; i++)
          peak = Math.max(peak, Math.abs(mono[i]));
        if (peak === 0) throw new Error("Silent source");
        while (Math.abs(mono[first]) < peak * 0.002) first++;
        while (Math.abs(mono[last - 1]) < peak * 0.002) last--;
        // Leave 20 ms of tail, normalize peaks, and fade boundaries (5 ms).
        last = Math.min(mono.length, last + 640);
        const length = last - first;
        return Array.from(mono.subarray(first, last), (sample, i) =>
          Math.round(
            (sample / peak) *
              0.85 *
              Math.min(1, i / 160, (length - 1 - i) / 160) *
              32767,
          ),
        );
      },
      { base64, start, end },
    );
    const wav = Buffer.alloc(44 + samples.length * 2);
    wav.write("RIFF", 0);
    wav.writeUInt32LE(wav.length - 8, 4);
    wav.write("WAVEfmt ", 8);
    wav.writeUInt32LE(16, 16);
    wav.writeUInt16LE(1, 20);
    wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(32000, 24);
    wav.writeUInt32LE(64000, 28);
    wav.writeUInt16LE(2, 32);
    wav.writeUInt16LE(16, 34);
    wav.write("data", 36);
    wav.writeUInt32LE(samples.length * 2, 40);
    samples.forEach((sample, i) => wav.writeInt16LE(sample, 44 + i * 2));
    await writeFile(resolve(output, `${id}.wav`), wav);
    console.log(`${id}: ${(samples.length / 32000).toFixed(2)}s`);
  }
} finally {
  await browser.close();
}
