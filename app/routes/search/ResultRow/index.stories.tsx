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
        sentence: faker.string.alpha(80),
        uid: faker.string.uuid(),
        term: {
          names: ["Sample Name"],
        },
      },
      when: "2025-04-28",
    },
  },
};
