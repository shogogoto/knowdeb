import type { Meta, StoryObj } from "@storybook/react-vite";
import { resourceSearchFixture } from "./fixture";
import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    result: resourceSearchFixture,
  },
};
