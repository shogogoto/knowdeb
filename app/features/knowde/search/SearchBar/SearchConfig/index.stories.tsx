import type { Meta, StoryObj } from "@storybook/react-vite";
import { PProvider } from "~/components/Pagenation/reprovider";
import { SearchByTextKnowdeGetType } from "~/generated/fastAPI.schemas";
import { SearchProvider } from "../../SearchContext";
import { defaultOrderBy } from "../types";
import Index from "./index";

const meta = {
  title: "SearchConfig",
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
      <PProvider total={100} pageSize={10} initial={1}>
        <SearchProvider
          q=""
          searchOption={SearchByTextKnowdeGetType.CONTAINS}
          orderBy={defaultOrderBy}
        >
          <Story />
        </SearchProvider>
      </PProvider>
    ),
  ],
};
