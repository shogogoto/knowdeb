import type { Meta, StoryObj } from "@storybook/react-vite";
import { getSearchResourcePostResourceSearchPostMockHandler } from "~/shared/generated/entry/entry.msw";

import Index from "./index";

const meta = {
  component: Index,
  parameters: {
    msw: {
      handlers: [getSearchResourcePostResourceSearchPostMockHandler()],
    },
  },
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
