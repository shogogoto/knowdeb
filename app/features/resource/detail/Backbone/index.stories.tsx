import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { toGraph } from "~/shared/lib/network";
import { ResourceDetailProvider } from "../Context";
import { TraceMemoryProvider } from "../TraceMemory/Context";
import { resourceDetailFiture2 } from "./fixture2";
import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    startId: "08eccb9c-d31e-450a-8e82-12398b51af28",
  },
  decorators: [
    (Story) => {
      const { g, resource_info, uids, terms } = resourceDetailFiture2;
      const graph = toGraph(g);

      return (
        <MemoryRouter>
          <ResourceDetailProvider
            graph={graph}
            terms={terms}
            uids={uids}
            rootId={resource_info.resource.uid}
            resource_info={resource_info}
          >
            <TraceMemoryProvider>
              <div className="w-full h-full">
                aaa
                <Story />
              </div>
            </TraceMemoryProvider>
          </ResourceDetailProvider>
        </MemoryRouter>
      );
    },
  ],
};
