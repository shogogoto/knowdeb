import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import GameIcon, { IconPicker } from "./GameIcon";

function MaterialGallery() {
  const [icon, setIcon] = useState("crawl_dragon");
  return (
    <div className="space-y-4 p-6">
      <IconPicker value={icon} onChange={setIcon} />
      <GameIcon icon={icon} className="size-40" />
    </div>
  );
}
const meta = {
  title: "Game/Materials",
  component: MaterialGallery,
} satisfies Meta<typeof MaterialGallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Gallery: Story = {};
