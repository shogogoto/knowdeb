import type { Meta, StoryObj } from "@storybook/react-vite";

import ResourceDetailCard from "./index";

const meta = {
  component: ResourceDetailCard,
} satisfies Meta<typeof ResourceDetailCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: "id" },
};
