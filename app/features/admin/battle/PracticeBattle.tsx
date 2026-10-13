import { useEffect, useRef, useState } from "react";
import MultiBattle from "~/features/game/MultiBattle";
import type { DungeonContent } from "~/features/game/api";
import {
  type Allocation,
  type BattleTransport,
  type TurnInput,
  emptyAllocation,
  playerStats,
  rollPlayerDamage,
} from "~/features/game/battle";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/shared/components/ui/table";
import type { UserReadPublic } from "~/shared/generated/fastAPI.schemas";
import { type AdminUserItem, listAdminUsers } from "../users/api";
import {
  type BattleSettings,
  type EnemyBalanceSimulation,
  type PracticeSession,
  requestPracticeNext,
  requestPracticeTurn,
  requestSimulatedPractice,
} from "./api";

type RecordResult = {
  id: string;
  name: string;
  playerName?: string;
  level: number;
  seed: number;
  settings: BattleSettings;
  enemyTrial: EnemyBalanceSimulation;
  allocation: Allocation;
  player: ReturnType<typeof playerStats>;
  outcome: string;
  turns: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  damage: number;
  seconds: number;
};
type Session = PracticeSession & {
  id: string;
  name: string;
  level: number;
  playerName?: string;
  player?: UserReadPublic;
  enemyTrial: EnemyBalanceSimulation;
};
type Counts = Omit<
  RecordResult,
  | "id"
  | "name"
  | "playerName"
  | "level"
  | "seed"
  | "settings"
  | "enemyTrial"
  | "outcome"
  | "allocation"
  | "player"
>;
const newCounts = (): Counts => ({
  turns: 0,
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  damage: 0,
  seconds: 0,
});

