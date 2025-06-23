import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "~/components/ui/button";
import { AuthProvider } from "../AuthProvider";
import { LogoutDialog } from "./index";

const meta = {
  component: LogoutDialog,
} satisfies Meta<typeof LogoutDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <LogoutDialog {...args}>
      <Button>Logout</Button>
    </LogoutDialog>
  ),
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
};
