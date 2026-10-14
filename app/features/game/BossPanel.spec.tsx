import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import BossPanel from "./BossPanel";
import { enterDungeon, newSave } from "./domain";

it("offers the fifth-achievement boss without blocking exploration of later regions", async () => {
  const save = enterDungeon(newSave(), "book", "本", 1);
  save.maps = {
    book: {
      current: "@entrance",
      places: Array.from({ length: 25 }, (_, i) => ({
        id: `p${i}`,
        region: Math.floor(i / 5),
      })),
      edges: [],
    },
  };
  const fight = vi.fn();
  render(<BossPanel save={save} busy={false} onChallenge={fight} />);
  const buttons = screen.getAllByRole("button", { name: "挑戦 · 1歩" });
  expect(buttons[0]).toBeEnabled();
  expect(buttons[1]).toBeDisabled();
  await userEvent.setup().click(buttons[0]);
  expect(fight).toHaveBeenCalledWith(5);
});
