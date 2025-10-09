import type { Meta, StoryObj } from "@storybook/react-vite";

import Index from "./index";

const meta = {
  component: Index,

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
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  globals: {
    viewport: "mobile1",
  },
};
