import type { Meta, StoryObj } from "@storybook/react-vite";

import Replace, { type PaginationProps } from "./replace";

const meta = {
  component: Replace,
} satisfies Meta<typeof Replace>;

export default meta;

type Story = StoryObj<typeof meta>;

type Props = {
  n_page: number;
  current?: number;
};

function fixProps(props: Props): PaginationProps {
  const { n_page, current } = props;
  const pageSize = 10;
  const total = n_page * pageSize;
  return { total, pageSize, initial: current };
}

export const Default: Story = {
  args: fixProps({ n_page: 20 }),
};

export const Mobile: Story = {
  args: fixProps({ n_page: 20 }),
  globals: {
    viewport: { value: "mobile1" },
  },
};

export const Tablet: Story = {
  args: fixProps({ n_page: 20 }),
  globals: {
    viewport: { value: "tablet" },
  },
};

export const Zero: Story = {
  args: fixProps({ n_page: 0 }),
};

export const One: Story = {
  args: fixProps({ n_page: 1 }),
};

export const Two: Story = {
  args: fixProps({ n_page: 2 }),
};

export const Five: Story = {
  args: fixProps({ n_page: 5 }),
};

export const Six: Story = {
  args: fixProps({ n_page: 6 }),
};

export const Ten: Story = {
  args: fixProps({ n_page: 10 }),
};

export const Fifteen: Story = {
  args: fixProps({ n_page: 15, current: 10 }),
};

export const FifteenFirst: Story = {
  args: fixProps({ n_page: 15, current: 1 }),
};

export const FifteenLast: Story = {
  args: fixProps({ n_page: 15, current: 15 }),
};
