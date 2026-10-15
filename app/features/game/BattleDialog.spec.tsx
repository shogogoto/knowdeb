import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import BattleDialog from "./BattleDialog";
import { enterDungeon, move, newSave } from "./domain";

const battle = () => {
  const run = move(
    enterDungeon(newSave(), "book", "本", 1),
    "sentence",
    0.1,
  ).run;
  if (!run) throw new Error("Missing run");
  return run;
};

it("toggles a real quiz choice on Space keydown exactly once, ignoring held keys", async () => {
  const toggle = vi.fn();
  render(
    <BattleDialog run={battle()} busy={false}>
      <button type="button" data-quiz-option-index={1} onClick={toggle}>
        実クイズの選択肢
      </button>
    </BattleDialog>,
  );
  const choice = screen.getByRole("button", { name: "実クイズの選択肢" });
  choice.focus();
  fireEvent.keyDown(choice, { key: " " });
  expect(toggle).toHaveBeenCalledTimes(1);
  fireEvent.keyDown(choice, { key: " ", repeat: true });
  expect(toggle).toHaveBeenCalledTimes(1);
  // The browser must not additionally activate the native Space keyup click.
  await userEvent.setup().keyboard(" ");
  expect(toggle).toHaveBeenCalledTimes(2);
});

it("separates enemy HP from named player HP in the floating battle", () => {
  render(
    <BattleDialog run={battle()} playerName="テストプレイヤー" busy={false}>
      <button type="button">回答</button>
    </BattleDialog>,
  );
  const dialog = screen.getByRole("dialog", { name: "敵と遭遇" });
  expect(within(dialog).getByRole("region", { name: "敵" })).toHaveTextContent(
    "敵HP 20/20",
  );
  const player = within(dialog).getByRole("region", { name: "プレイヤー" });
  const enemy = within(dialog).getByRole("region", { name: "敵" });
  expect(
    enemy.compareDocumentPosition(player) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  expect(player).toHaveTextContent("テストプレイヤー");
  expect(within(player).getByText("35/35")).toBeVisible();
  expect(
    within(player).getByRole("progressbar", { name: "プレイヤーHP" }),
  ).toHaveAttribute("aria-valuenow", "35");
});

it("closes with Escape and reopens the same battle", async () => {
  render(
    <BattleDialog run={battle()} busy={false}>
      <button type="button">回答</button>
    </BattleDialog>,
  );
  const user = userEvent.setup();
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "戦闘を開く" }));
  expect(screen.getByRole("dialog")).toHaveTextContent("敵HP 20/20");
});

it("does not dismiss while a game save is in progress", async () => {
  render(
    <BattleDialog run={battle()} busy>
      <button type="button">回答</button>
    </BattleDialog>,
  );
  await userEvent.setup().keyboard("{Escape}");
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});

it("toggles BGM directly without opening another panel", async () => {
  render(
    <BattleDialog run={battle()} busy={false}>
      <button type="button">回答</button>
    </BattleDialog>,
  );
  const user = userEvent.setup();
  const toggle = screen.getByRole("button", { name: "BGM" });
  await user.click(toggle);
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  expect(screen.getByRole("dialog", { name: "敵と遭遇" })).toBeVisible();
  await user.keyboard("{Escape}");
  expect(
    screen.queryByRole("dialog", { name: "敵と遭遇" }),
  ).not.toBeInTheDocument();
});
