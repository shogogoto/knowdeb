import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import MultiBattle from "./MultiBattle";
import type { DungeonContent } from "./api";
import { defaultBalance } from "./battle";
import { enterDungeon, newSave } from "./domain";

const content: DungeonContent = {
  knowledge: [],
  quizzes: [0, 1].map((i) => ({
    quiz_id: `quiz-${i}`,
    quiz_type: "sent2term",
    statement: "説明に合う用語を選んでください。",
    prompt: { subject: `クイズ ${i + 1}`, answer_kind: "term" },
    options: { yes: "正しい用語", no: "別の用語" },
    correct: ["yes"],
    no_correct_option: false,
    created: "2026-10-16T00:00:00Z",
  })),
};
const save = enterDungeon(newSave(), "sample", "サンプル", 1);
const run = save.run;
if (!run) throw new Error("Missing sample run");
const enemies = [0, 1].map((i) => ({
  id: `enemy-${i}`,
  name: `敵 ${i + 1}`,
  quizIndex: i,
  hp: 20,
  attack: 10,
  relations: 0,
  region: 0,
  icon: i ? "rat" : "snail",
}));
const meta = {
  title: "Game/Battle",
  component: MultiBattle,
  parameters: {
    msw: {
      handlers: [
        http.post("*/game/battle/turn", () =>
          HttpResponse.json({
            results: { "enemy-0": true, "enemy-1": true },
            damage: 0,
            state: { revision: 1, save },
          }),
        ),
      ],
    },
  },
} satisfies Meta<typeof MultiBattle>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SequentialQuizzes: Story = {
  args: {
    save: {
      ...save,
      run: {
        ...run,
        phase: "battle",
        answerDeadline: Date.now() + 3600000,
        answerSeconds: 3600,
      },
      battle: {
        id: "sample-battle",
        turn: 0,
        region: 0,
        checkpoint: "@entrance",
        enemies: enemies.map((e) => e.id),
      },
    },
    content,
    context: { balance: defaultBalance, enemies },
    simulation: true,
    syntheticAnswers: false,
    onSaved: () => undefined,
    onBusy: () => undefined,
    onFinished: async () => undefined,
  },
};

export const CharacterEnemies: Story = {
  ...SequentialQuizzes,
  args: {
    ...SequentialQuizzes.args,
    context: {
      balance: defaultBalance,
      enemies: enemies.map((e, i) => ({
        ...e,
        icon: i ? "art_owl_mage" : "art_ink_slime",
      })),
    },
  },
};

export const BossArtwork: Story = {
  ...SequentialQuizzes,
  args: {
    ...SequentialQuizzes.args,
    save: {
      ...save,
      run: {
        ...run,
        phase: "battle",
        answerDeadline: Date.now() + 3600000,
        answerSeconds: 3600,
      },
      battle: {
        id: "sample-boss",
        turn: 0,
        region: 4,
        checkpoint: "@entrance",
        bossLevel: 5,
        enemies: ["boss:archive"],
      },
    },
    context: {
      balance: defaultBalance,
      enemies: [
        {
          ...enemies[0],
          id: "boss:archive",
          name: "書庫のゴーレム",
          icon: "art_archive_golem",
          hp: 100,
        },
      ],
    },
  },
};
