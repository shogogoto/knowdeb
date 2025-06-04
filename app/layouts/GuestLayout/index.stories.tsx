import type { Meta, StoryObj } from "@storybook/react";
import { SidebarProvider } from "~/components/ui/sidebar";
import GuestLayout from "./index";

const meta = {
  component: GuestLayout,
  decorators: [
    (Story) => (
      <div className="sb-router-container">
        <SidebarProvider>
          <Story />
        </SidebarProvider>
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof GuestLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

// Default story without tests
export const Default: Story = {};

// Mobile view story without tests
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile",
    },
  },
};

// Desktop view story without tests
export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};
