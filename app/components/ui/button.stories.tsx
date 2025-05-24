import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    size: "sm",
    disabled: false,
    // onClick: action("default click"),
    children: "Default Button",
  },
  //decorators: [(Story) => <Story>Click me</Story>],
};
