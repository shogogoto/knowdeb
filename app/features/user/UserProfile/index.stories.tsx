import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthProvider } from "~/features/auth/AuthProvider";
import type { UserRead } from "~/generated/fastAPI.schemas";
import { getUserProfileUserProfileUsernameGetResponseMock } from "~/generated/public-user/public-user.msw";
import { getUsersCurrentUserUserMeGetMockHandler } from "~/generated/user/user.msw";
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
  parameters: {
    msw: {
      handlers: [
        getUsersCurrentUserUserMeGetMockHandler({
          display_name: "ナナシ",
          profile: "profile",
          username: "0123456789",
          uid: "382d74c3-5782-4930-aaa1-ef3ea08f506a",
          created: "2023-01-01",
          avatar_url: "https://github.com/shadcn.png",
        } as UserRead),
      ],
    },
  },
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: getUserProfileUserProfileUsernameGetResponseMock(),
  },
};
