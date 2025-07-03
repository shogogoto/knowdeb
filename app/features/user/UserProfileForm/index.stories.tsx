import type { Meta, StoryObj } from "@storybook/react-vite";

import { AuthProvider } from "~/features/auth/AuthProvider";
import UserProfileForm from "./index";

const meta = {
  component: UserProfileForm,
} satisfies Meta<typeof UserProfileForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
};
