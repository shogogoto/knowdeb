# Battle sound effects

These are third-party CC0 audio assets, not our former runtime oscillator/noise
presets. Downloaded 2026-10-17. All selected works allow use under
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
Credits are retained here even though attribution is not required by CC0.

| Local file | Original file | Author / source |
| --- | --- | --- |
| impact.wav | punch_1.ogg (downloaded as punch.ogg) | Delta12 Studio, [Rpg Sound Effect Pack](https://opengameart.org/content/rpg-sound-effect-pack) |
| slash.wav | blade_01.ogg | rubberduck, [80 CC0 RPG SFX](https://opengameart.org/node/86018) |
| fire.wav | spell_fire_01.ogg | rubberduck, same pack |
| debuff.wav | spell_02.ogg | rubberduck, same pack |
| poison.wav | creature_slime_01.ogg | rubberduck, same pack (slime sound used for poison) |
| curse.wav | creature_monster_01.ogg | rubberduck, same pack (monster sound used for curse) |
| heal.wav | Cure1.wav | Someoneman, [Cure Magic](https://opengameart.org/content/cure-magic) |
| buff.wav | Cure2.wav | Someoneman, same pack |
| lightning.wav | electricspell.ogg, excerpt 0.4–1.6 seconds | Augmentality (Brandon Morris), submitted by HaelDB, [Spell sounds](https://opengameart.org/content/spell-sounds); CC0 option selected, not OGA-BY |

Direct downloads:

- https://opengameart.org/sites/default/files/80-CC0-RPG-SFX_0.zip
- https://opengameart.org/sites/default/files/curemagic.zip
- https://opengameart.org/sites/default/files/punch_1.ogg
- https://opengameart.org/sites/default/files/electricspell.ogg

## Reproduction

Extract the first archive under `rpg/`, the second under `cure/`, and save the
individual OGG downloads as `punch.ogg` and `lightning.ogg` beside those folders.
Run `node scripts/import-skill-sounds.mjs /path/to/extracted-sources` from the
repository root. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if necessary.

Conversion: decode to 32 kHz mono PCM, trim boundary silence, normalize peaks to
85%, add 5 ms boundary fades, encode 16-bit WAV for browser compatibility. Clips
are capped at three seconds; the lightning excerpt avoids the repeated spells
in the original. No newly synthesized tones or pitch shifts are added.
The game hosts these files locally and never requests the source sites.
