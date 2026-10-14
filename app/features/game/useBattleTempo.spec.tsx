import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
import { vi } from "vitest";
import { AuthContext } from "~/features/auth/AuthProvider";
import type { UserRead } from "~/shared/generated/fastAPI.schemas";
import { gameRequest } from "./battle";
import useBattleTempo, { type BattleTempo } from "./useBattleTempo";

vi.mock("./battle", () => ({ gameRequest: vi.fn() }));
const request = vi.mocked(gameRequest);

function Control() {
  const settings = useBattleTempo();
  return (
    <>
      <select
        aria-label="速度"
        value={settings.tempo}
        disabled={settings.saving}
        onChange={(event) =>
          void settings.change(event.target.value as BattleTempo)
        }
      >
        <option value="slow">遅</option>
        <option value="medium">中</option>
        <option value="fast">速</option>
      </select>
      {settings.error && <p role="alert">{settings.error}</p>}
    </>
  );
}

function signedIn() {
  return render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <AuthContext.Provider
        value={{
          user: { uid: "viewer" } as UserRead,
          isLoading: false,
          isValidating: false,
          isAuthenticated: true,
          signOut: vi.fn(),
          mutate: vi.fn(),
        }}
      >
        <Control />
      </AuthContext.Provider>
    </SWRConfig>,
  );
}

beforeEach(() => request.mockReset());

it("loads and saves the signed-in viewer's preference, not the simulated player's stats", async () => {
  request
    .mockResolvedValueOnce({ tempo: "slow" })
    .mockResolvedValueOnce({ tempo: "fast" });
  signedIn();
  const select = screen.getByRole("combobox");
  await waitFor(() => expect(select).toHaveValue("slow"));
  await userEvent.selectOptions(select, "fast");
  await waitFor(() => expect(select).toHaveValue("fast"));
  expect(request).toHaveBeenCalledWith(
    "battle/preferences",
    { tempo: "fast" },
    "PUT",
  );
});

it("keeps the saved speed when saving fails", async () => {
  request
    .mockResolvedValueOnce({ tempo: "slow" })
    .mockRejectedValueOnce(new Error("保存失敗"));
  signedIn();
  await waitFor(() => expect(screen.getByRole("combobox")).toHaveValue("slow"));
  await userEvent.selectOptions(screen.getByRole("combobox"), "fast");
  await screen.findByRole("alert");
  expect(screen.getByRole("combobox")).toHaveValue("slow");
  expect(screen.getByRole("combobox")).toBeEnabled();
});

it("uses a disposable local setting outside an authenticated game", async () => {
  render(<Control />);
  expect(screen.getByRole("combobox")).toHaveValue("medium");
  await userEvent.selectOptions(screen.getByRole("combobox"), "fast");
  expect(screen.getByRole("combobox")).toHaveValue("fast");
  expect(request).not.toHaveBeenCalled();
});
