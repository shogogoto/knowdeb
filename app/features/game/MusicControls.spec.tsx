import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MusicControls from "./MusicControls";
import { setMusicPreferences } from "./music";

beforeEach(() => {
  localStorage.clear();
  setMusicPreferences({ enabled: false });
});
it("starts off and toggles music directly, preserving the choice across surfaces", async () => {
  render(
    <>
      <MusicControls />
      <MusicControls />
    </>,
  );
  const buttons = screen.getAllByRole("button", { name: "BGM" });
  expect(buttons[0]).toHaveAttribute("aria-pressed", "false");
  await userEvent.setup().click(buttons[0]);
  for (const button of buttons)
    expect(button).toHaveAttribute("aria-pressed", "true");
  expect(JSON.parse(localStorage.getItem("game-bgm") ?? "null")).toEqual({
    enabled: true,
  });
  expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  await userEvent.setup().click(buttons[1]);
  expect(buttons[0]).toHaveAttribute("aria-pressed", "false");
});
