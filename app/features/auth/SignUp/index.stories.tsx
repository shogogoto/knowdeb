import type { Meta, StoryObj } from "@storybook/react-vite";

import { AuthProvider } from "../AuthProvider";
import SignUpForm from "./index";

const meta = {
  component: SignUpForm,
} satisfies Meta<typeof SignUpForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
};
