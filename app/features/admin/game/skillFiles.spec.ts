import { expect, it } from "vitest";
import { sampleCatalog } from "~/features/game/catalog.fixtures";
import {
  MAX_SKILL_FILE_BYTES,
  readSkillFile,
  skillFileText,
} from "./skillFiles";

it("writes a versioned skills-only file without granting access or exporting consumers", async () => {
  const skills = sampleCatalog.skills.map((s) => ({ ...s, enabled: false }));
  const text = skillFileText(skills);
  expect(JSON.parse(text)).toEqual({
    format: "tanbunism.skills",
    version: 1,
    skills,
  });
  expect(
    await readSkillFile(new File([`\uFEFF${text}`], "skills.json")),
  ).toEqual(JSON.parse(text));
});

it("rejects malformed and oversized files before sending a preview request", async () => {
  await expect(readSkillFile(new File(["{"], "bad.json"))).rejects.toThrow(
    "JSONの形式",
  );
  await expect(
    readSkillFile(
      new File([" ".repeat(MAX_SKILL_FILE_BYTES + 1)], "large.json"),
    ),
  ).rejects.toThrow("1MB以下");
});
