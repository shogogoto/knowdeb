import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageProvider } from "~/components/Pagenation/PageProvider";
import { SearchByTextKnowdeGetType } from "~/generated/fastAPI.schemas";
import { SearchProvider } from "../../SearchContext";
import { defaultOrderBy } from "../types";
import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // @ts-ignore
  args: {
    setPaging: () => {},
    size: 10,
  },
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
