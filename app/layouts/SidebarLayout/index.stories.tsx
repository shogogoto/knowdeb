import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthProvider } from "~/features/auth/AuthProvider";
import Index from "./index";

const meta = {
  component: Index,
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    reactRouter: {
      route: "/",
      outlet: (
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey:
            <div key={i}>Item {i}</div>
          ))}
        </div>
      ),
    },
  },
};

export const Mobile: Story = {
  parameters: {
    reactRouter: {
      route: "/",
      outlet: (
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey:
            <div key={i}>Item {i}</div>
          ))}
        </div>
      ),
    },
  },
  globals: {
    viewport: "mobile1",
  },
};
