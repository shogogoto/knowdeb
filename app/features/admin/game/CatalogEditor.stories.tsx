import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { sampleCatalog } from "~/features/game/catalog.fixtures";
import CatalogEditor from "./CatalogEditor";

export default {
  title: "Admin/GameCatalog",
  component: CatalogEditor,
  args: { kind: "skills" },
  parameters: {
    layout: "fullscreen",
    msw: {
      handlers: [
        http.get("*/admin/game/catalog", () =>
          HttpResponse.json({
            ...sampleCatalog,
            skills: [
              ...sampleCatalog.skills,
              {
                ...sampleCatalog.skills[1],
                id: "bubble",
                name: "バブル",
                effect: "buff",
                stat: "maxHp",
                amount_mode: "percent",
                amount: 100,
              },
            ],
          }),
        ),
        http.put("*/admin/game/catalog", async ({ request }) =>
          HttpResponse.json(await request.json()),
        ),
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-screen">
        <aside className="hidden w-56 shrink-0 border-r md:block">
          サイドバー
        </aside>
        <main className="min-w-0 flex-1">
          <Story />
        </main>
      </div>
    ),
  ],
} satisfies Meta<typeof CatalogEditor>;
export const Skills: StoryObj<typeof CatalogEditor> = {};
export const Items: StoryObj<typeof CatalogEditor> = {
  args: { kind: "items" },
};
export const Enemies: StoryObj<typeof CatalogEditor> = {
  args: { kind: "enemies" },
};
