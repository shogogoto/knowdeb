import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
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
  expect(skill.closest("fieldset")).toHaveClass("min-w-0");
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

it("uses one field per column and selects each skill's animation from its gallery", async () => {
  render(<CatalogEditor kind="skills" />);
  const user = userEvent.setup();
  const fire = await screen.findByRole("row", { name: "ファイア" });
  expect(
    within(within(fire).getByLabelText("効果"))
      .getAllByRole("option")
      .map((o) => o.getAttribute("value")),
  ).toEqual(["attack"]);
  expect(
    screen.queryByRole("columnheader", { name: "プレビュー" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "演出一覧" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("combobox", { name: "演出" }),
  ).not.toBeInTheDocument();
  for (const cell of within(fire).getAllByRole("cell"))
    expect(cell.querySelectorAll("input,select").length).toBeLessThanOrEqual(1);
  const heal = screen.getByRole("row", { name: "ケアル" });
  await user.click(
    within(heal).getByRole("button", { name: "ケアルの演出を選ぶ" }),
  );
  const gallery = screen.getByRole("dialog", { name: "ケアルの演出" });
  await user.click(
    within(gallery).getByRole("button", { name: "回復の波紋をプレビュー" }),
  );
  await user.click(
    within(gallery).getByRole("button", { name: "この演出を使う" }),
  );
  await user.click(screen.getByRole("button", { name: "保存" }));
  await waitFor(() => expect(saved).toHaveBeenCalled());
  expect(
    saved.mock.calls[0][0].skills.find((s: { id: string }) => s.id === "heal")
      .animation,
  ).toBe("ripple");
  expect(saved.mock.calls[0][0].skills[0]).toEqual(sampleCatalog.skills[0]);
});

it("opens the skill's static gallery and discards the selection on Escape", async () => {
  render(<CatalogEditor kind="skills" />);
  const user = userEvent.setup();
  await screen.findByRole("row", { name: "ファイア" });
  const trigger = screen.getByRole("button", { name: "ファイアの演出を選ぶ" });
  await user.click(trigger);
  const gallery = screen.getByRole("dialog", { name: "ファイアの演出" });
  expect(
    within(gallery).getByRole("button", { name: "火球をプレビュー" }),
  ).toBeVisible();
  expect(gallery.querySelectorAll('img[src$="-poster.webp"]')).toHaveLength(40);
  expect(gallery.querySelector(".skill-sprite")).not.toBeInTheDocument();
  await user.click(
    within(gallery).getByRole("button", { name: "火球をプレビュー" }),
  );
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  expect(trigger).toHaveTextContent("なし");
  await user.click(trigger);
  expect(
    screen.getByRole("button", { name: "なしをプレビュー" }),
  ).toHaveAttribute("aria-pressed", "true");
  await user.click(screen.getByRole("button", { name: "閉じる" }));
  expect(saved).not.toHaveBeenCalled();
});

it.each([
  ["火球", "oga_spell_3"],
  ["樹木の加護", "oga_nature_1"],
  ["魔力の放電", "oga_arcane_5"],
  ["岩砕き", "oga_earth_3"],
  ["時の魔法陣", "oga_cosmic_2"],
])(
  "previews %s and applies it only to the originating skill on confirmation",
  async (label, id) => {
    render(<CatalogEditor kind="skills" />);
    const user = userEvent.setup();
    const trigger = await screen.findByRole("button", {
      name: "ファイアの演出を選ぶ",
    });
    await user.click(trigger);
    const gallery = screen.getByRole("dialog", { name: "ファイアの演出" });
    const tile = within(gallery).getByRole("button", {
      name: `${label}をプレビュー`,
    });
    await user.click(tile);
    expect(
      tile.querySelector(`img[src="/game-assets/effects/${id}.webp"]`),
    ).toBeInTheDocument();
    const stage = tile.querySelector(".skill-sprite");
    if (!stage) throw new Error("Missing animated thumbnail");
    fireEvent.animationEnd(stage, { animationName: "skill-sprite-play" });
    fireEvent(stage, new Event("webkitAnimationEnd", { bubbles: true }));
    expect(tile.querySelector('img[src$="-poster.webp"]')).toBeInTheDocument();
    await user.click(within(gallery).getByRole("button", { name: "閉じる" }));
    expect(trigger).toHaveTextContent("なし");
    expect(saved).not.toHaveBeenCalled();
    await user.click(trigger);
    await user.click(
      screen.getByRole("button", { name: `${label}をプレビュー` }),
    );
    await user.click(screen.getByRole("button", { name: "この演出を使う" }));
    expect(trigger).toHaveTextContent(label);
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    expect(
      screen.getByRole("button", { name: `${label}をプレビュー` }),
    ).toHaveAttribute("aria-pressed", "true");
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "保存" }));
    await waitFor(() => expect(saved).toHaveBeenCalled());
    expect(saved.mock.calls[0][0].skills[0].animation).toBe(id);
    expect(
      saved.mock.calls[0][0].skills.find(
        (s: { id: string }) => s.id === "heal",
      ),
    ).toEqual(sampleCatalog.skills.find((s) => s.id === "heal"));
  },
);

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
