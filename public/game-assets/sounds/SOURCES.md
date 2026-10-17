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
| lightning.wav | electricspell.ogg, complete phrase 7.6–11.3 seconds | Augmentality (Brandon Morris), submitted by HaelDB, [Spell sounds](https://opengameart.org/content/spell-sounds); CC0 option selected, not OGA-BY |
| lightning_2.wav | electricspell.ogg, complete phrase 11.3–16.5 seconds | Augmentality, same source |
| lightning_storm.wav | electricspell2.ogg (entire non-silent recording) | Augmentality, same source |
| slash_2.wav, slash_3.wav | blade_02.ogg, blade_03.ogg | rubberduck, same RPG pack |
| fire_2.wav … fire_7.wav | spell_fire_02.ogg … spell_fire_07.ogg | rubberduck, same RPG pack |
| heal_2.wav … heal_7.wav | Cure3.wav … Cure8.wav | Someoneman, same Cure Magic pack |
| poison_2.wav … poison_4.wav | creature_slime_02.ogg … creature_slime_04.ogg | rubberduck, same RPG pack |
| magic.wav | spell_01.ogg | rubberduck, same RPG pack |
| metal.wav, metal_2.wav | metal_01.ogg, metal_02.ogg | rubberduck, same RPG pack |
| coins.wav | item_coins_01.ogg | rubberduck, same RPG pack |
| stones.wav | stones_01.ogg | rubberduck, same RPG pack |

Direct downloads:

- https://opengameart.org/sites/default/files/80-CC0-RPG-SFX_0.zip
- https://opengameart.org/sites/default/files/curemagic.zip
- https://opengameart.org/sites/default/files/punch_1.ogg
- https://opengameart.org/sites/default/files/electricspell.ogg
- https://opengameart.org/sites/default/files/electricspell2.ogg

## Reproduction

Extract the first archive under `rpg/`, the second under `cure/`, and save the
individual OGG downloads as `punch.ogg`, `lightning.ogg` and `lightning2.ogg` beside those folders.
Run `node scripts/import-skill-sounds.mjs /path/to/extracted-sources` from the
repository root. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if necessary.

Conversion: decode to 32 kHz mono PCM, trim boundary silence, normalize peaks to
85%, add 5 ms boundary fades, encode 16-bit WAV for browser compatibility. Clips
are no longer capped at an arbitrary duration. Lightning phrases include their
decay up to the quiet gap before the next phrase. The long continuous-discharge
variant retains the complete non-silent source. The previous 1.2-second lightning
slice was replaced because it cut through an active phrase. No newly synthesized
tones or pitch shifts are added.
The game hosts these files locally and never requests the source sites.
