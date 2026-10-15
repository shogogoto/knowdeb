import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import ExplorationMap from "./Map";
import { type DungeonMap, ENTRANCE } from "./exploration";
import { type ChestReward, chestRegion, regionChests } from "./treasure";

const places = Array.from({ length: 11 }, (_, index) => ({
  id: `place-${index}`,
  region: Math.floor(index / 5),
}));
const initialMap: DungeonMap = {
  current: "place-4",
  places,
  edges: places.map((place, index) => ({
    from: index % 5 === 0 ? ENTRANCE : places[index - 1].id,
    to: place.id,
    kind: "detour",
  })),
};

function TreasureMap() {
  const [map, setMap] = useState(initialMap);
  const [opened, setOpened] = useState<Record<string, ChestReward>>({
    "1": { gold: 30, healing_potion: 0, step_potion: 1 },
  });
  return (
    <ExplorationMap
      map={map}
      title="宝箱のあるダンジョン"
      knowledge={places.map((place, index) => ({
        uid: place.id,
        sentence: `知識の地点 ${index + 1}`,
      }))}
      openedChests={opened}
      disabled={false}
      remainingMoves={0}
      exhaustedMessage={<p>復習して歩数を回復</p>}
      canTravel={(id) =>
        chestRegion(id) === undefined ||
        regionChests(map).some(
          (chest) =>
            chest.id === id &&
            (map.current === chest.last || map.current === chest.id),
        )
      }
      onOpen={() => undefined}
      onMove={(id) => {
        const region = chestRegion(id);
        if (region !== undefined)
          setOpened((current) => ({
            ...current,
            [region]: current[region] ?? {
              gold: 30,
              healing_potion: 0,
              step_potion: 1,
            },
          }));
        setMap((current) => ({ ...current, current: id }));
      }}
    />
  );
}

const meta = {
  title: "Game/Map",
  component: TreasureMap,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ExplorationMap>;
export default meta;
type Story = StoryObj<typeof meta>;
export const RegionTreasure: Story = { render: () => <TreasureMap /> };
