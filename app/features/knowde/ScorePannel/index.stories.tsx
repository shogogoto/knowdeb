import type { Meta, StoryObj } from "@storybook/react-vite";

import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    stats: {
      score: 1,
      n_detail: 5,
      n_premise: 3,
      n_conclusion: 2,
      n_refer: 4,
      n_referred: 1,
      dist_axiom: 1,
      dist_leaf: 2,
    },
  },
};

export const NoScore: Story = {
  args: {
    stats: {
      score: null,
      n_detail: 5,
      n_premise: 3,
      n_conclusion: 2,
      n_refer: 4,
      n_referred: 1,
      dist_axiom: 1,
      dist_leaf: 2,
    },
  },
};

export const LargeNums: Story = {
  args: {
    stats: {
      score: 10000,
      n_detail: 590,
      n_premise: 301,
      n_conclusion: 211,
      n_refer: 412,
      n_referred: 1111,
      dist_axiom: 1,
      dist_leaf: 222,
    },
  },
};
