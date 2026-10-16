# Skill animation sources

These are third-party CC0 animations, not AI-generated images. Retrieved 2026-10-16.
License: [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/).
The source pages identify these assets as CC0. Creator credits are retained here
even though attribution is not required by CC0. No external URLs are loaded at runtime.

| Local IDs | Creator | Source / original download |
| --- | --- | --- |
| `oga_slash_1`–`oga_slash_5` | Cethiel | [Weapon Slash - Effect](https://opengameart.org/content/weapon-slash-effect), [Classic.zip](https://opengameart.org/sites/default/files/Classic.zip) |
| `oga_spell_1`–`oga_spell_10` | Mikodrak / Martin Jelinek | [2D Spell Effects](https://opengameart.org/node/16402), [FX.zip](https://opengameart.org/sites/default/files/FX.zip) |
| `oga_effect_1`–`oga_effect_5` | Soluna Software | [Explosion effects and more](https://opengameart.org/content/explosion-effects-and-more); `Explosion03.png`, `Explosion21.png`, `Effect95.png`, `Effect47.png`, `Aura38.png` |
| `oga_nature_1`–`oga_nature_4` | Cethiel | [Nature - Magic Effect](https://opengameart.org/content/nature-magic-effect), [Nature Magic Effect.zip](https://opengameart.org/sites/default/files/Nature%20Magic%20Effect.zip) |
| `oga_arcane_1`–`oga_arcane_6` | Cethiel | [Arcane Magic Effect](https://opengameart.org/content/arcane-magic-effect), [Arcane_Effect.zip](https://opengameart.org/sites/default/files/Arcane_Effect.zip) |
| `oga_earth_1`–`oga_earth_5` | Cethiel | [Earth Impact - Magic Effect](https://opengameart.org/content/earth-impact-magic-effect), [Earth Impact - Magic Effect.zip](https://opengameart.org/sites/default/files/Earth%20Impact%20-%20Magic%20Effect.zip) |
| `oga_cosmic_1`–`oga_cosmic_5` | Cethiel | [Cosmic Time - Magic Effect](https://opengameart.org/content/cosmic-time-magic-effect), [Cosmic Time - Magic Effect.zip](https://opengameart.org/sites/default/files/Cosmic%20Time%20-%20Magic%20Effect.zip) |

The Soluna page lists CC-BY 3.0 and CC0; this project uses the CC0 option.
The author explicitly states in the page's comments that the license was changed
to CC0. The original magic pack's readme also grants unrestricted project use.

## Processing

- Keep original ordering (numeric filenames; row-major 128px sheet cells).
- Pad each animation's frames to its largest canvas, fit into a transparent
  192×192 cell, and append horizontally into lossless WebP strips.
- Add one transparent final frame. Posters are 96×96 representative frames.
- `app/features/game/effectSpriteManifest.json` records frame counts, frame size,
  playback duration and authors.
- Rebuild with `node scripts/import-skill-effects.mjs <download-directory>`.
  Extract `Classic.zip` under `slash/`, `FX.zip` under `magic/`, and put the five
  Soluna sheets at the download directory root. ImageMagick is required only
  when importing assets, not at build time or runtime.
- Extract the Nature, Arcane, Earth Impact and Cosmic Time ZIPs under `nature/`,
  `arcane/`, `earth/` and `cosmic/` respectively. Nature files use a numeric
  prefix per animation (`0-` through `3-`); exclude its `Preview.png`.
  Arcane uses subdirectories `01`–`06`, Earth and Cosmic use `1`–`5`.
- The twenty additional effects keep their original frames (no recoloring).
  Their posters use a later representative frame (60% through the sequence)
  so expanding plants, magic circles and rocks are recognizable in the gallery.

The in-app Japanese preset names describe the effects; they are not original titles.
