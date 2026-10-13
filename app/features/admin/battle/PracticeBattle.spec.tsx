import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import { defaultBalance } from "~/features/game/battle";
import PracticeBattle from "./PracticeBattle";
import type { PracticeInput, PracticeSession } from "./api";

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
const preparations: PracticeInput[] = [];
const turns: unknown[] = [];
const draft = { ...defaultBalance, base_hp: 60, damage_variance_percent: 0 };
const server = setupServer(
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
  http.post("*/admin/settings/game-balance/practice", async ({ request }) => {
    const input = (await request.json()) as PracticeInput;
    preparations.push(input);
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
            hp: 5,
            attack: 12,
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
          allocation: { hp: 0, attack: 0, defense: 0, seconds: 0 },
          content: { knowledge: [], quizzes: [quiz] },
          run: {
            resourceId: "book",
            name: "模擬用の本",
            hp: 60,
            maxHp: 60,
            attack: 10,
            defense: 1,
            moves: 0,
            kills: 0,
            enemyHp: 0,
            enemyMaxHp: 1,
            quizCursor: 0,
            readIds: [],
            phase: "battle",
            answerSeconds: 45,
            answerDeadline: Date.now() + 45000,
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
  }),
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

it("selects a player independently of the dungeon owner", async () => {
  render(
    <MemoryRouter>
      <PracticeBattle settings={draft} />
    </MemoryRouter>,
  );
  const user = userEvent.setup();
  const player = screen.getByRole("combobox", { name: "プレイヤー" });
  await waitFor(() => expect(player).toBeEnabled());
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
  expect(preparations[0].user_id).toBe("user");
  expect(preparations[0].player_user_id).toBe("other");
  expect(preparations[0].allocation).toBeNull();
});

it("explains a missing deployment route without confusing it with missing data", async () => {
  server.use(
    http.post("*/admin/settings/game-balance/practice", () =>
      HttpResponse.json({ detail: "Not Found" }, { status: 404 }),
    ),
  );
  render(
    <MemoryRouter>
      <PracticeBattle settings={draft} />
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

it("uses real battle UI with draft settings, records results and replays without live writes", async () => {
  render(
    <MemoryRouter>
      <PracticeBattle settings={draft} />
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
  await user.click(screen.getByRole("radio", { name: /^正解$/ }));
  await user.click(screen.getByRole("button", { name: "回答を確定" }));
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
      <PracticeBattle settings={draft} />
    </MemoryRouter>,
  );
  const user = userEvent.setup();
  const start = screen.getByRole("button", {
    name: "現在の設定で模擬戦を開始",
  });
  await waitFor(() => expect(start).toBeEnabled());
  await user.click(start);
  await user.click(await screen.findByRole("radio", { name: "不正解" }));
  await user.click(screen.getByRole("button", { name: "回答を確定" }));
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
      <PracticeBattle settings={draft} />
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
