import type { Meta, StoryObj } from "@storybook/react-vite";

import PageProvider from "~/components/Pagenation/PageProvider";
import { fixtureSearchResult } from "../detail/fixture";
import Index from "./index";

const meta = {
  component: Index,
  decorators: [
    (Story) => (
      <PageProvider>
        <Story />
      </PageProvider>
    ),
  ],
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: fixtureSearchResult,
  },
};
