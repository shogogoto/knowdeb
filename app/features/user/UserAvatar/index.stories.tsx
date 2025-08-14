import type { Meta, StoryObj } from "@storybook/react-vite";

import { getUsersCurrentUserUserMeGetResponseMock } from "~/shared/generated/user/user.msw";
import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      ...getUsersCurrentUserUserMeGetResponseMock(),
      avatar_url: "https://github.com/shadcn.png",
    },
  },
};
