import type { Meta, StoryObj } from "@storybook/react-vite";

import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    index: 1,
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
