import { useEffect, useRef, useState } from "react";
import QuizAttempt from "~/features/quiz/QuizAttempt";
import QuizPreviewPrompt from "~/features/quiz/QuizPreviewPrompt";
import { Button } from "~/shared/components/ui/button";
import type { UserReadPublic } from "~/shared/generated/fastAPI.schemas";
import BattleDialog from "./BattleDialog";
import EnemyAvatar from "./EnemyAvatar";
import type { DungeonContent } from "./api";
import {
  type BattleTransport,
  type CombatContext,
  type GameBalance,
  type TurnInput,
  type TurnResult,
  damageEffect,
  gameRequest,
  playerStats,
  remainingHp,
  rollPlayerDamage,
} from "./battle";
import type { GameSave } from "./domain";
import type { GameState } from "./state";

export default function MultiBattle({
  save,
  content,
  context,
  player,
  playerName,
  onSaved,
  onFinished,
  onBusy,
  clockOffset = 0,
  transport = gameRequest,
  simulation = false,
  rollDamage = (attack, balance) => rollPlayerDamage(attack, balance),
}: {
  save: GameSave;
  content: DungeonContent;
  context: CombatContext;
  player?: UserReadPublic;
  playerName?: string;
  onSaved: (state: GameState) => void;
  onFinished: () => Promise<void>;
  onBusy: (busy: boolean) => void;
  clockOffset?: number;
  transport?: BattleTransport;
  simulation?: boolean;
  rollDamage?: (attack: number, balance: GameBalance, key: string) => number;
}) {
  const marker = useRef(save.battle);
  if (save.battle) marker.current = save.battle;
  const battle = marker.current;
  const run = save.run;
  const [hp, setHp] = useState<Record<string, number>>(() =>
    Object.fromEntries(context.enemies.map((enemy) => [enemy.id, enemy.hp])),
  );
  useEffect(() => {
    setHp((current) => ({
      ...current,
      ...remainingHp(current, context.enemies),
    }));
  }, [context]);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [simulationChoices, setSimulationChoices] = useState<
    Record<string, "correct" | "incorrect">
  >({});
  const activeAnswerArea = useRef<HTMLDivElement>(null);
  const [frozenRemainingMs, setFrozenRemainingMs] = useState<number>();
  const [active, setActive] = useState(0);
  const [now, setNow] = useState(Date.now);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<TurnResult>();
  const [retry, setRetry] = useState<TurnInput>();
  const [hitEffects, setHitEffects] = useState<
    Record<string, { damage: number; level: number; label: string }>
  >({});
  const sending = useRef(false);
  const retryDamage = useRef<
    { key: string; values: Record<string, number> } | undefined
  >(undefined);
  const resultEnemies = useRef(battle?.enemies ?? []);
  const resultQuizIndices = useRef(battle?.quizIndices);
  if (!result) {
    resultEnemies.current = battle?.enemies ?? [];
    resultQuizIndices.current = battle?.quizIndices;
  }
  // The turn response already contains its sealed assignments. A background
  // context refresh must never display the previous turn's question meanwhile.
  const quizIndices = result ? resultQuizIndices.current : battle?.quizIndices;
  const live = context.enemies
    .filter((enemy) =>
      (result ? resultEnemies.current : battle?.enemies)?.includes(enemy.id),
    )
    .map((enemy) => ({
      ...enemy,
      quizIndex: quizIndices?.[enemy.id] ?? enemy.quizIndex,
    }));
  const currentHp = remainingHp(hp, live);
  const stats = playerStats(save.allocation, context.balance);
  function focusAnswerChoice(direction: "first" | "last" = "first") {
    const selector = simulation
      ? 'input[type="radio"]'
      : "button[data-quiz-option-index]:not(:disabled)";
    const choices =
      activeAnswerArea.current?.querySelectorAll<HTMLElement>(selector);
    const choice =
      direction === "first" ? choices?.[0] : choices?.[choices.length - 1];
    choice?.focus();
  }
  const remainingMs =
    frozenRemainingMs ??
    (run?.answerDeadline
      ? Math.max(0, run.answerDeadline - now - clockOffset)
      : undefined);
  const remaining = Math.ceil((remainingMs ?? 0) / 1000);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(timer);
  }, []);
  async function submitTurn(retreat = false, input?: TurnInput) {
    if (!battle || !run || sending.current || result) return;
    sending.current = true;
    setBusy(true);
    onBusy(true);
    setError(undefined);
    const damageKey = `${battle.id}:${battle.turn}`;
    const damageByEnemy =
      retryDamage.current?.key === damageKey
        ? retryDamage.current.values
        : Object.fromEntries(
            live.map((enemy) => [
              enemy.id,
              rollDamage(
                stats.attack,
                context.balance,
                `${battle.turn}:${enemy.id}`,
              ),
            ]),
          );
    retryDamage.current = { key: damageKey, values: damageByEnemy };
    const request = input ?? {
      battle_id: battle.id,
      turn: battle.turn,
      answers,
      defeated: live
        .filter((enemy) => {
          const quiz = content.quizzes[enemy.quizIndex];
          const selected = answers[enemy.id];
          const correct =
            selected &&
            (quiz.no_correct_option
              ? selected.length === 0
              : quiz.correct.length === selected.length &&
                quiz.correct.every((id) => selected.includes(id)));
          return correct && currentHp[enemy.id] <= damageByEnemy[enemy.id];
        })
        .map((enemy) => enemy.id),
      retreat,
    };
    try {
      const resolved = await transport<TurnResult>("battle/turn", request);
      setHp(
        Object.fromEntries(
          live.map((enemy) => [
            enemy.id,
            Math.max(
              0,
              currentHp[enemy.id] -
                (resolved.results[enemy.id] ? damageByEnemy[enemy.id] : 0),
            ),
          ]),
        ),
      );
      setResult(resolved);
      setHitEffects(
        Object.fromEntries(
          live
            .filter((enemy) => resolved.results[enemy.id])
            .map((enemy) => [
              enemy.id,
              {
                damage: damageByEnemy[enemy.id],
                ...damageEffect(
                  damageByEnemy[enemy.id],
                  stats.attack,
                  context.balance,
                ),
              },
            ]),
        ),
      );
      setRetry(undefined);
      retryDamage.current = undefined;
      onSaved(resolved.state);
    } catch (cause) {
      setRetry(request);
      setError(
        cause instanceof Error ? cause.message : "精算できませんでした。",
      );
    } finally {
      sending.current = false;
      setBusy(false);
      onBusy(false);
    }
  }
  const allConfirmed =
    live.length > 0 && live.every((enemy) => enemy.id in answers);
  // No per-answer requests. Retries use the exact sealed turn payload.
  useEffect(() => {
    if (
      battle &&
      run?.answerDeadline &&
      !result &&
      !retry &&
      (remaining === 0 || allConfirmed)
    )
      void submitTurn();
  });
  if (!battle || !run) return null;
  const displayed = live[active] ?? live[0];
  const enemyPanel = (
    <div
      className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 space-y-2"
      aria-label="敵一覧"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {live.map((enemy, index) => (
          <button
            key={enemy.id}
            type="button"
            aria-label={enemy.name}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
                event.preventDefault();
                event.stopPropagation();
                const next =
                  (index +
                    (event.key === "ArrowRight" ? 1 : -1) +
                    live.length) %
                  live.length;
                setActive(next);
                event.currentTarget.parentElement
                  ?.querySelectorAll<HTMLButtonElement>("button")
                  [next]?.focus();
              } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                event.stopPropagation();
                focusAnswerChoice(event.key === "ArrowDown" ? "first" : "last");
              }
            }}
            className={`flex min-w-0 items-center gap-3 rounded-md border p-2 text-left ${active === index ? "border-primary bg-background" : "border-transparent hover:bg-background/60"}`}
          >
            <EnemyAvatar identity={enemy.id} large />
            <span className="min-w-0 flex-1 space-y-1">
              <span className="block truncate text-sm font-medium">
                {enemy.name}
              </span>
              <span className="block text-xs tabular-nums text-muted-foreground">
                {enemy.id in answers ? "回答確定" : `敵 ${index + 1}`} · HP{" "}
                {currentHp[enemy.id]}/{enemy.hp}
              </span>
              <span
                role="progressbar"
                tabIndex={-1}
                aria-label={`${enemy.name}のHP`}
                aria-valuenow={currentHp[enemy.id]}
                aria-valuemin={0}
                aria-valuemax={enemy.hp}
                className="block h-1.5 overflow-hidden rounded-full bg-rose-500/15"
              >
                <span
                  className="block h-full bg-rose-500"
                  style={{
                    width: `${Math.min(100, (currentHp[enemy.id] / enemy.hp) * 100)}%`,
                  }}
                />
              </span>
            </span>
          </button>
        ))}
      </div>
      {displayed && (
        <p className="text-xs text-muted-foreground">
          ←→ 敵を切替 · ↓ 回答欄へ · 選択中: {displayed.name}（攻{" "}
          {displayed.attack}）
        </p>
      )}
    </div>
  );
  return (
    <BattleDialog
      run={{ ...run, ...stats, hp: Math.min(run.hp, stats.maxHp) }}
      player={player}
      playerName={playerName}
      busy={busy}
      enemyPanel={enemyPanel}
      footer={
        !result && (
          <Button
            variant="outline"
            disabled={busy || !!retry}
            onClick={() => void submitTurn(true)}
          >
            撤退する
          </Button>
        )
      }
      simulation={simulation}
      remainingTimeMs={!result ? remainingMs : undefined}
      totalTimeSeconds={run?.answerSeconds ?? undefined}
    >
      {error && (
        <div role="alert" className="space-y-2 text-destructive">
          <p>{error}</p>
          {retry && (
            <>
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => void submitTurn(false, retry)}
              >
                精算を再試行
              </Button>
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setBusy(true);
                  onBusy(true);
                  void transport<GameState>("battle/abandon", {}, "POST")
                    .then((state) => {
                      setResult({ state, results: {}, damage: 0 });
                      setRetry(undefined);
                      setError(undefined);
                      onSaved(state);
                    })
                    .catch((cause) => setError(cause.message))
                    .finally(() => {
                      setBusy(false);
                      onBusy(false);
                    });
                }}
              >
                撤退して最新状態を取得
              </Button>
            </>
          )}
        </div>
      )}
      {result ? (
        <div className="space-y-3" data-battle-result>
          <output>{save.battleFeedback}</output>
          {Object.keys(result.results).map((id) => {
            const enemy = live.find((item) => item.id === id);
            return (
              enemy && (
                <section key={id} className="rounded-md border p-2 space-y-2">
                  <p>
                    {enemy.name} · {result.results[id] ? "正解" : "不正解"}
                  </p>
                  {hitEffects[id] && (
                    <p
                      aria-label={`${enemy.name}へのダメージ`}
                      className={`motion-safe:animate-in motion-safe:zoom-in-95 duration-300 ${
                        [
                          "text-sm text-muted-foreground",
                          "font-medium",
                          "text-lg font-bold text-emerald-500",
                          "text-xl font-black text-amber-500",
                        ][hitEffects[id].level]
                      }`}
                    >
                      {hitEffects[id].label} · {hitEffects[id].damage}ダメージ
                    </p>
                  )}
                  {!simulation && (
                    <QuizPreviewPrompt
                      quiz={content.quizzes[enemy.quizIndex]}
                      showCorrectAnswer
                    />
                  )}
                </section>
              )
            );
          })}
          <Button
            disabled={busy}
            data-battle-advance
            onClick={() => {
              if (!save.battle) {
                void onFinished();
                return;
              }
              setBusy(true);
              onBusy(true);
              void transport<GameState>("battle/next", {
                battle_id: save.battle.id,
                turn: save.battle.turn,
              })
                .then((state) => {
                  setAnswers({});
                  setSimulationChoices({});
                  setFrozenRemainingMs(undefined);
                  setActive(0);
                  setResult(undefined);
                  setHitEffects({});
                  onSaved(state);
                })
                .catch((cause) => setError(cause.message))
                .finally(() => {
                  setBusy(false);
                  onBusy(false);
                });
            }}
          >
            {save.battle ? "次のターン" : "続ける"}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-end gap-2 text-sm">
            <span>
              回答確定 {Object.keys(answers).length}/{live.length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            敵を切り替えて回答。一度確定した答えは変更できません。全問回答か時間切れで一括精算します。
          </p>
          {live.map((enemy, index) => {
            const quiz = content.quizzes[enemy.quizIndex];
            const confirm = (selected: string[]) => {
              if (
                busy ||
                retry ||
                enemy.id in answers ||
                Date.now() + clockOffset >= (run.answerDeadline ?? 0)
              )
                return;
              setAnswers((current) => ({ ...current, [enemy.id]: selected }));
              const completesTurn = live.every(
                (candidate) =>
                  candidate.id === enemy.id || candidate.id in answers,
              );
              if (completesTurn && run.answerDeadline) {
                setFrozenRemainingMs(
                  Math.max(0, run.answerDeadline - Date.now() - clockOffset),
                );
              }
              const next = live.findIndex(
                (candidate) =>
                  candidate.id !== enemy.id && !(candidate.id in answers),
              );
              if (next >= 0) {
                setActive(next);
                requestAnimationFrame(() => focusAnswerChoice());
              }
            };
            const correct = quiz.no_correct_option ? [] : quiz.correct;
            const incorrect = correct.length
              ? []
              : [Object.keys(quiz.options)[0]];
            return (
              <div
                key={`${enemy.id}:${battle.turn}:${enemy.quizIndex}`}
                hidden={index !== active}
                ref={index === active ? activeAnswerArea : undefined}
                data-active-answer={index === active ? "" : undefined}
              >
                {simulation ? (
                  <div className="space-y-3 rounded-md border p-3">
                    <p className="text-sm">
                      模擬回答：正解か不正解を選択してください。
                    </p>
                    <form
                      className="space-y-3"
                      onSubmit={(event) => {
                        event.preventDefault();
                        const choice = simulationChoices[enemy.id];
                        if (choice)
                          confirm(choice === "correct" ? correct : incorrect);
                      }}
                    >
                      <fieldset
                        disabled={
                          busy ||
                          !!retry ||
                          remaining === 0 ||
                          enemy.id in answers
                        }
                        className="grid grid-cols-2 gap-2"
                      >
                        <legend className="sr-only">模擬回答</legend>
                        {(["correct", "incorrect"] as const).map((choice) => {
                          const selected =
                            simulationChoices[enemy.id] === choice;
                          return (
                            <label
                              key={choice}
                              className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${selected ? "border-primary bg-primary/10" : "hover:bg-muted"}`}
                            >
                              <input
                                type="radio"
                                name={`simulation-answer-${battle.turn}-${enemy.id}`}
                                value={choice}
                                checked={selected}
                                onChange={() =>
                                  setSimulationChoices((current) => ({
                                    ...current,
                                    [enemy.id]: choice,
                                  }))
                                }
                                className="size-4 accent-primary"
                              />
                              {choice === "correct" ? "正解" : "不正解"}
                            </label>
                          );
                        })}
                      </fieldset>
                      <Button
                        type="submit"
                        data-battle-submit
                        disabled={
                          busy ||
                          !!retry ||
                          remaining === 0 ||
                          enemy.id in answers ||
                          !simulationChoices[enemy.id]
                        }
                      >
                        回答を確定
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Spaceで選択 · Enterで確定
                      </p>
                    </form>
                    {enemy.id in answers && (
                      <p className="text-xs text-muted-foreground">
                        回答確定済み
                      </p>
                    )}
                  </div>
                ) : (
                  <QuizAttempt
                    quiz={quiz}
                    compactMobile
                    enterToSubmit
                    allowReport={!simulation}
                    disabled={busy || !!retry || remaining === 0}
                    canSubmit={() =>
                      Date.now() + clockOffset < (run.answerDeadline ?? 0)
                    }
                    onConfirm={confirm}
                  />
                )}
              </div>
            );
          })}
        </>
      )}
    </BattleDialog>
  );
}
