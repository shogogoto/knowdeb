import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import {
  defaultBalance,
  emptyAllocation,
  playerStats,
} from "~/features/game/battle";
import PracticeBattle from "./PracticeBattle";
import type {
  EnemyBalanceSimulation,
  PracticeInput,
  PracticeSession,
  SimulatedPracticeInput,
} from "./api";

vi.mock("~/features/tanbun/detail/Preview", () => ({
  useTanbunPreview: () => ({ openPreview: vi.fn(), preview: null }),
}));
vi.mock("~/features/quiz/QuizReportButton", () => ({
  default: () => <button type="button">本番の通報操作</button>,
}));
vi.mock("~/features/user/UserAvatar", () => ({
  default: ({
    user,
  }: { user?: { avatar_url?: string; display_name?: string } }) =>
    user?.avatar_url ? (
      <img alt={user.display_name ?? ""} src={user.avatar_url} />
    ) : null,
}));
const preparations: SimulatedPracticeInput[] = [];
const turns: unknown[] = [];
const draft = { ...defaultBalance, base_hp: 60, damage_variance_percent: 0 };
const trial: EnemyBalanceSimulation = {
  power: 250,
  achievement: 2,
  balance: defaultBalance,
  pool_quiz_count: 10,
  average_relations: 0,
  min_encounter_enemies: 1,
  max_encounter_enemies: 1,
  requested_enemy_types: 1,
  requested_quiz_count: 1,
  assigned_quiz_count: 1,
  unassigned_quiz_count: 9,
  warnings: [],
  enemies: [{ index: 1, quiz_count: 1, hp: 5, attack: 12, relations: 0 }],
};
const trials = [{ id: "trial", name: "試算 1", simulation: trial }];
const userPoints = { hp: 2, attack: 8, defense: 1, seconds: 2 };
const server = setupServer(
  http.get("*/admin/users/:uid/game/allocation", () =>
    HttpResponse.json(userPoints),
  ),
  http.get("*/admin/users", () =>
    HttpResponse.json([
      {
        uid: "user",
        email: "admin@test",
        display_name: "管理者",
        username: null,
        avatar_url: "https://example.com/admin.png",
      },
      {
        uid: "other",
        email: "player@test",
        display_name: "プレイヤーB",
        username: null,
        avatar_url: "https://example.com/player-b.png",
      },
    ]),
  ),
  http.get("*/admin/game/dungeons", () =>
    HttpResponse.json([
      {
        user_id: "user",
        user_email: "admin@test",
        resource_id: "book",
        resource_name: "模擬用の本",
        status: "path",
        region_count: 1,
        quiz_count: 1,
        regions: [{ level: 1, quizzes: [] }],
      },
    ]),
  ),
  http.post(
    "*/admin/settings/game-balance/practice/simulation",
    async ({ request }) => {
      const input = (await request.json()) as SimulatedPracticeInput;
      preparations.push(input);
      const stats = playerStats(
        input.allocation ?? emptyAllocation,
        input.balance,
      );
      const quiz = {
        quiz_id: "quiz",
        quiz_type: "sent2term",
        prompt: { subject: "模擬問題", answer_kind: "term" },
        statement: "説明",
        options: { yes: "正解の選択肢", no: "誤答の選択肢" },
        correct: ["yes"],
        no_correct_option: false,
        created: "2026-10-12T00:00:00Z",
      };
      return HttpResponse.json({
        seed: input.seed,
        server_now: Date.now(),
        context: {
          balance: input.balance,
          enemies: [
            {
              id: "enemy",
              name: "模擬敵",
              quizIndex: 0,
              quizIndexes: [0],
              hp: input.simulation.enemies[0].hp,
              attack: input.simulation.enemies[0].attack,
              relations: 0,
              region: 0,
            },
          ],
        },
        state: {
          revision: 0,
          save: {
            version: 2,
            clears: {},
            allocation: input.allocation ?? emptyAllocation,
            content: { knowledge: [], quizzes: [quiz] },
            run: {
              resourceId: "book",
              name: "模擬用の本",
              hp: stats.maxHp,
              ...stats,
              moves: 0,
              kills: 0,
              enemyHp: 0,
              enemyMaxHp: 1,
              quizCursor: 0,
              readIds: [],
              phase: "battle",
              answerDeadline: Date.now() + stats.answerSeconds * 1000,
            },
            battle: {
              id: "practice-1",
              turn: 0,
              region: 0,
              checkpoint: "@entrance",
              enemies: ["enemy"],
              quizIndices: { enemy: 0 },
            },
          },
        },
      });
    },
  ),
  http.post(
    "*/admin/settings/game-balance/practice/turn",
    async ({ request }) => {
      const body = (await request.json()) as {
        session: PracticeSession;
        turn: { answers: Record<string, string[]>; retreat: boolean };
      };
      turns.push(body);
      const correct = body.turn.answers.enemy?.includes("yes") ?? false;
      return HttpResponse.json({
        damage: correct ? 0 : 11,
        results: Object.fromEntries(
          Object.keys(body.turn.answers).map((id) => [id, correct]),
        ),
        state: {
          ...body.session.state,
          save: {
            ...body.session.state.save,
            battle: null,
            battleFeedback: "模擬ターン精算",
            run: {
              ...body.session.state.save.run,
              hp: correct ? 60 : 49,
              phase: "path",
            },
          },
        },
      });
    },
  ),
);
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  preparations.length = 0;
  turns.length = 0;
  vi.restoreAllMocks();
});
afterAll(() => server.close());

