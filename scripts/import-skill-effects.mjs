// Rebuild locally hosted CC0 sprite strips from the original downloaded packs.
// Usage: node scripts/import-skill-effects.mjs /tmp/tanbun-skill-effects.XXXXXX
// Requires ImageMagick (convert/identify). No network access; see SOURCES.md.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const input = process.argv[2];
if (!input)
  throw new Error(
    "Provide the directory containing extracted slash/, magic/ and Soluna PNGs.",
  );
const output = resolve("public/game-assets/effects");
const work = mkdtempSync(join(tmpdir(), "tanbun-effect-import-"));
mkdirSync(output, { recursive: true });
const run = (name, args) => execFileSync(name, args, { encoding: "utf8" });
const specs = [
  ...[1, 2, 3, 4, 5].map((n) => ({
    id: `oga_slash_${n}`,
    directory: `slash/Classic/${n}`,
    author: "Cethiel",
  })),
  ...[
    "fx1_blue_topEffect",
    "fx2_swordFire",
    "fx3_fireBall",
    "fx4_sign_of_fire",
    "fx5_fire_scissors",
    "fx6_eaterFire",
    "fx7_energyBall",
    "fx8_lighteningBall",
    "fx9_rainOnGround",
    "fx10_blackExplosion",
  ].map((directory, i) => ({
    id: `oga_spell_${i + 1}`,
    directory: `magic/${directory}`,
    author: "Mikodrak / Martin Jelinek",
  })),
  ...["Explosion03", "Explosion21", "Effect95", "Effect47", "Aura38"].map(
    (file, i) => ({
      id: `oga_effect_${i + 1}`,
      sheet: `${file}.png`,
      author: "Soluna Software",
    }),
  ),
];
const manifest = {};
for (const spec of specs) {
  let files;
  if (spec.directory) {
    const dir = join(input, spec.directory);
    files = readdirSync(dir)
      .filter((f) => f.endsWith(".png"))
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
      .map((f) => join(dir, f));
  } else {
    run("convert", [
      join(input, spec.sheet),
      "-crop",
      "128x128",
      "+repage",
      join(work, `${spec.id}-%02d.png`),
    ]);
    files = readdirSync(work)
      .filter((f) => f.startsWith(`${spec.id}-`))
      .sort()
      .map((f) => join(work, f));
  }
  const sizes = files.map((f) =>
    run("identify", ["-format", "%w %h", f]).trim().split(" ").map(Number),
  );
  const width = Math.max(...sizes.map((s) => s[0]));
  const height = Math.max(...sizes.map((s) => s[1]));
  const normalized = files.map((file, i) => {
    const target = join(work, `${spec.id}-frame-${i}.png`);
    run("convert", [
      file,
      "-background",
      "none",
      "-gravity",
      "center",
      "-extent",
      `${width}x${height}`,
      "-resize",
      "192x192",
      "-extent",
      "192x192",
      target,
    ]);
    return target;
  });
  // Append a transparent final frame so an effect never stays over the battle.
  const blank = join(work, `${spec.id}-blank.png`);
  run("convert", ["-size", "192x192", "xc:none", blank]);
  const frames = normalized.length + 1;
  run("convert", [
    ...normalized,
    blank,
    "+append",
    "-define",
    "webp:lossless=true",
    join(output, `${spec.id}.webp`),
  ]);
  run("convert", [
    normalized[Math.floor(normalized.length / 3)],
    "-resize",
    "96x96",
    "-define",
    "webp:lossless=true",
    join(output, `${spec.id}-poster.webp`),
  ]);
  manifest[spec.id] = {
    frames,
    frameSize: 192,
    durationMs: Math.min(1600, Math.max(650, normalized.length * 45)),
    author: spec.author,
  };
}
writeFileSync(
  resolve("app/features/game/effectSpriteManifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(`Imported ${specs.length} CC0 animations to ${output}`);
