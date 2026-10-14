import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { SWRConfig } from "swr";
import { beforeEach, expect, it, vi } from "vitest";
import EconomyPanel from "./EconomyPanel";
import { gameRequest } from "./battle";
import { enterDungeon, newSave } from "./domain";

vi.mock("./battle", async (original) => ({
  ...(await original<typeof import("./battle")>()),
  gameRequest: vi.fn(),
}));
const products = [
  { id: "bronze_sword", name: "銅の剣", price: 100, kind: "weapon", amount: 3 },
  {
    id: "step_potion",
    name: "歩数回復薬",
    price: null,
    kind: "moves",
    amount: 3,
  },
];
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(gameRequest).mockResolvedValue({
    products,
    review: { done: 3, total: 30, claimed: false },
  });
});
function show(shop: boolean, disabled = false) {
  const onSaved = vi.fn();
  const save = {
    ...enterDungeon(newSave(), "book", "本", 1),
    economy: {
      gold: 120,
      inventory: { step_potion: 1 },
      weapon: null,
      weapon_attack: 0,
    },
  };
  if (save.run) save.run = { ...save.run, moves: 5, phase: "rest" };
  render(
    <MemoryRouter>
      <SWRConfig value={{ provider: () => new Map() }}>
        <EconomyPanel
          userId="user"
          save={save}
          revision={7}
          shop={shop}
          disabled={disabled}
          onSaved={onSaved}
          onTab={vi.fn()}
        />
      </SWRConfig>
    </MemoryRouter>,
  );
  return { onSaved, save };
}
it("purchases with the displayed state's revision and applies the returned balance", async () => {
  const { onSaved, save } = show(true);
  const button = await screen.findByRole("button", { name: "100 G" });
  const result = {
    revision: 8,
    save: { ...save, economy: { ...save.economy, gold: 20 } },
  };
  vi.mocked(gameRequest).mockResolvedValueOnce(result);
  await userEvent.setup().click(button);
  expect(gameRequest).toHaveBeenCalledWith("shop/buy", {
    revision: 7,
    product_id: "bronze_sword",
  });
  expect(onSaved).toHaveBeenCalledWith(result);
});
it("uses an owned step potion and offers a review link", async () => {
  show(false);
  const name = await screen.findByText("歩数回復薬");
  const row = name.closest("div.flex");
  if (!row) throw new Error("Missing inventory row");
  await userEvent
    .setup()
    .click(within(row as HTMLElement).getByRole("button", { name: "使う" }));
  expect(gameRequest).toHaveBeenCalledWith("inventory/use", {
    revision: 7,
    product_id: "step_potion",
  });
  expect(screen.getByRole("link", { name: "復習へ" })).toHaveAttribute(
    "href",
    "/review?preset=default",
  );
});
it("disables purchases during battle", async () => {
  show(true, true);
  expect(await screen.findByRole("button", { name: "100 G" })).toBeDisabled();
});
