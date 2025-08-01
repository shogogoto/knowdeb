import type { Meta, StoryObj } from "@storybook/react-vite";

import { faker } from "@faker-js/faker";
import type { Knowde } from "~/generated/fastAPI.schemas";
import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

const mock: Knowde = {
  sentence: "aaaa".repeat(20),
  uid: faker.string.uuid(),
  term: {
    names: ["Sample Name", "Sample Name2"],
  },
  additional: {
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
  resource_uid: "67cde8ac-66da-4a45-9028-ffd8c6146752",
};

export const Default: Story = {
  args: {
    row: mock,
  },
};

export const NoName: Story = {
  args: {
    row: {
      ...mock,
      sentence: "A".repeat(120),
    },
    index: 1,
  },
};

export const LongName: Story = {
  args: {
    row: {
      ...mock,
      sentence: "x".repeat(80),
      term: {
        names: Array.from({ length: 3 }, () => "n".repeat(30)),
      },
    },
    index: 1,
  },
};
