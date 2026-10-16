/** Project-local original character art. Only registered IDs are saved. */
export const characterAssets = {
  art_archive_golem: {
    label: "書庫のゴーレム",
    src: "/game-assets/archive_golem.webp",
    category: "boss",
  },
  art_crystal_dragon: {
    label: "水晶竜",
    src: "/game-assets/crystal_dragon.webp",
    category: "boss",
  },
  art_ancient_treant: {
    label: "古樹の守護者",
    src: "/game-assets/ancient_treant.webp",
    category: "boss",
  },
  art_ink_slime: {
    label: "インクスライム",
    src: "/game-assets/ink_slime.webp",
    category: "enemy",
  },
  art_scroll_mimic: {
    label: "巻物ミミック",
    src: "/game-assets/scroll_mimic.webp",
    category: "enemy",
  },
  art_owl_mage: {
    label: "フクロウの魔術師",
    src: "/game-assets/owl_mage.webp",
    category: "enemy",
  },
} as const;
export function characterAsset(id?: string | null) {
  return id && Object.hasOwn(characterAssets, id)
    ? characterAssets[id as keyof typeof characterAssets]
    : undefined;
}
