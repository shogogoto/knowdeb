import type { Meta, StoryObj } from "@storybook/react-vite";

import Replace from "./replace";

const meta = {
  component: Replace,
} satisfies Meta<typeof Replace>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { n_page: 100 },
};
