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
import { type AdminGameDungeon, listAdminGameDungeons } from "../game/api";
import {
  type BattleSettings,
  type PracticeSession,
  requestPractice,
  requestPracticeNext,
  requestPracticeTurn,
} from "./api";

type RecordResult = {
  id: string;
  name: string;
  level: number;
  seed: number;
  settings: BattleSettings;
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
type Session = PracticeSession & { id: string; name: string; level: number };
type Counts = Omit<
  RecordResult,
  | "id"
  | "name"
  | "level"
  | "seed"
  | "settings"
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
}: { settings: BattleSettings }) {
  const [dungeons, setDungeons] = useState<AdminGameDungeon[]>([]);
  const [target, setTarget] = useState("");
  const [level, setLevel] = useState(1);
  const [seed, setSeed] = useState(1);
  const [useUserAllocation, setUseUserAllocation] = useState(true);
  const [allocation, setAllocation] = useState<Allocation>({
    ...emptyAllocation,
  });
  const [active, setActive] = useState<Session>();
  const [initial, setInitial] = useState<Session>();
  const [results, setResults] = useState<RecordResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const session = useRef<Session | undefined>(undefined);
  const counts = useRef(newCounts());
  const turnStarted = useRef(Date.now());
  const selected = dungeons.find(
    (dungeon) => `${dungeon.user_id}:${dungeon.resource_id}` === target,
  );
  useEffect(() => {
    let mounted = true;
    void listAdminGameDungeons()
      .then((items) => {
        if (!mounted) return;
        const available = items.filter(
          (item) => item.regions.length && item.status !== "母集団あり",
        );
        setDungeons(available);
        if (available[0]) {
          setTarget(`${available[0].user_id}:${available[0].resource_id}`);
          setLevel(available[0].regions[0].level);
        }
      })
      .catch((cause) => {
        if (mounted) setError(cause.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
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
    if (!selected || busy || active) return;
    setBusy(true);
    setError(undefined);
    try {
      const prepared = await requestPractice({
        user_id: selected.user_id,
        resource_id: selected.resource_id,
        level,
        seed,
        balance: { ...settings },
        allocation: useUserAllocation ? null : { ...allocation },
      });
      const value = {
        ...prepared,
        id: crypto.randomUUID(),
        name: selected.resource_name,
        level,
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
          level: current.level,
          seed: current.seed,
          settings: { ...current.context.balance },
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
      <p className="text-sm text-muted-foreground">
        準備済み領域の母集団を使い、編集中の設定で模擬敵を生成します。実際の戦闘画面・計算を使用しますが、冒険状態・回答履歴・XP・設定は保存しません。閉じても時間は進みます。
      </p>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void start();
        }}
      >
        <Label htmlFor="practice-dungeon">模擬戦のダンジョン</Label>
        <select
          id="practice-dungeon"
          className="h-9 w-full min-w-0 rounded-md border bg-background px-2 text-sm"
          value={target}
          disabled={loading || busy || !!active}
          onChange={(event) => {
            setTarget(event.target.value);
            const item = dungeons.find(
              (d) => `${d.user_id}:${d.resource_id}` === event.target.value,
            );
            setLevel(item?.regions[0]?.level ?? 1);
          }}
        >
          {!dungeons.length && (
            <option value="">
              {loading
                ? "読み込み中…"
                : "保存済みの準備済みダンジョンがありません"}
            </option>
          )}
          {dungeons.map((d) => (
            <option
              key={`${d.user_id}:${d.resource_id}`}
              value={`${d.user_id}:${d.resource_id}`}
            >
              {d.resource_name} · {d.user_email}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="practice-level">領域</Label>
            <select
              id="practice-level"
              className="h-9 w-full rounded-md border bg-background px-2"
              value={level}
              disabled={!!active || busy}
              onChange={(event) => setLevel(Number(event.target.value))}
            >
              {selected?.regions.map((r) => (
                <option key={r.level} value={r.level}>
                  領域 {r.level}
                </option>
              ))}
            </select>
          </div>
          <div>
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
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useUserAllocation}
            disabled={!!active || busy}
            onChange={(event) => setUseUserAllocation(event.target.checked)}
          />
          対象ユーザーの育成ポイント割り振りを使用
        </label>
        {!useUserAllocation && (
          <fieldset className="grid grid-cols-2 gap-3">
            <legend className="text-sm">
              模擬プレイヤーの割り振り（ポイント制限なし）
            </legend>
            {(["hp", "attack", "defense", "seconds"] as const).map((stat) => (
              <div key={stat}>
                <Label htmlFor={`practice-${stat}`}>
                  {
                    {
                      hp: "HP",
                      attack: "攻",
                      defense: "守",
                      seconds: "持ち時間",
                    }[stat]
                  }
                </Label>
                <Input
                  id={`practice-${stat}`}
                  type="number"
                  min={0}
                  max={10000}
                  step={1}
                  required
                  value={allocation[stat]}
                  disabled={!!active || busy}
                  onChange={(event) =>
                    setAllocation({
                      ...allocation,
                      [stat]: Number(event.target.value),
                    })
                  }
                />
              </div>
            ))}
          </fieldset>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={loading || busy || !!active || !selected}
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
          playerName="模擬プレイヤー"
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
                  "ダンジョン／領域",
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
                          { balance: r.settings, allocation: r.allocation },
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
