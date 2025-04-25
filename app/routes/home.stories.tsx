import type { Meta, StoryObj } from "@storybook/react";

import { Home } from "./home";

const meta: Meta<typeof Home> = {
  title: "components/Home",
  component: Home,
  tags: ["autodocs"],
  args: {},
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
