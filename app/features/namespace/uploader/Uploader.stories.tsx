import type { Meta, StoryObj } from "@storybook/react-vite";

import Uploader from "./Uploader";

const meta = {
  component: Uploader,
} satisfies Meta<typeof Uploader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
