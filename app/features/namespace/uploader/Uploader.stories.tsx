import type { Meta, StoryObj } from "@storybook/react-vite";

import ResourceUploader from "./Uploader";

const meta = {
  component: ResourceUploader,
} satisfies Meta<typeof ResourceUploader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
