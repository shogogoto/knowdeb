import type { Meta, StoryObj } from "@storybook/react";
import { fixtureArchivements } from "./fixture";
import AchieveHistoryChart from "./index";

const meta = {
  title: "features/user/ArchieveHistory",
  component: AchieveHistoryChart,
  argTypes: {
    aHistories: {
      description: "成果履歴データ",
    },
  },
} satisfies Meta<typeof AchieveHistoryChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    aHistories: fixtureArchivements,
  },
};
