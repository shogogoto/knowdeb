import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import { vi } from "vitest";
import GlobalHotkeys, {
  HotkeyProvider,
} from "~/features/hotkeys/GlobalHotkeys";
import { HistoryPanelProvider } from "~/shared/history/HistoryPanel";
import Admin from ".";

vi.mock("~/features/auth/AuthProvider", () => ({
  useAuth: () => ({
    user: { uid: "admin", is_superuser: true },
    isAuthenticated: true,
    isLoading: false,
  }),
}));
vi.mock("~/shared/history/hooks", () => ({
  useHistory: () => ({ histories: [] }),
}));
vi.mock("./users", () => ({ default: () => <p>ユーザー管理画面</p> }));
vi.mock("./workload", () => ({ default: () => <p>負荷制御画面</p> }));
vi.mock("./levels", () => ({ default: () => <p>レベル画面</p> }));
vi.mock("./game", () => ({ default: () => <p>ゲーム管理画面</p> }));
vi.mock("./power", () => ({ default: () => <p>Power画面</p> }));
vi.mock("./pagerank", () => ({ default: () => <p>PageRank画面</p> }));
vi.mock("./images", () => ({ default: () => <p>画像管理画面</p> }));
vi.mock("./orphanedTanbuns", () => ({
  default: ({ kind }: { kind: string }) => <p>{kind}管理画面</p>,
}));
vi.mock("./brokenQuizzes", () => ({ default: () => <p>参照切れ管理画面</p> }));

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output aria-label="現在のURL">
        {location.pathname}
        {location.search}
      </output>
      <button type="button" onClick={() => navigate(-1)}>
        戻る
      </button>
      <input aria-label="入力欄" />
    </>
  );
}

function setup(path = "/admin/users") {
  render(
    <MemoryRouter initialEntries={[path]}>
      <HistoryPanelProvider>
        <HotkeyProvider>
          <Routes>
            <Route path="/admin/:tab?/:subtab?" element={<Admin />} />
          </Routes>
          <Navigation />
          <GlobalHotkeys />
        </HotkeyProvider>
      </HistoryPanelProvider>
    </MemoryRouter>,
  );
  return userEvent.setup();
}

it("shows eight numbered top-level tabs with maintenance last", () => {
  setup();
  const tabs = within(
    screen.getByRole("tablist", { name: "管理画面の表示切り替え" }),
  ).getAllByRole("tab");
  expect(tabs).toHaveLength(8);
  for (const [index, tab] of tabs.entries()) {
    expect(tab).toHaveAttribute("title", `Ctrl+${index + 1}`);
    expect(tab.querySelector("kbd")).toHaveTextContent(`${index + 1}`);
  }
  expect(tabs[7]).toHaveAccessibleName("メンテナンス");
  expect(tabs[0]).toHaveAccessibleName("ゲーム");
  expect(tabs[0]).toHaveAttribute("aria-controls", "admin-tabs-game-panel");
  expect(
    screen.queryByRole("tab", { name: "孤立Tanbun" }),
  ).not.toBeInTheDocument();
});

it("Ctrl+numbers select the matching top-level URLs even inside maintenance", async () => {
  const user = setup("/admin/maintenance/misplaced");
  const paths = [
    "game/balance",
    "users",
    "workload",
    "levels",
    "power",
    "pagerank",
    "images",
    "maintenance/orphans",
  ];
  for (const [index, path] of paths.entries()) {
    await user.keyboard(`{Control>}${index + 1}{/Control}`);
    expect(screen.getByLabelText("現在のURL")).toHaveTextContent(
      `/admin/${path}`,
    );
  }
  await user.click(screen.getByLabelText("入力欄"));
  await user.keyboard("{Control>}1{/Control}");
  expect(screen.getByLabelText("現在のURL")).toHaveTextContent(
    "/admin/maintenance/orphans",
  );
});

it("keeps maintenance sections separate and supports browser back", async () => {
  const user = setup("/admin/maintenance/orphans");
  expect(screen.getByText("orphaned管理画面")).toBeVisible();
  await user.click(screen.getByRole("tab", { name: "配置切れTanbun" }));
  expect(screen.getByLabelText("現在のURL")).toHaveTextContent(
    "/admin/maintenance/misplaced",
  );
  expect(screen.getByText("misplaced管理画面")).toBeVisible();
  await user.click(screen.getByRole("tab", { name: "参照切れQuiz" }));
  expect(screen.getByText("参照切れ管理画面")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "戻る" }));
  expect(screen.getByText("misplaced管理画面")).toBeVisible();
});

it("t then a number selects maintenance subtabs without changing the top-level tab", async () => {
  const user = setup("/admin/maintenance/orphans");
  await user.keyboard("t3");
  expect(screen.getByLabelText("現在のURL")).toHaveTextContent(
    "/admin/maintenance/broken-quizzes",
  );
  expect(screen.getByRole("tab", { name: "メンテナンス" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await user.keyboard("t2");
  expect(screen.getByLabelText("現在のURL")).toHaveTextContent(
    "/admin/maintenance/misplaced",
  );
  expect(screen.getByRole("tab", { name: "配置切れTanbun" })).toHaveAttribute(
    "title",
    "t → 2",
  );
  await user.keyboard("t1");
  expect(screen.getByLabelText("現在のURL")).toHaveTextContent(
    "/admin/maintenance/orphans",
  );
});

it.each(["orphans", "misplaced", "broken-quizzes"])(
  "redirects the legacy %s URL to maintenance",
  async (tab) => {
    setup(`/admin/${tab}`);
    await waitFor(() =>
      expect(screen.getByLabelText("現在のURL")).toHaveTextContent(
        `/admin/maintenance/${tab}`,
      ),
    );
    expect(screen.getByRole("tab", { name: "メンテナンス" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
);

it("retains legacy query links and defaults to the first top-level tab", async () => {
  setup("/admin?view=broken-quizzes");
  await waitFor(() =>
    expect(screen.getByLabelText("現在のURL")).toHaveTextContent(
      "/admin/maintenance/broken-quizzes",
    ),
  );
});

it("opens game for the admin root", async () => {
  setup("/admin");
  await waitFor(() =>
    expect(screen.getByLabelText("現在のURL")).toHaveTextContent(
      "/admin/game/balance",
    ),
  );
});
