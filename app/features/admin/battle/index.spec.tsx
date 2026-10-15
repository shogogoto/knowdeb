import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { vi } from "vitest";
import { defaultBalance as defaults } from "~/features/game/battle";
import BattleSettingsManager from ".";
const saved = vi.fn();
const simulated = vi.fn();
const practiceStarted = vi.fn();
const server = setupServer(
  http.get("*/admin/users", () => HttpResponse.json([])),
  http.get("*/admin/game/dungeons", () => HttpResponse.json([])),
  http.get("*/admin/settings/game-balance", () => HttpResponse.json(defaults)),
  http.post(
    "*/admin/settings/game-balance/practice/simulation",
    async ({ request }) => {
      practiceStarted(await request.json());
      return HttpResponse.json(
        { detail: "試算リクエストを確認" },
        { status: 409 },
      );
    },
  ),
  http.put("*/admin/settings/game-balance", async ({ request }) => {
    const body = await request.json();
    saved(body);
    return HttpResponse.json(body);
  }),
  http.post("*/admin/settings/game-balance/simulate", async ({ request }) => {
    const input = (await request.json()) as {
      balance: typeof defaults;
      power: number;
      achievement: number;
      average_relations: number;
    };
    simulated(input);
    return HttpResponse.json({
      power: input.power,
      achievement: input.achievement,
      pool_quiz_count: 5,
      average_relations: input.average_relations,
      balance: input.balance,
      min_encounter_enemies: 1,
      max_encounter_enemies: 3,
      requested_enemy_types: 3,
      requested_quiz_count: 1,
      assigned_quiz_count: 3,
      unassigned_quiz_count: 2,
      warnings: [],
      enemies: [
        { index: 1, quiz_count: 2, hp: 28, attack: 16, relations: 3 },
        { index: 2, quiz_count: 2, hp: 30, attack: 17, relations: 3 },
        { index: 3, quiz_count: 1, hp: 26, attack: 15, relations: 3 },
      ],
    });
  }),
);

it("edits the shared contents of unopened region chests", async () => {
  const user = userEvent.setup();
  render(<BattleSettingsManager />);
  const gold = await screen.findByLabelText("ゴールド / 宝箱");
  await user.clear(gold);
  await user.type(gold, "80");
  const potion = screen.getByLabelText("歩数回復薬 / 宝箱");
  await user.clear(potion);
  await user.type(potion, "2");
  await user.click(screen.getByRole("button", { name: "保存" }));
  await waitFor(() =>
    expect(saved).toHaveBeenCalledWith(
      expect.objectContaining({ chest_gold: 80, chest_step_potions: 2 }),
    ),
  );
});
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());
it("saves tempo seconds and rejects an inverted speed order", async () => {
  render(<BattleSettingsManager />);
  const user = userEvent.setup();
  const slow = await screen.findByLabelText("遅（秒）");
  const medium = screen.getByLabelText("中（秒）");
  const fast = screen.getByLabelText("速（秒）");
  expect(slow).toHaveValue(3);
  expect(medium).toHaveValue(1);
  expect(fast).toHaveValue(0.5);
  await user.clear(fast);
  await user.type(fast, "2");
  await user.click(screen.getAllByRole("button", { name: "保存" })[0]);
  expect(saved).not.toHaveBeenCalled();
  expect(
    await screen.findByText("戦闘テンポは遅・中・速の順に短くしてください。"),
  ).toBeVisible();
  await user.clear(fast);
  await user.type(fast, "0.7");
  await user.click(screen.getAllByRole("button", { name: "保存" })[0]);
  await waitFor(() => expect(saved).toHaveBeenCalled());
  expect(saved.mock.calls[0][0]).toMatchObject({
    battle_tempo_slow_seconds: 3,
    battle_tempo_medium_seconds: 1,
    battle_tempo_fast_seconds: 0.7,
  });
});
it("saves player time and live enemy corrections without quiz-type weights", async () => {
  render(<BattleSettingsManager />);
  const user = userEvent.setup();
  const base = await screen.findByLabelText("初期持ち時間（秒）");
  expect(base).toHaveValue(45);
  expect(
    screen.getByRole("region", { name: "敵ステータスの計算" }),
  ).toBeInTheDocument();
  expect(screen.queryByLabelText("関係数のHP補正")).not.toBeInTheDocument();
  expect(screen.getByLabelText("達成度あたりの固定クイズ数")).toHaveValue(1);
  expect(screen.getByLabelText("敵能力のばらつき（±%）")).toHaveValue(10);
  expect(base).toHaveAttribute("min", "5");
  expect(base).toHaveAttribute("max", "300");
  const weight = screen.getByLabelText("PowerのHP補正");
  await user.clear(weight);
  await user.type(weight, "2");
  const hpGrowth = screen.getByLabelText("達成度帯ごとのHP成長率（%）");
  expect(hpGrowth).toHaveValue(20);
  await user.clear(hpGrowth);
  await user.type(hpGrowth, "30");
  const effectLabel = screen.getByLabelText("演出4の文言");
  await user.clear(effectLabel);
  await user.type(effectLabel, "大当たり");
  const enemyTypes = screen.getByLabelText("領域ごとの敵の種類数");
  await user.clear(enemyTypes);
  await user.type(enemyTypes, "4");
  expect(
    screen.queryByLabelText("単文組 → 関係の重み"),
  ).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "保存" }));
  expect(
    await screen.findByText("ゲーム設定を保存しました"),
  ).toBeInTheDocument();
  expect(saved).toHaveBeenCalledWith({
    ...defaults,
    power_hp: 2,
    region_hp_growth_percent: 30,
    damage_effect_label_4: "大当たり",
    enemy_types: 4,
  });
});

