import type { Meta, StoryObj } from "@storybook/react";
import { fixtureArchivements } from "./fixture";
import AchieveHistory from "./index";

const meta = {
  title: "features/user/ArchieveHistory",
  component: AchieveHistory,
  argTypes: {
    aHistories: {
      description: "成果履歴データ",
    },
  },
} satisfies Meta<typeof AchieveHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    aHistories: fixtureArchivements,
  },
};
