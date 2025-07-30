import type { Meta, StoryObj } from "@storybook/react-vite";

import { getDetailKnowdeSentenceSentenceIdGetMockHandler } from "~/generated/knowde/knowde.msw";
import { fixtureDetail1 } from "./fixture";
import Index from "./index";

const meta = {
  component: Index,
  parameters: {
    msw: {
      handlers: [
        getDetailKnowdeSentenceSentenceIdGetMockHandler(fixtureDetail1),
      ],
    },
  },
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: "ddeebd6f-8550-4839-96a4-7adf75df8622" },
};