/** Stable per-turn, per-instance draws let repeated trials compare settings. */
function randomFor(seed: number, key: string) {
  let value = [...`${seed}:${key}`].reduce(
    (hash, c) => Math.imul(hash ^ c.charCodeAt(0), 16777619) >>> 0,
    2166136261,
  );
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export default function PracticeBattle({
  settings,
  simulation,
  simulationName = "選択した試算",
}: {
  settings: BattleSettings;
  simulation: EnemyBalanceSimulation;
  simulationName?: string;
}) {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [playerId, setPlayerId] = useState("");
  const [usersError, setUsersError] = useState<string>();
  const [seed, setSeed] = useState(1);
  const [active, setActive] = useState<Session>();
  const [initial, setInitial] = useState<Session>();
  const [results, setResults] = useState<RecordResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const session = useRef<Session | undefined>(undefined);
  const counts = useRef(newCounts());
  const turnStarted = useRef(Date.now());
  const selectedPlayerId = playerId || users[0]?.uid || "";
  const selectedPlayer = users.find((user) => user.uid === selectedPlayerId);
  const draftPlayer = playerStats(emptyAllocation, settings);
  useEffect(() => {
    let mounted = true;
    void listAdminUsers()
      .then((items) => {
        if (mounted) setUsers(items);
      })
      .catch((cause) => {
        if (mounted) setUsersError(cause.message);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function activate(value: Session) {
    const copy = structuredClone(value);
    copy.id = crypto.randomUUID();
    copy.server_now = Date.now();
    if (copy.state.save.run)
      copy.state.save.run.answerDeadline =
        Date.now() +
        playerStats(copy.state.save.allocation, copy.context.balance)
          .answerSeconds *
          1000;
    session.current = copy;
    counts.current = newCounts();
    turnStarted.current = Date.now();
    setActive(copy);
    setError(undefined);
  }

  async function start() {
    if (!simulation.enemies.length || busy || active) return;
    setBusy(true);
    setError(undefined);
    try {
      const prepared = await requestSimulatedPractice({
        simulation,
        seed,
        balance: { ...settings },
      });
      const value = {
        ...prepared,
        id: crypto.randomUUID(),
        name: `${simulationName} · Power ${simulation.power}`,
        playerName:
          selectedPlayer?.display_name ||
          selectedPlayer?.username ||
          selectedPlayer?.email,
        player: selectedPlayer
          ? {
              uid: selectedPlayer.uid,
              display_name: selectedPlayer.display_name,
              username: selectedPlayer.username,
              avatar_url: selectedPlayer.avatar_url,
              created: selectedPlayer.created,
            }
          : undefined,
        level: simulation.achievement,
        enemyTrial: structuredClone(simulation),
      };
      setInitial(structuredClone(value));
      activate(value);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "模擬戦を準備できませんでした。",
      );
    } finally {
      setBusy(false);
    }
  }

  const transport: BattleTransport = async <T,>(
    path: string,
    body?: unknown,
  ): Promise<T> => {
    const current = session.current;
    if (!current?.state.save.battle) throw new Error("模擬戦がありません。");
    if (path === "battle/next") {
      const state = await requestPracticeNext(current);
      if (state.save.run)
        state.save.run.answerDeadline =
          Date.now() +
          playerStats(state.save.allocation, current.context.balance)
            .answerSeconds *
            1000;
      session.current = { ...current, state };
      turnStarted.current = Date.now();
      return state as T;
    }
    if (path !== "battle/turn" && path !== "battle/abandon")
      throw new Error("本番の戦闘APIは模擬戦から使用できません。");
    const marker = current.state.save.battle;
    const turn =
      path === "battle/turn"
        ? (body as TurnInput)
        : {
            battle_id: marker.id,
            turn: marker.turn,
            answers: {},
            defeated: [],
            retreat: true,
          };
    const resolved = await requestPracticeTurn(current, turn);
    const total = counts.current;
    total.turns++;
    total.correct += Object.values(resolved.results).filter(Boolean).length;
    total.incorrect += Object.values(resolved.results).filter(
      (correct) => !correct,
    ).length;
    total.unanswered +=
      marker.enemies.length - Object.keys(turn.answers).length;
    total.damage += resolved.damage;
    total.seconds += Math.min(
      playerStats(current.state.save.allocation, current.context.balance)
        .answerSeconds,
      (Date.now() - turnStarted.current) / 1000,
    );
    session.current = { ...current, state: resolved.state };
    if (!resolved.state.save.battle) {
      setResults((previous) => [
        ...previous,
        {
          ...total,
          id: current.id,
          name: current.name,
          playerName: current.playerName,
          level: current.level,
          seed: current.seed,
          settings: { ...current.context.balance },
          enemyTrial: current.enemyTrial,
          allocation: { ...(current.state.save.allocation ?? emptyAllocation) },
          player: playerStats(
            current.state.save.allocation,
            current.context.balance,
          ),
          outcome:
            resolved.state.save.run?.hp === 0
              ? "敗北"
              : turn.retreat
                ? "撤退"
                : "勝利",
        },
      ]);
    }
    return (path === "battle/abandon" ? resolved.state : resolved) as T;
  };

  return (
    <section
      aria-label="実戦形式の模擬戦"
      className="space-y-3 rounded-lg border p-4"
    >
      <h3 className="font-semibold">実戦形式の模擬戦</h3>
      <div className="space-y-1 text-sm tabular-nums">
        <p>
          {simulationName}の敵 · Power {simulation.power} · 領域{" "}
          {simulation.achievement}
        </p>
        <p>
          プレイヤー初期値: HP {draftPlayer.maxHp} · 攻 {draftPlayer.attack} ·
          守 {draftPlayer.defense} · {draftPlayer.answerSeconds}秒
        </p>
      </div>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void start();
        }}
      >
        <div className="space-y-1">
          <Label htmlFor="practice-player">プレイヤー</Label>
          <select
            id="practice-player"
            className="h-9 w-full min-w-0 rounded-md border bg-background px-2 text-sm"
            value={selectedPlayerId}
            disabled={busy || !!active || !users.length}
            onChange={(event) => setPlayerId(event.target.value)}
          >
            {!users.length && (
              <option value={selectedPlayerId}>模擬プレイヤー</option>
            )}
            {users.map((user) => (
              <option key={user.uid} value={user.uid}>
                {user.display_name || user.username || user.email}
                {user.display_name || user.username ? ` · ${user.email}` : ""}
              </option>
            ))}
          </select>
          {usersError && (
            <p role="alert" className="text-sm text-destructive">
              {usersError}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="practice-seed">乱数シード</Label>
          <Input
            id="practice-seed"
            type="number"
            min={0}
            max={2147483647}
            step={1}
            required
            value={seed}
            disabled={!!active || busy}
            onChange={(event) => setSeed(Number(event.target.value))}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={busy || !!active || !simulation.enemies.length}
            type="submit"
          >
            現在の設定で模擬戦を開始
          </Button>
          {initial && (
            <Button
              type="button"
              variant="outline"
              disabled={busy || !!active}
              onClick={() => activate(initial)}
            >
              同じ条件で再戦
            </Button>
          )}
          {active && (
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => {
                setActive(undefined);
                session.current = undefined;
              }}
            >
              模擬戦を中止
            </Button>
          )}
        </div>
      </form>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      {active && (
        <MultiBattle
          key={active.id}
          simulation
          save={active.state.save}
          content={active.state.save.content as DungeonContent}
          context={active.context}
          player={active.player}
          playerName={active.playerName ?? "模擬プレイヤー"}
          transport={transport}
          rollDamage={(attack, balance, key) =>
            rollPlayerDamage(attack, balance, randomFor(active.seed, key))
          }
          onSaved={(state) => {
            if (session.current) {
              session.current = { ...session.current, state };
              setActive(session.current);
            }
          }}
          onBusy={setBusy}
          onFinished={async () => {
            setActive(undefined);
            session.current = undefined;
          }}
        />
      )}
      {!!results.length && (
        <div className="overflow-x-auto rounded-md border">
          <Table aria-label="模擬戦の比較">
            <TableHeader>
              <TableRow>
                {[
                  "試行",
                  "敵の試算／領域",
                  "シード",
                  "プレイヤー",
                  "勝敗",
                  "ターン",
                  "正解",
                  "誤答",
                  "未回答",
                  "被ダメージ",
                  "回答時間",
                  "設定",
                ].map((label) => (
                  <TableHead key={label}>{label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((r, i) => (
                <TableRow key={r.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    {r.name}／{r.level}
                  </TableCell>
                  <TableCell>{r.seed}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {r.playerName && <p>{r.playerName}</p>}
                    HP {r.player.maxHp}／攻 {r.player.attack}／守{" "}
                    {r.player.defense}／{r.player.answerSeconds}秒
                  </TableCell>
                  <TableCell>{r.outcome}</TableCell>
                  <TableCell>{r.turns}</TableCell>
                  <TableCell>{r.correct}</TableCell>
                  <TableCell>{r.incorrect}</TableCell>
                  <TableCell>{r.unanswered}</TableCell>
                  <TableCell>{r.damage}</TableCell>
                  <TableCell>{r.seconds.toFixed(1)}秒</TableCell>
                  <TableCell>
                    <details>
                      <summary>使用した設定</summary>
                      <pre className="text-xs">
                        {JSON.stringify(
                          {
                            balance: r.settings,
                            enemyTrial: r.enemyTrial,
                            allocation: r.allocation,
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </details>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
