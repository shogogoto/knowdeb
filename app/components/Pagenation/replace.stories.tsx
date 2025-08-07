import type { Meta, StoryObj } from "@storybook/react-vite";

import Replace from "./replace";

const meta = {
  component: Replace,
} satisfies Meta<typeof Replace>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { n_page: 20 },
};

export const Zero: Story = {
  args: { n_page: 0 },
};

export const One: Story = {
  args: { n_page: 1 },
};

export const Two: Story = {
  args: { n_page: 2 },
};

export const Five: Story = {
  args: { n_page: 5 },
};

export const Six: Story = {
  args: { n_page: 6 },
};

export const Ten: Story = {
  args: { n_page: 10 },
};

export const Fifteen: Story = {
  args: { n_page: 15, current: 10 },
};

export const FifteenFirst: Story = {
  args: { n_page: 15, current: 1 },
};

export const FifteenLast: Story = {
  args: { n_page: 15, current: 15 },
};
