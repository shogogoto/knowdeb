import type { Meta, StoryObj } from "@storybook/react-vite";
import { SidebarProvider } from "~/components/ui/sidebar";
import ButtonNavigation from "./ButtonNavigation";

const meta = {
  component: ButtonNavigation,
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
} satisfies Meta<typeof ButtonNavigation>;

export default meta;

type Story = StoryObj<typeof meta>;

// Default view
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