it("saves MP base, allocation and specialty cost alongside the draft battle settings", async () => {
  render(<BattleSettingsManager />);
  const user = userEvent.setup();
  const base = await screen.findByLabelText("初期MP");
  await user.clear(base);
  await user.type(base, "15");
  const perPoint = screen.getByLabelText("MP / 育成ポイント");
  await user.clear(perPoint);
  await user.type(perPoint, "4");
  const cost = screen.getByLabelText("専門分野の消費MP");
  await user.clear(cost);
  await user.type(cost, "5");
  await user.click(screen.getAllByRole("button", { name: "保存" })[0]);
  await waitFor(() => expect(saved).toHaveBeenCalled());
  expect(saved.mock.calls[0][0]).toMatchObject({
    base_mp: 15,
    mp_per_point: 4,
    skill_mp_cost: 5,
  });
});
it("retains trials for comparison and lets users revisit their original settings", async () => {
  render(<BattleSettingsManager />);
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "敵能力を試算して比較に追加" }),
    ).toBeEnabled(),
  );
  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", { name: "敵能力を試算して比較に追加" }),
  );
  const comparison = await screen.findByRole("table", {
    name: "stats試算比較",
  });
  expect(within(comparison).getAllByRole("row")).toHaveLength(2);
  expect(
    screen.getByRole("table", { name: "stats試算の敵一覧" }),
  ).toHaveTextContent("28");
  const power = screen.getByLabelText("敵能力の試算に使うPower");
  await user.clear(power);
  await user.type(power, "250");
  const weight = screen.getByLabelText("PowerのHP補正");
  await user.clear(weight);
  await user.type(weight, "2");
  expect(within(comparison).getAllByRole("row")).toHaveLength(2);
  await user.click(
    screen.getByRole("button", { name: "敵能力を試算して比較に追加" }),
  );
  await waitFor(() =>
    expect(within(comparison).getAllByRole("row")).toHaveLength(3),
  );
  expect(comparison).toHaveTextContent("100");
  expect(comparison).toHaveTextContent("250");
  expect(
    screen.getByRole("heading", { name: "試算 2 の敵一覧" }),
  ).toBeInTheDocument();
  await user.click(screen.getByText("この試算に使ったゲームバランス設定"));
  const snapshot = screen
    .getByText("この試算に使ったゲームバランス設定")
    .closest("details");
  if (!snapshot) throw new Error("試算の設定が見つかりません。");
  expect(
    within(snapshot).getByText("PowerのHP補正").nextElementSibling,
  ).toHaveTextContent("2");
  await user.click(within(comparison).getByText("100"));
  expect(screen.getByRole("button", { name: "試算 1" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(
    within(snapshot).getByText("PowerのHP補正").nextElementSibling,
  ).toHaveTextContent("1");
  expect(
    screen.getByRole("heading", { name: "試算 1 の敵一覧" }),
  ).toBeInTheDocument();
  expect(simulated).toHaveBeenNthCalledWith(1, {
    balance: defaults,
    power: 100,
    achievement: 1,
    average_relations: 0,
  });
  expect(simulated).toHaveBeenNthCalledWith(2, {
    balance: { ...defaults, power_hp: 2 },
    power: 250,
    achievement: 1,
    average_relations: 0,
  });
  expect(saved).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "結果をクリア" }));
  expect(
    screen.queryByRole("table", { name: "stats試算比較" }),
  ).not.toBeInTheDocument();
});
it("reports failures without claiming settings were saved", async () => {
  server.use(
    http.put(
      "*/admin/settings/game-balance",
      () => new HttpResponse(null, { status: 403 }),
    ),
  );
  render(<BattleSettingsManager />);
  await screen.findByLabelText("初期持ち時間（秒）");
  await userEvent.setup().click(screen.getByRole("button", { name: "保存" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "ゲーム設定を操作できませんでした。",
  );
  expect(
    screen.queryByText("ゲーム設定を保存しました"),
  ).not.toBeInTheDocument();
});

it("practices with the selected historical enemy trial and current unsaved initial values", async () => {
  render(<BattleSettingsManager />);
  await screen.findByLabelText("初期HP");
  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", { name: "敵能力を試算して比較に追加" }),
  );
  await screen.findByRole("table", { name: "stats試算比較" });
  const power = screen.getByLabelText("敵能力の試算に使うPower");
  await user.clear(power);
  await user.type(power, "250");
  await user.click(
    screen.getByRole("button", { name: "敵能力を試算して比較に追加" }),
  );
  await screen.findByRole("heading", { name: "試算 2 の敵一覧" });
  await user.click(screen.getByRole("button", { name: "試算 1" }));
  const initialHp = screen.getByLabelText("初期HP");
  await user.clear(initialHp);
  await user.type(initialHp, "70");
  const enemyHp = screen.getByLabelText("敵の基礎HP");
  await user.clear(enemyHp);
  await user.type(enemyHp, "99");
  await user.click(
    screen.getByRole("button", { name: "現在の設定で模擬戦を開始" }),
  );
  await screen.findByText("試算リクエストを確認");
  expect(practiceStarted).toHaveBeenCalledWith(
    expect.objectContaining({
      balance: { ...defaults, base_hp: 70, enemy_hp: 99 },
      simulation: expect.objectContaining({
        power: 100,
        balance: defaults,
        enemies: expect.arrayContaining([
          expect.objectContaining({ hp: 28, attack: 16 }),
        ]),
      }),
    }),
  );
  expect(saved).not.toHaveBeenCalled();
});

it("places independent simulations next to their settings without saving", async () => {
  render(<BattleSettingsManager />);
  await screen.findByLabelText("初期HP");
  const stats = screen.getByRole("region", { name: "敵ステータスの計算" });
  expect(
    screen.getByRole("heading", { name: "実戦形式の模擬戦" }),
  ).toBeVisible();
  const roster = screen.getByRole("region", { name: "敵ロスターと遭遇の抽選" });
  expect(
    within(stats).getByRole("region", { name: "敵能力の試算" }),
  ).toBeInTheDocument();
  expect(
    within(roster).getByRole("region", { name: "ロスター・同時出現数の試算" }),
  ).toBeInTheDocument();
  const user = userEvent.setup();
  await user.click(
    within(roster).getByRole("button", {
      name: "ロスターを試算して比較に追加",
    }),
  );
  const comparison = await within(roster).findByRole("table", {
    name: "roster試算比較",
  });
  expect(comparison).toHaveTextContent("未割り当て");
  expect(screen.getByLabelText("敵の出典")).toHaveValue("trial");
  expect(screen.getByLabelText("敵の試算")).toHaveTextContent(
    "ロスター 試算 1",
  );
  expect(
    screen.getByRole("button", { name: "現在の設定で模擬戦を開始" }),
  ).toBeEnabled();
  expect(within(stats).queryByRole("table")).not.toBeInTheDocument();
  expect(document.querySelector("form form")).toBeNull();
  expect(saved).not.toHaveBeenCalled();
});
