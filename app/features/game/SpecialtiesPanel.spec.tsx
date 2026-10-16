import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
import SpecialtiesPanel from "./SpecialtiesPanel";
import { gameRequest } from "./battle";
import { requestGameCatalog } from "./catalog";
import { sampleCatalog } from "./catalog.fixtures";
import { newSave } from "./domain";

vi.mock("./battle", async (original) => ({
  ...(await original<typeof import("./battle")>()),
  gameRequest: vi.fn(),
}));
vi.mock("./catalog", async (original) => ({
  ...(await original<typeof import("./catalog")>()),
  requestGameCatalog: vi.fn(),
}));

it("keeps unequipped specialties and sends an explicitly confirmed fusion with the retained skill", async () => {
  const save = {
    ...newSave(),
    specialties: [
      {
        id: "specialty_a",
        name: "回復",
        skill_id: "heal",
        resource_ids: ["a"],
        equipped: false,
      },
      {
        id: "specialty_b",
        name: "攻撃",
        skill_id: "fire",
        resource_ids: ["b"],
        equipped: true,
      },
    ],
  };
  vi.mocked(requestGameCatalog).mockResolvedValue(sampleCatalog);
  vi.mocked(gameRequest).mockImplementation(async (path, body) =>
    body
      ? { revision: 3, save: { ...save, specialties: [] } }
      : {
          slots: 1,
          next_level: 20,
          available: [],
          names: { a: "本A", b: "本B" },
          amounts: { specialty_a: 25, specialty_b: 30 },
        },
  );
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
  const onSaved = vi.fn();
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <SpecialtiesPanel save={save} revision={2} onSaved={onSaved} />
    </SWRConfig>,
  );
  const user = userEvent.setup();
  await screen.findByText("本A");
  expect(screen.getByText(/装備 1\/1枠/)).toBeVisible();
  for (const checkbox of screen.getAllByRole("checkbox", { name: "配合元" }))
    await user.click(checkbox);
  await user.selectOptions(
    screen.getByRole("combobox", { name: "配合で残すスキル" }),
    "heal",
  );
  await user.click(screen.getByRole("button", { name: "配合する" }));
  await waitFor(() => expect(onSaved).toHaveBeenCalled());
  expect(gameRequest).toHaveBeenCalledWith("specialties", {
    revision: 2,
    operation: "fuse",
    ids: ["specialty_a", "specialty_b"],
    skill_id: "heal",
  });
  expect(confirm).toHaveBeenCalledOnce();
  confirm.mockRestore();
});
