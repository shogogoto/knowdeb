import type { Meta, StoryObj } from "@storybook/react-vite";

import { SearchByTextKnowdeGetType } from "~/generated/fastAPI.schemas";
import { SearchProvider } from "../SearchContext";
import Index from "./index";
import { defaultOrderBy } from "./types";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <SearchProvider
        q=""
        searchOption={SearchByTextKnowdeGetType.CONTAINS}
        orderBy={defaultOrderBy}
      >
        <Story />
      </SearchProvider>
    ),
  ],
};
