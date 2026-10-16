import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import QuizAttempt from "~/features/quiz/QuizAttempt";
import QuizPreviewPrompt from "~/features/quiz/QuizPreviewPrompt";
import { Button } from "~/shared/components/ui/button";
import type { UserReadPublic } from "~/shared/generated/fastAPI.schemas";
import BattleDialog from "./BattleDialog";
import EnemyAvatar from "./EnemyAvatar";
import GameIcon from "./GameIcon";
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
import { playBattleSound } from "./battleSound";
import {
  actionDamage,
  effectAmount,
  modifiedStat,
  poisonDamage,
} from "./catalog";
import { characterAsset } from "./characterAssets";
import type { GameSave } from "./domain";
import { musicPreferences } from "./music";
import type { GameState } from "./state";
import useBattleTempo, { type BattleTempo } from "./useBattleTempo";

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
  syntheticAnswers = simulation,
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
  syntheticAnswers?: boolean;
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
  const resultAdvance = useRef<HTMLButtonElement>(null);
  const pendingAnswerFocus = useRef(false);
  const [frozenRemainingMs, setFrozenRemainingMs] = useState<number>();
  const [active, setActive] = useState(0);
  const [now, setNow] = useState(Date.now);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<TurnResult>();
  const resultMarker = useRef(save.battle);
  const effectMarker = result ? resultMarker.current : battle;
  const [resultIndex, setResultIndex] = useState(0);
  const processedIndex = useRef(0);
  const resultStartHp = useRef(run?.hp ?? 0);
  const [incomingProcessed, setIncomingProcessed] = useState(0);
  const [poisonEffects, setPoisonEffects] = useState<Record<string, number>>(
    {},
  );
  const tempo = useBattleTempo();
  const [turnDamageByEnemy, setTurnDamageByEnemy] = useState<
    Record<string, number>
  >({});
  const [retry, setRetry] = useState<TurnInput>();
  const [hitEffects, setHitEffects] = useState<
    Record<string, { damage: number; level: number; label: string }>
  >({});
  const sending = useRef(false);
  const settledTurn = useRef<string | undefined>(undefined);
  const retryDamage = useRef<
    { key: string; values: Record<string, number> } | undefined
  >(undefined);
  const resultEnemies = useRef(battle?.enemies ?? []);
  const resultQuizIndices = useRef(battle?.quizIndices);
  const resultContext = useRef(context);
  if (!result) {
    resultContext.current = context;
    resultEnemies.current = battle?.enemies ?? [];
    resultQuizIndices.current = battle?.quizIndices;
  }
  // The turn response already contains its sealed assignments. A background
  // context refresh must never display the previous turn's question meanwhile.
  const quizIndices = result ? resultQuizIndices.current : battle?.quizIndices;
  const liveIds = result ? resultEnemies.current : (battle?.enemies ?? []);
  const live = (result ? resultContext.current : context).enemies
    .filter((enemy) => liveIds.includes(enemy.id))
    .sort((a, b) => liveIds.indexOf(a.id) - liveIds.indexOf(b.id))
    .map((enemy) => ({
      ...enemy,
      attack: modifiedStat(enemy.attack, effectMarker, enemy.id, "attack"),
      quizIndex: quizIndices?.[enemy.id] ?? enemy.quizIndex,
    }));
  const currentHp = remainingHp(hp, live);
  const resultIds = result ? live.map((enemy) => enemy.id) : [];
  const nextResultId = resultIds[resultIndex];
  const delay =
    context.balance[`battle_tempo_${tempo.tempo}_seconds`] ??
    {
      slow: 3,
      medium: 1,
      fast: 0.5,
    }[tempo.tempo];
  useEffect(() => {
    if (!result || !nextResultId || busy) return;
    const index = processedIndex.current;
    const advance = () => {
      if (processedIndex.current !== index) return;
      if (resultAdvance.current) resultAdvance.current.click();
      else timer = setTimeout(advance, 100);
    };
    let timer = setTimeout(advance, delay * 1000);
    return () => clearTimeout(timer);
  }, [result, nextResultId, busy, delay]);
  const baseStats = playerStats(
    save.allocation,
    context.balance,
    save.economy?.weapon_attack,
  );
  const stats = {
    ...baseStats,
    attack: modifiedStat(baseStats.attack, effectMarker, "player", "attack"),
    defense: modifiedStat(baseStats.defense, effectMarker, "player", "defense"),
  };
  const focusAnswerChoice = useCallback(
    (direction: "first" | "last" = "first") => {
      const selector = syntheticAnswers
        ? "button[data-simulation-option]:not(:disabled)"
        : "button[data-quiz-option-index]:not(:disabled)";
      const choices =
        activeAnswerArea.current?.querySelectorAll<HTMLElement>(selector);
      const choice =
        direction === "first" ? choices?.[0] : choices?.[choices.length - 1];
      choice?.focus();
      return Boolean(choice);
    },
    [syntheticAnswers],
  );
  // Answer buttons are replaced/disabled during confirmation and turn changes.
  // Wait for React to commit the new question instead of racing a paint callback.
  useLayoutEffect(() => {
    if (result && !busy) resultAdvance.current?.focus();
  }, [busy, result]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Active changes commit a different answer area's ref; focus only when explicitly requested.
  useLayoutEffect(() => {
    if (!busy && !result && pendingAnswerFocus.current && focusAnswerChoice()) {
      pendingAnswerFocus.current = false;
    }
  }, [active, busy, result, focusAnswerChoice]);
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
    const damageKey = `${battle.id}:${battle.turn}`;
    if (settledTurn.current === damageKey) return;
    sending.current = true;
    resultMarker.current = structuredClone(battle);
    setBusy(true);
    onBusy(true);
    setError(undefined);
    const damageByEnemy =
      retryDamage.current?.key === damageKey
        ? retryDamage.current.values
        : Object.fromEntries(
            live.map((enemy) => [
              enemy.id,
              actionDamage(
                rollDamage(
                  stats.attack,
                  context.balance,
                  `${battle.turn}:${enemy.id}`,
                ),
                retreat ? null : battle.gambitAction,
                enemy.id,
                battle.enemies[0],
                stats.attack,
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
      // Parent updates can render before the local result commits. Never
      // auto-submit an already settled turn in that intermediate render.
      settledTurn.current = damageKey;
      setResult(resolved);
      setResultIndex(0);
      processedIndex.current = 0;
      resultStartHp.current = Math.min(
        stats.maxHp,
        run.hp +
          (!request.retreat &&
          battle.gambitAction?.skill.effect === "heal_hp" &&
          Object.values(resolved.results).some(Boolean)
            ? effectAmount(battle.gambitAction.skill, stats.maxHp)
            : 0),
      );
      setIncomingProcessed(0);
      setTurnDamageByEnemy(damageByEnemy);
      setHitEffects({});
      setPoisonEffects({});
      setRetry(undefined);
      retryDamage.current = undefined;
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
  const tempoControl = (
    <label className="flex items-center" title="戦闘テンポ">
      <select
        aria-label="戦闘テンポ"
        className="h-8 w-14 rounded-md border bg-background px-1 text-sm"
        value={tempo.tempo}
        disabled={tempo.saving}
        onChange={(event) =>
          void tempo.change(event.target.value as BattleTempo)
        }
      >
        <option value="slow">遅</option>
        <option value="medium">中</option>
        <option value="fast">速</option>
      </select>
    </label>
  );
  const enemyPanel = (
    <div
      className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 space-y-2"
      aria-label="敵一覧"
    >
      <div
        className={`grid gap-2 ${live.length === 1 ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}
      >
        {live.map((enemy, index) => (
          <div
            key={enemy.id}
            aria-label={enemy.name}
            aria-current={!result && active === index ? "step" : undefined}
            className={`flex min-w-0 items-center gap-3 rounded-md border p-2 text-left ${characterAsset(enemy.icon) ? "flex-col" : ""} ${!result && active === index ? "border-primary bg-background" : "border-transparent"}`}
          >
            <EnemyAvatar identity={enemy.id} icon={enemy.icon} large />
            <span className="min-w-0 w-full flex-1 space-y-1">
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
          </div>
        ))}
      </div>
      {displayed && (
        <p className="text-xs text-muted-foreground">
          Spaceで選択 · Enterで確定 · 回答中: {displayed.name}（攻{" "}
          {displayed.attack}）
        </p>
      )}
    </div>
  );
  return (
    <BattleDialog
      run={{
        ...run,
        ...stats,
        hp: Math.min(
          result
            ? Math.max(0, resultStartHp.current - incomingProcessed)
            : run.hp,
          stats.maxHp,
        ),
      }}
      player={player}
      playerName={playerName}
      busy={busy}
      enemyPanel={enemyPanel}
      headerControls={tempoControl}
      footer={
        !result && (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              disabled={busy || !!retry}
              onClick={() => void submitTurn(true)}
            >
              撤退する
            </Button>
            {tempo.error && (
              <p role="alert" className="text-sm text-destructive">
                {tempo.error}
              </p>
            )}
          </div>
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
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {nextResultId
                ? `結果 ${resultIndex + 1}/${resultIds.length} を処理します`
                : resultIds.length > 0
                  ? "全ての結果を処理しました"
                  : "戦闘結果を確認してください"}
            </p>
          </div>
          {tempo.error && (
            <p role="alert" className="text-sm text-destructive">
              {tempo.error}
            </p>
          )}
          {!nextResultId && <output>{result.state.save.battleFeedback}</output>}
          {resultIds.map((id, index) => {
            const enemy = live.find((item) => item.id === id);
            const processed = index < resultIndex;
            const correct = result.results[id];
            return (
              enemy && (
                <section
                  key={id}
                  aria-current={index === resultIndex ? "step" : undefined}
                  className={`rounded-md border p-3 space-y-2 transition-colors duration-300 ${
                    processed
                      ? correct
                        ? "border-emerald-500/60 bg-emerald-500/10"
                        : "border-rose-500/50 bg-rose-500/10"
                      : index === resultIndex
                        ? "border-primary/70 bg-primary/5"
                        : "border-border opacity-60"
                  }`}
                >
                  <p className="font-medium">
                    {enemy.name} ·{" "}
                    {processed
                      ? correct
                        ? "正解"
                        : id in answers
                          ? "不正解"
                          : "未回答"
                      : "未処理"}
                  </p>
                  {processed && hitEffects[id] && (
                    <p
                      aria-label={
                        correct
                          ? `${enemy.name}へのダメージ`
                          : `${enemy.name}からプレイヤーへのダメージ`
                      }
                      className={`motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:slide-in-from-top-2 duration-500 ${
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
                  {processed && !simulation && (
                    <QuizPreviewPrompt
                      quiz={content.quizzes[enemy.quizIndex]}
                      showCorrectAnswer
                    />
                  )}
                  {processed && (poisonEffects[id] ?? 0) > 0 && (
                    <p
                      aria-label={`${enemy.name}の毒ダメージ`}
                      className="text-lime-500 font-medium motion-safe:animate-in motion-safe:slide-in-from-top-2"
                    >
                      毒 · {poisonEffects[id]}ダメージ
                    </p>
                  )}
                </section>
              )
            );
          })}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              ref={resultAdvance}
              disabled={busy || Boolean(save.battle?.skill)}
              data-battle-advance
              onClick={() => {
                if (nextResultId) {
                  if (processedIndex.current > resultIndex) return;
                  processedIndex.current = resultIndex + 1;
                  const id = nextResultId;
                  if (result.results[id]) {
                    const damage = turnDamageByEnemy[id] ?? 0;
                    const effect = damageEffect(
                      damage,
                      stats.attack,
                      context.balance,
                      actionDamage(
                        Math.max(
                          stats.attack === 0 ? 0 : 1,
                          Math.floor(
                            stats.attack *
                              context.balance.damage_attack_multiplier,
                          ),
                        ),
                        battle.gambitAction,
                        id,
                        battle.enemies[0],
                        stats.attack,
                      ),
                    );
                    setHp((current) => ({
                      ...current,
                      [id]: Math.max(0, (current[id] ?? 0) - damage),
                    }));
                    setHitEffects((current) => ({
                      ...current,
                      [id]: {
                        damage,
                        ...effect,
                        label:
                          battle.gambitAction?.skill.effect === "attack" &&
                          (battle.gambitAction.skill.target === "all_enemies" ||
                            id === battle.enemies[0])
                            ? `${battle.gambitAction.name} · ${effect.label}`
                            : effect.label,
                      },
                    }));
                    if (musicPreferences().enabled)
                      playBattleSound(true, effect.level);
                  } else {
                    const damage = result.incoming_damage?.[id];
                    if (damage !== undefined) {
                      setIncomingProcessed((current) => current + damage);
                      setHitEffects((current) => ({
                        ...current,
                        [id]: { damage, level: 1, label: "被ダメージ" },
                      }));
                    }
                    if (musicPreferences().enabled) playBattleSound(false);
                  }
                  const nextIndex = resultIndex + 1;
                  const enemy = live.find((item) => item.id === id);
                  const poison =
                    result.poison_damage?.[id] ??
                    poisonDamage(enemy?.hp ?? 0, effectMarker, id);
                  const hpAfterAttack = Math.max(
                    0,
                    (currentHp[id] ?? 0) -
                      (result.results[id] ? (turnDamageByEnemy[id] ?? 0) : 0),
                  );
                  const tick = Math.min(poison, Math.max(0, hpAfterAttack - 1));
                  if (tick > 0) {
                    setPoisonEffects((current) => ({ ...current, [id]: tick }));
                    setHp((current) => ({
                      ...current,
                      [id]: Math.max(1, (current[id] ?? 0) - tick),
                    }));
                  }
                  setResultIndex(nextIndex);
                  if (nextIndex >= resultIds.length) {
                    if (!result.incoming_damage)
                      setIncomingProcessed(result.damage);
                    onSaved(result.state);
                  }
                  return;
                }
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
                    pendingAnswerFocus.current = true;
                    setAnswers({});
                    setSimulationChoices({});
                    setFrozenRemainingMs(undefined);
                    setActive(0);
                    setResult(undefined);
                    setResultIndex(0);
                    setTurnDamageByEnemy({});
                    setHitEffects({});
                    setPoisonEffects({});
                    onSaved(state);
                  })
                  .catch((cause) => setError(cause.message))
                  .finally(() => {
                    setBusy(false);
                    onBusy(false);
                  });
              }}
            >
              {nextResultId
                ? `結果を処理 · ${resultIndex + 1}/${resultIds.length}`
                : save.battle
                  ? "次のターン"
                  : "続ける"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {(battle.effects ?? []).some(
            (e) => e.starts_turn <= battle.turn && battle.turn < e.expires_turn,
          ) && (
            <ul
              aria-label="戦闘中の効果"
              className="flex flex-wrap gap-2 text-xs"
            >
              {(battle.effects ?? [])
                .filter(
                  (e) =>
                    e.starts_turn <= battle.turn &&
                    battle.turn < e.expires_turn,
                )
                .map((e, i) => (
                  <li
                    key={`${e.skill.id}:${e.target_id}:${e.starts_turn}:${i}`}
                    className="rounded border px-2 py-1"
                  >
                    {e.target_id === "player"
                      ? "自分"
                      : (context.enemies.find(
                          (enemy) => enemy.id === e.target_id,
                        )?.name ?? "敵")}{" "}
                    · {e.skill.name} · あと{e.expires_turn - battle.turn}ターン
                  </li>
                ))}
            </ul>
          )}
          {battle.gambitAction && (
            <p
              className="flex items-center gap-2 text-sm"
              aria-label="このターンの自動行動"
            >
              <GameIcon icon={battle.gambitAction.skill.icon} />
              {battle.gambitAction.name}
              {!battle.gambitAction.item_id &&
                ` · MP ${battle.gambitAction.skill.mp_cost}`}
            </p>
          )}
          <div className="flex justify-end gap-2 text-sm">
            <span>
              回答確定 {Object.keys(answers).length}/{live.length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            回答を確定すると次のクイズへ進みます。
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
                pendingAnswerFocus.current = true;
                setActive(next);
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
                {syntheticAnswers ? (
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
                      <fieldset className="grid grid-cols-2 gap-2">
                        <legend className="sr-only">模擬回答</legend>
                        {(["correct", "incorrect"] as const).map((choice) => {
                          const selected =
                            simulationChoices[enemy.id] === choice;
                          return (
                            <button
                              key={choice}
                              type="button"
                              data-simulation-option
                              aria-pressed={selected}
                              disabled={
                                busy ||
                                !!retry ||
                                remaining === 0 ||
                                enemy.id in answers
                              }
                              onClick={() =>
                                setSimulationChoices((current) => {
                                  if (current[enemy.id] === choice) {
                                    const next = { ...current };
                                    delete next[enemy.id];
                                    return next;
                                  }
                                  return { ...current, [enemy.id]: choice };
                                })
                              }
                              className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary ${selected ? "border-primary bg-primary/10" : "hover:bg-muted"}`}
                            >
                              {choice === "correct" ? "正解" : "不正解"}
                            </button>
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
                        Spaceで選択/解除 · Enterで確定
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
                    keyboardHint="矢印で移動 · Spaceで選択/解除 · Enterで確定"
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
