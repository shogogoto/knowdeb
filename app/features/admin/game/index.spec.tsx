import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, it, vi } from "vitest";
import GameAdminManager from ".";
import { alignAdminDungeonRegions, listAdminGameDungeons } from "./api";

vi.mock("../battle", () => ({ default: () => null }));
vi.mock("./api", () => ({
  listAdminGameDungeons: vi.fn(),
  rebuildAdminDungeonEnemies: vi.fn(),
  alignAdminDungeonRegions: vi.fn(),
}));

it("aligns only the selected user's dungeon from the admin table", async () => {
  vi.mocked(listAdminGameDungeons).mockResolvedValue([
    {
      user_id: "user-a",
      user_email: "a@example.com",
      resource_id: "book-a",
      resource_name: "本A",
      status: "path",
      region_count: 2,
      quiz_count: 10,
      regions: [],
    },
  ]);
  vi.mocked(alignAdminDungeonRegions).mockResolvedValue({
    changed: true,
    region_count: 2,
    place_count: 7,
  });
  render(
    <MemoryRouter initialEntries={["/admin/game/dungeons"]}>
      <Routes>
        <Route path="/admin/game/:subtab" element={<GameAdminManager />} />
      </Routes>
    </MemoryRouter>,
  );
  await userEvent
    .setup()
    .click(await screen.findByRole("button", { name: "領域を整列" }));
  expect(alignAdminDungeonRegions).toHaveBeenCalledWith("user-a", "book-a");
  await waitFor(() => expect(listAdminGameDungeons).toHaveBeenCalledTimes(2));
});
