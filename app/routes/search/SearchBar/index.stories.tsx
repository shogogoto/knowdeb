import type { Meta, StoryObj } from "@storybook/react";
import Index from "./index";
const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  // decorators: [
  //   (Story) => (
  //     <div className="dark">
  //       <Story />
  //     </div>
  //   ),
  // ],
  parameters: {
    docs: { themes: { default: "dark" } },
  },
};
