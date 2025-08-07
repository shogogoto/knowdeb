import type { Meta, StoryObj } from "@storybook/react-vite";
import { fixtureDetail1 } from "../../fixture";
import DisplayGraph from "./index";

const meta = {
  component: DisplayGraph,
} satisfies Meta<typeof DisplayGraph>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    detail: fixtureDetail1,
  },
};
