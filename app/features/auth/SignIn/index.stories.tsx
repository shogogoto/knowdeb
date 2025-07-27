import type { Meta, StoryObj } from "@storybook/react-vite";

import { AuthProvider } from "../AuthProvider";
import Index from "./index";

const meta = {
  component: Index,
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
