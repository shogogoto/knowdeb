import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import {
  defaultBalance,
  emptyAllocation,
  playerStats,
} from "~/features/game/battle";
import PracticeReport from "./PracticeReport";
import { requestCombatSimulation } from "./api";

vi.mock("./api", () => ({ requestCombatSimulation: vi.fn() }));
const request = vi.mocked(requestCombatSimulation);
const player = playerStats(emptyAllocation, defaultBalance);
const enemy = {
  id: "enemy",
  name: "敵",
  hp: 28,
  attack: 16,
  region: 0,
  relations: 0,
  quizIndex: 0,
  quizIndexes: [0],
};
const prediction = {
  player: { hp: 35, attack: 10, defense: 1 },
  enemy: { hp: 28, attack: 16 },
  balance: defaultBalance,
  damage_to_enemy: 10,
  damage_to_player: 15,
  damage_to_enemy_min: 8,
  damage_to_enemy_max: 12,
  damage_to_player_min: 12,
  damage_to_player_max: 18,
  correct_answers_to_defeat: 3,
  incorrect_answers_to_defeat: 3,
};
beforeEach(() => request.mockReset());

it("uses the frozen production inputs and keeps repeated enemy instances separate", async () => {
  request.mockResolvedValue(prediction);
  const props = {
    player,
    settings: defaultBalance,
    enemies: [enemy, { ...enemy, id: "second" }],
    actual: {
      enemy: { correct: 3, damage: 30, defeated: true },
      second: { correct: 1, damage: 8, defeated: false },
    },
    damageReceived: 15,
  };
  const { rerender } = render(<PracticeReport {...props} />);
  await screen.findAllByText("3〜4回");
  expect(request).toHaveBeenCalledWith({
    player: { hp: 35, attack: 10, defense: 1 },
    enemy: { hp: 28, attack: 16 },
    balance: defaultBalance,
  });
  const rows = within(screen.getByRole("table")).getAllByRole("row");
  expect(rows[1]).toHaveTextContent("撃破");
  expect(rows[2]).toHaveTextContent("未撃破");
  expect(within(rows[1]).getAllByRole("cell")[6]).toHaveTextContent("30");
  expect(within(rows[2]).getAllByRole("cell")[6]).toHaveTextContent("8");
  rerender(<PracticeReport {...props} />);
  expect(request).toHaveBeenCalledTimes(2);
});

it("keeps actual results visible when predictions fail and permits retry", async () => {
  request
    .mockRejectedValueOnce(new Error("試算エラー"))
    .mockResolvedValue(prediction);
  render(
    <PracticeReport
      player={player}
      settings={defaultBalance}
      enemies={[enemy]}
      actual={{ enemy: { correct: 1, damage: 10, defeated: false } }}
      damageReceived={18}
    />,
  );
  await screen.findByRole("alert");
  expect(screen.getByText(/被ダメージ合計 18/)).toBeVisible();
  expect(screen.getByText("未撃破")).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: "想定値を再取得" }));
  await screen.findByText("3〜4回");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("shows zero-attack defeats as impossible without infinity or invented actual damage", async () => {
  request.mockResolvedValue({
    ...prediction,
    damage_to_enemy_min: 0,
    damage_to_enemy_max: 0,
    correct_answers_to_defeat: null,
  });
  render(
    <PracticeReport
      player={{ ...player, attack: 0 }}
      settings={defaultBalance}
      enemies={[enemy]}
      actual={{}}
      damageReceived={18}
    />,
  );
  await screen.findByText("撃破不可");
  await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
  const row = within(screen.getByRole("table")).getAllByRole("row")[1];
  expect(within(row).getAllByRole("cell")[6]).toHaveTextContent("0");
  expect(row).toHaveTextContent("未撃破");
});
