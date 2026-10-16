import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { animationLabels } from "./catalog";
import { spriteAnimationLabels, spriteAsset } from "./effectAssets";

it("registers forty local CC0 strips with valid metadata and poster files", () => {
  const ids = Object.keys(spriteAnimationLabels);
  expect(ids).toHaveLength(40);
  for (const id of ids) {
    expect(animationLabels).toHaveProperty(id);
    const asset = spriteAsset(id);
    expect(asset).toBeDefined();
    if (!asset) throw new Error(id);
    expect(asset.frames).toBeGreaterThan(2);
    expect(asset.frameSize).toBe(192);
    expect(asset.durationMs).toBeGreaterThanOrEqual(650);
    expect(asset.durationMs).toBeLessThanOrEqual(1600);
    for (const url of [asset.src, asset.poster]) {
      expect(url).toMatch(
        /^\/game-assets\/effects\/oga_\w+(?:-poster)?\.webp$/,
      );
      const file = readFileSync(resolve("public", url.slice(1)));
      expect(file.toString("ascii", 0, 4)).toBe("RIFF");
      expect(file.toString("ascii", 8, 12)).toBe("WEBP");
    }
  }
  expect(spriteAsset("../unknown")).toBeUndefined();
  expect(spriteAsset("fire")).toBeUndefined();
});
