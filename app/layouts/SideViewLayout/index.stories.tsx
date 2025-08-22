import type { Meta, StoryObj } from "@storybook/react-vite";
import SideViewLayout from "./index";

const meta = {
  component: SideViewLayout,
  parameters: {
    reactRouter: {
      route: "/",
      outlet: <div>Dummy Outlet Content</div>,
    },
  },
} satisfies Meta<typeof SideViewLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
