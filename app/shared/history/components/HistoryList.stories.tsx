import type { Meta, StoryObj } from "@storybook/react-vite";

import { HistoryList } from "./HistoryList";

const meta = {
  component: HistoryList,
} satisfies Meta<typeof HistoryList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
