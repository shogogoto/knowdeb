import type { Meta, StoryObj } from "@storybook/react-vite";

import type { UserReadPublic } from "~/shared/generated/fastAPI.schemas";
import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      uid: "aaa",
      display_name: "ナナシ",
      avatar_url: "https://github.com/shadcn.png",
    } as UserReadPublic,
  },
};
