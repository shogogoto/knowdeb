import type { Meta, StoryObj } from "@storybook/react-vite";

import { PageProvider } from "~/components/Pagenation/PageProvider";
import { SearchByTextKnowdeGetType } from "~/shared/generated/fastAPI.schemas";
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
      <PageProvider pageSize={10}>
        <SearchProvider
          q=""
          searchOption={SearchByTextKnowdeGetType.CONTAINS}
          orderBy={defaultOrderBy}
        >
          <Story />
        </SearchProvider>
      </PageProvider>
    ),
  ],
};
