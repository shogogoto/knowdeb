import type { Meta, StoryObj } from "@storybook/react";

import SearchResults from "./SearchResults";

const meta = {
  component: SearchResults,
} satisfies Meta<typeof SearchResults>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { data: [] } };
