import type { Meta, StoryObj } from "@storybook/react";
import { SidebarProvider } from "~/components/ui/sidebar";
import GuestSidebar from "./GuestSidebar";

const meta = {
  component: GuestSidebar,
  decorators: [
    (Story) => (
      <div className="sb-router-container">
        <SidebarProvider>
          <Story />
          <div id="main-content" style={{ marginLeft: "20px" }}>
            Main Content
          </div>
        </SidebarProvider>
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof GuestSidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

// Default state
export const Default: Story = {};

// Mobile view
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile",
    },
  },
};

// Desktop view
export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};
