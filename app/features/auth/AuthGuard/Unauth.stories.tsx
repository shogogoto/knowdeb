import type { Meta, StoryObj } from "@storybook/react";
import Unauth from "./Unauth";

const meta = {
  title: "Features/Auth/AuthGuard/Unauth",
  component: Unauth,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Unauth>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