it("selects a player's appearance while using draft initial stats and the enemy trial", async () => {
  render(
    <MemoryRouter>
      <PracticeBattle settings={draft} trials={trials} />
    </MemoryRouter>,
  );
  const user = userEvent.setup();
  const player = screen.getByRole("combobox", { name: "プレイヤー" });
  await waitFor(() => expect(player).toBeEnabled());
  await screen.findByRole("option", { name: /プレイヤーB/ });
  await user.selectOptions(player, "other");
  const start = screen.getByRole("button", {
    name: "現在の設定で模擬戦を開始",
  });
  await waitFor(() => expect(start).toBeEnabled());
  await user.click(start);
  await screen.findByRole("heading", { name: "模擬戦（保存されません）" });
  expect(document.querySelector('img[alt="プレイヤーB"]')).toHaveAttribute(
    "src",
    "https://example.com/player-b.png",
  );
  expect(preparations[0]).toEqual({
    balance: draft,
    simulation: trial,
    seed: 1,
    allocation: userPoints,
  });
  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
});

it("explains a missing deployment route without confusing it with missing data", async () => {
  server.use(
    http.post("*/admin/settings/game-balance/practice/simulation", () =>
      HttpResponse.json({ detail: "Not Found" }, { status: 404 }),
    ),
  );
  render(
    <MemoryRouter>
      <PracticeBattle settings={draft} trials={trials} />
    </MemoryRouter>,
  );
  const start = screen.getByRole("button", {
    name: "現在の設定で模擬戦を開始",
  });
  await waitFor(() => expect(start).toBeEnabled());
  await userEvent.setup().click(start);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "模擬戦APIがサーバーに未反映",
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("keeps practice visible before any trial and can use a real dungeon", async () => {
  let requestInput: PracticeInput | undefined;
  server.use(
    http.post("*/admin/settings/game-balance/practice", async ({ request }) => {
      requestInput = (await request.json()) as PracticeInput;
      return HttpResponse.json(
        { detail: "ダンジョンの条件を確認" },
        { status: 409 },
      );
    }),
  );
  render(
    <MemoryRouter>
      <PracticeBattle settings={draft} />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", { name: "実戦形式の模擬戦" }),
  ).toBeVisible();
  const user = userEvent.setup();
  const start = screen.getByRole("button", {
    name: "現在の設定で模擬戦を開始",
  });
  await waitFor(() => expect(start).toBeEnabled());
  await user.click(start);
  await screen.findByText("ダンジョンの条件を確認");
  expect(requestInput).toEqual({
    user_id: "user",
    resource_id: "book",
    level: 1,
    seed: 1,
    balance: draft,
    allocation: emptyAllocation,
  });
  expect(preparations).toHaveLength(0);
});

it("loads real points and edits only the disposable player before starting", async () => {
  render(
    <MemoryRouter>
      <PracticeBattle settings={draft} trials={trials} />
    </MemoryRouter>,
  );
  const user = userEvent.setup();
  await screen.findByRole("option", { name: /プレイヤーB/ });
  await user.selectOptions(screen.getByLabelText("プレイヤー"), "other");
  const attack = screen.getByLabelText("攻ポイント");
  await waitFor(() => expect(attack).toHaveValue(8));
  await user.clear(attack);
  await user.type(attack, "9");
  expect(
    screen.getByText(/プレイヤー: HP 70 · 攻 28 · 守 2 · 51秒/),
  ).toBeVisible();
  await user.click(
    screen.getByRole("button", { name: "現在の設定で模擬戦を開始" }),
  );
  await screen.findByRole("dialog");
  expect(preparations[0].allocation).toEqual({ ...userPoints, attack: 9 });
  expect(
    screen.getByRole("progressbar", { name: "プレイヤーHP" }),
  ).toHaveAttribute("aria-valuenow", "70");
});

it("uses real battle UI with draft settings, records results and replays without live writes", async () => {
  render(
    <MemoryRouter>
      <PracticeBattle settings={draft} trials={trials} />
    </MemoryRouter>,
  );
  const user = userEvent.setup();
  const start = screen.getByRole("button", {
    name: "現在の設定で模擬戦を開始",
  });
  await waitFor(() => expect(start).toBeEnabled());
  await user.click(start);
  expect(
    await screen.findByRole("heading", { name: "模擬戦（保存されません）" }),
  ).toBeInTheDocument();
  expect(preparations[0].balance).toEqual(draft);
  expect(
    screen.getByRole("progressbar", { name: "プレイヤーHP" }),
  ).toHaveAttribute("aria-valuenow", "60");
  expect(
    screen.queryByRole("button", { name: "本番の通報操作" }),
  ).not.toBeInTheDocument();
  expect(screen.queryByText("正解の選択肢")).not.toBeInTheDocument();
  expect(screen.queryByText("模擬問題")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "正解" }));
  await user.click(screen.getByRole("button", { name: "回答を確定" }));
  await user.click(
    await screen.findByRole("button", { name: "結果を処理 · 1/1" }),
  );
  await screen.findByText("模擬ターン精算");
  expect(screen.getByLabelText("模擬敵へのダメージ")).toHaveTextContent(
    "HIT · 10ダメージ",
  );
  expect(screen.queryByTitle("単文詳細を開く")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "続ける" }));
  const comparison = screen.getByRole("table", { name: "模擬戦の比較" });
  expect(comparison).toHaveTextContent("勝利");
  expect(turns).toHaveLength(1);
  await user.click(screen.getByRole("button", { name: "同じ条件で再戦" }));
  expect(preparations).toHaveLength(1);
  expect(
    screen.getByRole("progressbar", { name: "プレイヤーHP" }),
  ).toHaveAttribute("aria-valuenow", "60");
});

