import type { DungeonContent } from "./api";
import { type Allocation, defaultBalance, playerStats } from "./battle";
import { type DungeonMap, ENTRANCE, type ParkedDungeon } from "./exploration";

export const MOVES_PER_EVENT = 5;
export const ENEMIES_TO_CLEAR = 3;

export type Run = {
  resourceId: string;
  name: string;
  hp: number;
  maxHp: number;
  mp?: number;
  maxMp?: number;
  attack: number;
  defense: number;
  moves: number;
  kills: number;
  enemyHp: number;
  enemyMaxHp: number;
  quizCursor: number;
  readIds: string[];
  phase: "path" | "battle" | "rest" | "defeated" | "cleared";
  answerDeadline?: number | null;
  answerSeconds?: number | null;
  enemyId?: string | null;
};
export type GameSave = {
  version: 2;
  economy?: {
    gold: number;
    inventory: Record<string, number>;
    weapon: string | null;
    weapon_attack: number;
    review_reward_day?: string | null;
    quiz_reward_day?: string | null;
    opened_chests?: Record<
      string,
      Record<string, import("./treasure").ChestReward>
    >;
  };
  clears: Record<string, number>;
  bossClears?: Record<string, number[]>;
  gambits?: import("./catalog").GambitRule[];
  visitedDungeons?: string[];
  unlockedDungeons?: {
    sourceId: string;
    resourceId: string;
    name: string;
    achievement: number;
  }[];
  run?: Run;
  content?: DungeonContent;
  battleFeedback?: string | null;
  maps?: Record<string, DungeonMap>;
  dungeons?: Record<string, ParkedDungeon>;
  allocation?: Allocation;
  battle?: {
    id: string;
    turn: number;
    region: number;
    checkpoint: string;
    enemies: string[];
    quizIndices?: Record<string, number>;
    bossLevel?: number | null;
    bossQuizIds?: string[];
    skillUsed?: boolean;
    gambitAction?: import("./catalog").BattleAction | null;
    skill?: {
      id: string;
      resourceId: string;
      name: string;
      quizId: string;
      attack: number;
      deadline: number;
    } | null;
  } | null;
};
export const newSave = (): GameSave => ({
  version: 2,
  clears: {},
});

export function enterDungeon(
  save: GameSave,
  resourceId: string,
  name: string,
  _level: number,
): GameSave {
  // The caller must consume a server-side adventure right first.
  if (save.run) return save;
  const parked = save.dungeons?.[resourceId];
  if (parked && !["cleared", "defeated"].includes(parked.run.phase)) {
    const dungeons = { ...save.dungeons };
    delete dungeons[resourceId];
    return {
      ...save,
      dungeons,
      run: parked.run,
      content: parked.content,
      battleFeedback: undefined,
    };
  }
  const stats = playerStats(
    save.allocation,
    defaultBalance,
    save.economy?.weapon_attack,
  );
  const maxHp = stats.maxHp;
  return {
    ...save,
    maps: save.maps?.[resourceId]
      ? {
          ...save.maps,
          [resourceId]: { ...save.maps[resourceId], current: ENTRANCE },
        }
      : save.maps,
    battleFeedback: undefined,
    run: {
      resourceId,
      name,
      hp: maxHp,
      maxHp,
      maxMp: stats.maxMp,
      mp: stats.maxMp,
      attack: stats.attack,
      defense: stats.defense,
      moves: 0,
      kills: 0,
      enemyHp: 0,
      enemyMaxHp: 20,
      quizCursor: 0,
      readIds: [],
      phase: "path",
    },
  };
}

export function resumeEvent(save: GameSave): GameSave {
  // Server permission is independent of HP, kills and local adventure state.
  if (save.run?.phase !== "rest") return save;
  return {
    ...save,
    run: { ...save.run, moves: 0, phase: "path" },
  };
}

/** Defeat returns the player to the entrance; recovery costs one move. */
export function recoverAtEntrance(save: GameSave): GameSave {
  const run = save.run;
  if (!run || run.phase !== "defeated") return save;
  const moves = Math.min(MOVES_PER_EVENT, run.moves + 1);
  return {
    ...save,
    maps: {
      ...save.maps,
      [run.resourceId]: {
        ...(save.maps?.[run.resourceId] ?? {
          current: ENTRANCE,
          places: [],
          edges: [],
        }),
        current: ENTRANCE,
      },
    },
    battle: null,
    battleFeedback: undefined,
    run: {
      ...run,
      hp: run.maxHp,
      enemyHp: 0,
      moves,
      phase: moves >= MOVES_PER_EVENT ? "rest" : "path",
      answerDeadline: null,
      answerSeconds: null,
    },
  };
}

/** A lap is a reward, not a dead end. Continue without healing or extra moves. */
export function continueExploring(save: GameSave): GameSave {
  if (save.run?.phase !== "cleared" || save.battleFeedback) return save;
  return {
    ...save,
    run: {
      ...save.run,
      kills: 0,
      phase: save.run.moves >= MOVES_PER_EVENT ? "rest" : "path",
    },
  };
}

export function move(
  save: GameSave,
  sentenceId: string,
  roll: number,
): GameSave {
  const run = save.run;
  if (
    !run ||
    run.phase !== "path" ||
    (!save.maps && run.readIds.includes(sentenceId))
  )
    return save;
  const moves = run.moves + 1;
  const encounter = sentenceId !== ENTRANCE && roll < 0.65;
  return {
    ...save,
    run: {
      ...run,
      moves,
      readIds: [...run.readIds, sentenceId].slice(-100),
      enemyHp: encounter ? run.enemyMaxHp : 0,
      phase: encounter ? "battle" : moves >= MOVES_PER_EVENT ? "rest" : "path",
    },
  };
}

export function answer(save: GameSave, correct: boolean): GameSave {
  const run = save.run;
  if (!run || run.phase !== "battle") return save;
  const enemyHp = correct ? Math.max(0, run.enemyHp - run.attack) : run.enemyHp;
  const hp = correct
    ? run.hp
    : Math.max(
        0,
        run.hp -
          Math.max(
            1,
            (Object.values(save.content?.regionEnemies ?? {})
              .flat()
              .find((enemy) => enemy.id === run.enemyId)?.attack ?? 12) -
              run.defense,
          ),
      );
  const kills = run.kills + (enemyHp === 0 ? 1 : 0);
  const phase =
    hp === 0
      ? "defeated"
      : kills >= ENEMIES_TO_CLEAR
        ? "cleared"
        : enemyHp === 0
          ? run.moves >= MOVES_PER_EVENT
            ? "rest"
            : "path"
          : "battle";
  return {
    ...save,
    clears:
      phase === "cleared"
        ? {
            ...save.clears,
            [run.resourceId]: (save.clears[run.resourceId] ?? 0) + 1,
          }
        : save.clears,
    run: { ...run, hp, enemyHp, kills, phase, quizCursor: run.quizCursor + 1 },
  };
}
