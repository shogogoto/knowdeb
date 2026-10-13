import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import MusicControls from "./MusicControls";
import { setMusicPreferences } from "./music";

beforeEach(() => {
  localStorage.clear();
  setMusicPreferences({ enabled: true, volume: 0.25 });
});

it("keeps the settings panel inside the browser fullscreen element", async () => {
  const { container } = render(<MusicControls />);
  Object.defineProperty(document, "fullscreenElement", {
    configurable: true,
    get: () => container,
  });
  try {
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "BGM設定" }));
    expect(container).toContainElement(
      screen.getByRole("slider", { name: "BGM音量" }),
    );
  } finally {
    Reflect.deleteProperty(document, "fullscreenElement");
    vi.restoreAllMocks();
  }
});

it("provides keyboard-accessible volume and mute controls shared across surfaces", async () => {
  render(
    <>
      <MusicControls />
      <MusicControls />
    </>,
  );
  const user = userEvent.setup();
  await user.click(screen.getAllByRole("button", { name: "BGM設定" })[0]);
  const volume = screen.getByRole("slider", { name: /音量/ });
  fireEvent.change(volume, { target: { value: "40" } });
  expect(localStorage.getItem("game-bgm")).toContain('"volume":0.4');
  await user.click(screen.getByRole("button", { name: "オン" }));
  expect(screen.getByRole("button", { name: "オフ" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await user.keyboard("{Escape}");
  await user.click(screen.getAllByRole("button", { name: "BGM設定" })[1]);
  expect(screen.getByRole("slider", { name: /音量/ })).toHaveValue("40");
  expect(screen.getByRole("button", { name: "オフ" })).toBeVisible();
});
