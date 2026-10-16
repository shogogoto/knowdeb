import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { SWRConfig } from "swr";
import GambitEditor from "./GambitEditor";
import { sampleCatalog } from "./catalog.fixtures";
import { newSave } from "./domain";

const meta = {
  title: "Game/Gambits",
  component: GambitEditor,
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map() }}>
        <div className="mx-auto max-w-lg p-4">
          <Story />
        </div>
      </SWRConfig>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get("*/game/catalog", () => HttpResponse.json(sampleCatalog)),
        http.put("*/game/gambits", async ({ request }) => {
          const { rules } = (await request.json()) as { rules: unknown[] };
          return HttpResponse.json({
            revision: 1,
            save: { ...newSave(), gambits: rules },
          });
        }),
      ],
    },
  },
} satisfies Meta<typeof GambitEditor>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Priorities: Story = {
  args: {
    save: {
      ...newSave(),
      gambits: [
        {
          enabled: true,
          condition: "hp_below",
          threshold: 30,
          action: "skill",
          definition_id: "heal",
        },
        {
          enabled: true,
          condition: "always",
          threshold: 30,
          action: "skill",
          definition_id: "fire",
        },
      ],
    },
    revision: 0,
    onSaved: () => undefined,
  },
};
