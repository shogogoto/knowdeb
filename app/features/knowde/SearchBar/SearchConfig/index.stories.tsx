import type { Meta, StoryObj } from "@storybook/react-vite";
import { defaultOrderBy } from "../types";
import Index from "./index";

const meta = {
  title: "SearchConfig",
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // @ts-ignore
  args: {
    setPaging: () => {},
    setOrderBy: () => {},
    order: defaultOrderBy,
  },
};
