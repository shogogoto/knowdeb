import type { Meta, StoryObj } from "@storybook/react-vite";

import Body from "./Body";

const meta = {
  component: Body,
} satisfies Meta<typeof Body>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
