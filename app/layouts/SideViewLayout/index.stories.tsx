import type { Meta, StoryObj } from "@storybook/react-vite";
import SideHistoryLayout from "./index";

const meta = {
  component: SideHistoryLayout,
  parameters: {
    reactRouter: {
      route: "/",
      outlet: <div>Dummy Outlet Content</div>,
    },
  },
} satisfies Meta<typeof SideHistoryLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
