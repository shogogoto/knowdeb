import type { Meta, StoryObj } from "@storybook/react-vite";

import { getDetailKnowdeSentenceSentenceIdGetMockHandler } from "~/shared/generated/knowde/knowde.msw";
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
  args: { id: "d9442f16-504e-4284-bac1-cc0be01b812f" },
};
