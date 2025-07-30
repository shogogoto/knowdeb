import type { Meta, StoryObj } from "@storybook/react-vite";

import { faker } from "@faker-js/faker";
import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

// term short, long
//
export const Default: Story = {
  args: {
    row: {
      knowde: {
        sentence: "aaaa".repeat(20),
        uid: faker.string.uuid(),
        term: {
          names: ["Sample Name", "Sample Name2"],
        },
        when: "2025-04-28",
      },
      stats: {
        n_detail: 0,
        n_premise: 0,
        n_conclusion: 0,
        n_refer: 0,
        n_referred: 0,
        dist_axiom: 0,
        dist_leaf: 0,
        score: 10,
      },
    },
  },
};

export const NoName: Story = {
  args: {
    row: {
      knowde: {
        sentence: "A".repeat(120),
        uid: faker.string.uuid(),
        when: "2025-04-28",
      },
      stats: {
        n_detail: 0,
        n_premise: 0,
        n_conclusion: 0,
        n_refer: 0,
        n_referred: 0,
        dist_axiom: 0,
        dist_leaf: 0,
        score: 10,
      },
    },
    index: 1,
  },
};

export const LongName: Story = {
  args: {
    row: {
      knowde: {
        sentence: "x".repeat(80),
        uid: faker.string.uuid(),
        term: {
          names: Array.from({ length: 3 }, () => "n".repeat(30)),
        },
      },
      stats: {
        n_detail: 0,
        n_premise: 0,
        n_conclusion: 0,
        n_refer: 0,
        n_referred: 0,
        dist_axiom: 0,
        dist_leaf: 0,
        score: 10,
      },
    },
    index: 1,
  },
};
