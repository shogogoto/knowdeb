import type { Meta, StoryObj } from "@storybook/react";

import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    knowde: {
      sentence: "dummy",
      uid: "8923b4b9-27a8-43c7-bb8f-e63b77b72c12",
      when: "19C",
    },
  },
};
