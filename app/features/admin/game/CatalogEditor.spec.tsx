import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { vi } from "vitest";
import { sampleCatalog } from "~/features/game/catalog.fixtures";
import CatalogEditor from "./CatalogEditor";

const saved = vi.fn();
const server = setupServer(
  http.get("*/admin/game/catalog", () => HttpResponse.json(sampleCatalog)),
  http.put("*/admin/game/catalog", async ({ request }) => {
    const value = await request.json();
    saved(value);
    return HttpResponse.json(value);
  }),
);
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());

it("chooses a named icon from the searchable asset list and saves the skill", async () => {
  render(<CatalogEditor kind="skills" />);
  const user = userEvent.setup();
  const skill = await screen.findByRole("row", { name: "ファイア" });
  await user.click(
    within(skill).getByRole("button", { name: "ファイアの素材を選ぶ" }),
  );
  const dialog = screen.getByRole("dialog", { name: "ゲーム素材一覧" });
  await user.type(
    within(dialog).getByRole("textbox", { name: "素材を検索" }),
    "猫",
  );
  await user.click(within(dialog).getByRole("button", { name: "猫" }));
  const amount = within(skill).getByLabelText("加算ダメージ");
  await user.clear(amount);
  await user.type(amount, "7");
  await user.click(screen.getByRole("button", { name: "保存" }));
  await waitFor(() => expect(saved).toHaveBeenCalled());
  expect(saved.mock.calls[0][0].skills[0]).toMatchObject({
    id: "fire",
    icon: "cat",
    amount: 7,
  });
  expect(saved.mock.calls[0][0].items).toEqual(sampleCatalog.items);
  expect(await screen.findByText("保存しました")).toBeVisible();
});

it("references a skill from an item rather than defining a separate effect", async () => {
  render(<CatalogEditor kind="items" />);
  const user = userEvent.setup();
  await user.selectOptions(await screen.findByLabelText("発動スキル"), "heal");
  await user.click(screen.getByRole("button", { name: "保存" }));
  await waitFor(() => expect(saved).toHaveBeenCalled());
  expect(saved.mock.calls[0][0].items[0]).toMatchObject({
    id: "healing_potion",
    skill_id: "heal",
  });
});

it("defines timed percentage buffs with an explicit stacking limit", async () => {
  render(<CatalogEditor kind="skills" />);
  const user = userEvent.setup();
  await screen.findByRole("row", { name: "ファイア" });
  await user.click(screen.getByRole("button", { name: "buffスキルを追加" }));
  const skill = within(
    screen.getByRole("region", { name: "buffスキル" }),
  ).getByRole("row", { name: "新しいスキル" });
  await user.selectOptions(
    within(skill).getByLabelText("対象ステータス"),
    "defense",
  );
  await user.selectOptions(
    within(skill).getByLabelText("効果量の指定"),
    "percent",
  );
  for (const [label, value] of [
    ["効果量", "30"],
    ["持続ターン", "2"],
    ["重複上限", "3"],
  ]) {
    const input = within(skill).getByLabelText(label, { exact: true });
    await user.clear(input);
    await user.type(input, value);
  }
  await user.click(screen.getByRole("button", { name: "保存" }));
  await waitFor(() => expect(saved).toHaveBeenCalled());
  expect(
    saved.mock.calls[0][0].skills.find(
      (s: { effect: string }) => s.effect === "buff",
    ),
  ).toMatchObject({
    effect: "buff",
    target: "self",
    stat: "defense",
    amount_mode: "percent",
    amount: 30,
    duration_turns: 2,
    stack_limit: 3,
  });
});

it("uses one field per column, group-specific effects, and saves the selected animation", async () => {
  render(<CatalogEditor kind="skills" />);
  const user = userEvent.setup();
  const fire = await screen.findByRole("row", { name: "ファイア" });
  expect(
    within(fire)
      .getAllByRole("option")
      .filter((o) => o.parentElement?.getAttribute("aria-label") === "効果")
      .map((o) => o.getAttribute("value")),
  ).toEqual(["attack"]);
  expect(screen.queryByLabelText("直接使用可")).not.toBeInTheDocument();
  expect(screen.queryByLabelText("専用クイズ")).not.toBeInTheDocument();
  for (const cell of within(fire).getAllByRole("cell")) {
    expect(cell.querySelectorAll("input, select").length).toBeLessThanOrEqual(
      1,
    );
  }
  const recovery = screen.getByRole("region", { name: "回復スキル" });
  const heal = within(recovery).getByRole("row", { name: "ケアル" });
  expect(
    within(within(heal).getByLabelText("効果"))
      .getAllByRole("option")
      .map((o) => o.getAttribute("value")),
  ).toEqual(["heal_hp", "heal_mp"]);
  await user.selectOptions(within(heal).getByLabelText("演出"), "ripple");
  await user.click(
    within(heal).getByRole("button", { name: "ケアルの演出を再生" }),
  );
  expect(
    heal.querySelector('[data-skill-animation="ripple"]'),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "保存" }));
  await waitFor(() => expect(saved).toHaveBeenCalled());
  expect(
    saved.mock.calls[0][0].skills.find((s: { id: string }) => s.id === "heal")
      .animation,
  ).toBe("ripple");
});

it("configures enemy icons and attacks and surfaces save failures", async () => {
  server.use(
    http.put("*/admin/game/catalog", () =>
      HttpResponse.json(
        { detail: "スキルの参照が不正です。" },
        { status: 422 },
      ),
    ),
  );
  render(<CatalogEditor kind="enemies" />);
  const user = userEvent.setup();
  await user.selectOptions(await screen.findByLabelText("攻撃スキル"), "fire");
  await user.click(screen.getByRole("checkbox", { name: "ボス用" }));
  await user.click(screen.getByRole("button", { name: "保存" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "スキルの参照が不正です。",
  );
  expect(screen.queryByText("保存しました")).not.toBeInTheDocument();
  expect(screen.getByLabelText("攻撃スキル")).toHaveValue("fire");
});

it("filters boss art and saves the registered asset ID for an enemy", async () => {
  render(<CatalogEditor kind="enemies" />);
  const user = userEvent.setup();
  await user.click(
    await screen.findByRole("button", { name: "ゴーストの素材を選ぶ" }),
  );
  const dialog = screen.getByRole("dialog", { name: "ゲーム素材一覧" });
  await user.click(within(dialog).getByRole("button", { name: "ボス" }));
  expect(
    within(dialog).queryByRole("button", { name: "インクスライム" }),
  ).not.toBeInTheDocument();
  await user.click(within(dialog).getByRole("button", { name: "水晶竜" }));
  await user.click(screen.getByRole("button", { name: "保存" }));
  await waitFor(() => expect(saved).toHaveBeenCalled());
  expect(saved.mock.calls[0][0].enemies[0].icon).toBe("art_crystal_dragon");
});