it("confirms an incorrect synthetic answer and applies incoming damage", async () => {
  render(
    <MemoryRouter>
      <PracticeBattle settings={draft} trials={trials} />
    </MemoryRouter>,
  );
  const user = userEvent.setup();
  const start = screen.getByRole("button", {
    name: "現在の設定で模擬戦を開始",
  });
  await waitFor(() => expect(start).toBeEnabled());
  await user.click(start);
  await user.click(await screen.findByRole("button", { name: "不正解" }));
  await user.click(screen.getByRole("button", { name: "回答を確定" }));
  await user.click(
    await screen.findByRole("button", { name: "結果を処理 · 1/1" }),
  );
  await screen.findByText("模擬ターン精算");
  expect(screen.getByText("模擬敵 · 不正解")).toBeInTheDocument();
  expect(
    screen.getByRole("progressbar", { name: "プレイヤーHP" }),
  ).toHaveAttribute("aria-valuenow", "49");
  expect(turns).toHaveLength(1);
  expect(turns[0]).toMatchObject({ turn: { answers: { enemy: [] } } });
  expect(screen.queryByText("正解の選択肢")).not.toBeInTheDocument();
});

it("settles unanswered timeout through practice only and reports it separately", async () => {
  render(
    <MemoryRouter>
      <PracticeBattle settings={draft} trials={trials} />
    </MemoryRouter>,
  );
  const user = userEvent.setup();
  const start = screen.getByRole("button", {
    name: "現在の設定で模擬戦を開始",
  });
  await waitFor(() => expect(start).toBeEnabled());
  await user.click(start);
  await screen.findByRole("timer");
  const now = Date.now();
  vi.spyOn(Date, "now").mockReturnValue(now + 60000);
  await screen.findByText("模擬ターン精算");
  await user.click(screen.getByRole("button", { name: "続ける" }));
  const row = within(
    screen.getByRole("table", { name: "模擬戦の比較" }),
  ).getAllByRole("row")[1];
  const cells = within(row).getAllByRole("cell");
  expect(cells[8]).toHaveTextContent("1");
  expect(cells[9]).toHaveTextContent("11");
  expect(turns).toHaveLength(1);
});
