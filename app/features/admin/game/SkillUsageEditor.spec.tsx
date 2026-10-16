import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { requestGameCatalog } from "~/features/game/catalog";
import { sampleCatalog } from "~/features/game/catalog.fixtures";
import SkillUsageEditor from "./SkillUsageEditor";

vi.mock("~/features/game/catalog", async (original) => ({
  ...(await original<typeof import("~/features/game/catalog")>()),
  requestGameCatalog: vi.fn(),
}));

it("stores player permissions and specialty quiz policy outside skill definitions", async () => {
  vi.mocked(requestGameCatalog).mockImplementation(
    async (_admin, value) => value ?? structuredClone(sampleCatalog),
  );
  render(<SkillUsageEditor />);
  const user = userEvent.setup();
  await screen.findByRole("row", { name: "ファイア" });
  const player = screen.getByRole("region", { name: "プレイヤーのスキル利用" });
  await user.click(
    within(
      within(player).getByRole("row", { name: "ファイア" }),
    ).getByLabelText("有効"),
  );
  await user.click(
    screen.getByRole("button", { name: "専門分野の使用スキルを追加" }),
  );
  const specialty = screen.getByRole("region", {
    name: "専門分野のスキル利用",
  });
  await user.selectOptions(
    within(specialty).getByLabelText("使用スキル"),
    "heal",
  );
  const seconds = within(specialty).getByLabelText("秒数 / 問");
  await user.clear(seconds);
  await user.type(seconds, "42");
  await user.click(screen.getByRole("button", { name: "保存" }));
  await waitFor(() =>
    expect(requestGameCatalog).toHaveBeenCalledWith(
      true,
      expect.objectContaining({
        skills: sampleCatalog.skills,
        player_skills: [
          { skill_id: "fire", enabled: false },
          { skill_id: "heal", enabled: true },
        ],
        specialty_skills: [
          {
            skill_id: "heal",
            enabled: true,
            quiz_required: true,
            quiz_seconds: 42,
            wrong_multiplier: 0,
            power_coefficient: 1,
          },
        ],
      }),
    ),
  );
});
