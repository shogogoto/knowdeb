import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { type ComponentProps, useState } from "react";
import EconomyPanel from "./EconomyPanel";
import { newSave } from "./domain";

const resource = "123456781234123412341234567890ab";
const identity = `@dungeon:${resource}`;
const save = {
  ...newSave(),
  economy: {
    gold: 0,
    inventory: { [identity]: 1 },
    weapon: null,
    weapon_attack: 0,
  },
};
const product = {
  id: identity,
  name: "読書メモのダンジョン開放キー",
  kind: "dungeon_unlock",
  resource_id: resource,
  price: null,
  amount: 0,
  max_uses: 1,
  enabled: true,
  icon: "key",
};

function Inventory(props: ComponentProps<typeof EconomyPanel>) {
  const [current, setCurrent] = useState(props.save);
  return (
    <EconomyPanel
      {...props}
      save={current}
      onSaved={(state) => setCurrent(state.save)}
    />
  );
}

const meta = {
  title: "Game/Inventory",
  component: EconomyPanel,
  render: (args) => <Inventory {...args} />,
  parameters: {
    msw: {
      handlers: [
        http.get("*/game/shop", () =>
          HttpResponse.json({ products: [product] }),
        ),
        http.post("*/game/inventory/use", () =>
          HttpResponse.json({
            revision: 2,
            save: {
              ...save,
              economy: { ...save.economy, inventory: { [identity]: 0 } },
              unlockedDungeons: [
                {
                  sourceId: resource,
                  resourceId: resource,
                  name: "読書メモ",
                  achievement: 0,
                  source: "item",
                },
              ],
            },
          }),
        ),
      ],
    },
  },
} satisfies Meta<typeof EconomyPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const DungeonKey: Story = {
  args: {
    userId: "inventory-fixture",
    save,
    revision: 1,
    shop: false,
    disabled: false,
    onSaved: () => undefined,
    onTab: () => undefined,
  },
};
