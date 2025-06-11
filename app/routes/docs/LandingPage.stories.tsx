import type { Meta, StoryObj } from "@storybook/react-vite";

import LandingPage from "./LandingPage";

const meta = {
  component: LandingPage,
} satisfies Meta<typeof LandingPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Mobile: Story = {
  globals: {
    viewport: { value: "mobile1" },
  },
};

export const Tablet: Story = {
  globals: {
    viewport: { value: "tablet" },
  },
};
