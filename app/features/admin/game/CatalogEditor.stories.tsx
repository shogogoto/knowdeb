import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { sampleCatalog } from "~/features/game/catalog.fixtures";
import CatalogEditor from "./CatalogEditor";

const meta = {
  title: "Admin/GameCatalog",
  component: CatalogEditor,
  parameters: {
    layout: "fullscreen",
    msw: {
      handlers: [
        http.get("*/admin/game/catalog", () =>
          HttpResponse.json(sampleCatalog),
        ),
        http.put("*/admin/game/catalog", async ({ request }) =>
          HttpResponse.json(await request.json()),
        ),
      ],
    },
  },
} satisfies Meta<typeof CatalogEditor>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Skills: Story = { args: { kind: "skills" } };
export const Items: Story = { args: { kind: "items" } };
export const Enemies: Story = { args: { kind: "enemies" } };
