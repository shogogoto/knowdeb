import type { Meta, StoryObj } from "@storybook/react";

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
      center: {
        sentence: "a".repeat(80),
        uid: faker.string.uuid(),
        term: {
          names: ["Sample Name", "Sample Name2"],
        },
      },
      when: "2025-04-28",
    },
  },
};

export const NoName: Story = {
  args: {
    row: {
      center: {
        sentence: "A".repeat(120),
        uid: faker.string.uuid(),
      },
    },
  },
};

export const LongName: Story = {
  args: {
    row: {
      center: {
        sentence: "x".repeat(80),
        uid: faker.string.uuid(),
        term: {
          names: Array.from({ length: 3 }, () => "n".repeat(30)),
        },
      },
    },
  },
};
