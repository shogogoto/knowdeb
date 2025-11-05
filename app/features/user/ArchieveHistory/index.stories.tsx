import type { Meta, StoryObj } from "@storybook/react";
import { fixtureArchivements } from "../ArchieveHistory/fixture";
import ArchieveHistory from "./index";

const meta = {
  title: "features/user/ArchieveHistory",
  component: ArchieveHistory,
  argTypes: {
    aHistories: {
      description: "成果履歴データ",
    },
  },
} satisfies Meta<typeof ArchieveHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    aHistories: fixtureArchivements,
  },
};
