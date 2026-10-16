import { render, screen, within } from "@testing-library/react";
import AchievementsPanel from "./AchievementsPanel";
import { enterDungeon, newSave } from "./domain";

it("lists each dungeon once using explored achievement rather than clear counts", () => {
  const save = enterDungeon(newSave(), "book", "現在の本", 1);
  save.clears = { book: 99 };
  save.visitedDungeons = ["book"];
  save.unlockedDungeons = [
    { sourceId: "book", resourceId: "other", name: "他の本", achievement: 3 },
  ];
  save.maps = {
    book: {
      current: "@entrance",
      places: Array.from({ length: 12 }, (_, i) => ({
        id: String(i),
        region: Math.floor(i / 5),
      })),
      edges: [],
    },
  };
  render(<AchievementsPanel save={save} resources={[]} />);
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
  const current = screen.getByText("現在の本").closest("li");
  expect(current).not.toBeNull();
  expect(within(current as HTMLElement).getByText("達成度 2")).toBeVisible();
  expect(screen.getByText("達成度 3")).toBeVisible();
  expect(screen.queryByText("99回")).not.toBeInTheDocument();
});

it("shows an empty state before any dungeon is explored", () => {
  render(<AchievementsPanel save={newSave()} resources={[]} />);
  expect(screen.getByText("まだダンジョンを探索していません。")).toBeVisible();
});
