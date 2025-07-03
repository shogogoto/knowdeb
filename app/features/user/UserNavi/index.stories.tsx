import type { Meta, StoryObj } from "@storybook/react-vite";

import { SidebarProvider } from "~/components/ui/sidebar";
import { AuthProvider } from "~/features/auth/AuthProvider";
import { getUsersCurrentUserUserMeGetResponseMock } from "~/generated/user/user.msw";
import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: getUsersCurrentUserUserMeGetResponseMock(),
    side: "right",
  },
  decorators: [
    (Story) => {
      return (
        <AuthProvider>
          <SidebarProvider>
            <Story />
          </SidebarProvider>
        </AuthProvider>
      );
    },
  ],
};
