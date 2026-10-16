import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { SkillDefinition } from "~/features/game/catalog";
import { sampleCatalog } from "~/features/game/catalog.fixtures";
import SkillTables from "./SkillTables";

function Demo() {
  const [skills, setSkills] = useState<SkillDefinition[]>([
    ...sampleCatalog.skills,
    {
      id: "bubble",
      name: "バブル",
      icon: "heart",
      enabled: true,
      effect: "buff",
      target: "self",
      amount: 100,
      amount_mode: "percent",
      stat: "maxHp",
      duration_turns: 3,
      stack_limit: 1,
      multiplier: 1,
      mp_cost: 3,
    },
    {
      id: "poison",
      name: "毒",
      icon: "droplet",
      enabled: true,
      effect: "ailment",
      target: "enemy",
      amount: 5,
      multiplier: 1,
      mp_cost: 2,
    },
  ]);
  return (
    <div className="p-4">
      <SkillTables
        skills={skills}
        add={(effect) =>
          setSkills((current) => [
            ...current,
            {
              id: `skill_${current.length}`,
              name: "新しいスキル",
              icon: "sparkles",
              enabled: true,
              effect,
              target: ["attack", "debuff", "ailment"].includes(effect)
                ? "enemy"
                : "self",
              amount: effect === "ailment" ? 5 : 0,
              multiplier: 1,
              mp_cost: 0,
            },
          ])
        }
        update={(id, patch) =>
          setSkills((current) =>
            current.map((s) => (s.id === id ? { ...s, ...patch } : s)),
          )
        }
      />
    </div>
  );
}
export default {
  title: "Admin/SkillTables",
  component: Demo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Demo>;
export const Types: StoryObj<typeof Demo> = {};
