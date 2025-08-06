import type { Meta, StoryObj } from "@storybook/react-vite";
import { DisplayGraph } from "./display";

const meta = {
  component: DisplayGraph,
} satisfies Meta<typeof DisplayGraph>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
