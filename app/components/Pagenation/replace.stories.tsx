import type { Meta, StoryObj } from "@storybook/react-vite";

import Replace from "./replace";
import { PProvider } from "./reprovider";

type Props2 = {
  n_page: number;
  current?: number;
};

const ReplaceWithProvider = ({ n_page, current }: Props2) => {
  const pageSize = 10;
  const total = n_page * pageSize;
  return (
    <PProvider {...{ pageSize, current }}>
      <Replace total={total} />
    </PProvider>
  );
};

const meta: Meta<typeof ReplaceWithProvider> = {
  component: ReplaceWithProvider,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { n_page: 20 },
  globals: {
    viewport: { value: "desktop" },
  },
};

export const Mobile: Story = {
  args: { n_page: 20 },
  globals: {
    viewport: { value: "mobile1" },
  },
};

export const Tablet: Story = {
  args: { n_page: 20 },
  globals: {
    viewport: { value: "tablet" },
  },
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
