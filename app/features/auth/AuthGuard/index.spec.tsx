import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse, delay } from "msw";
import { setupServer } from "msw/node";
import { Link, createRoutesStub } from "react-router";
import { getAuthMock } from "~/shared/generated/auth/auth.msw";
import { getUserMock } from "~/shared/generated/user/user.msw";
import AuthGuard from ".";
import { AuthProvider } from "../AuthProvider";
import * as AuthMock from "../AuthProvider";

const server = setupServer(...getUserMock(), ...getAuthMock());
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function mkStub() {
  return createRoutesStub([
    {
      path: "/any",
      Component: () => (
        <AuthProvider>
          <AuthGuard>
            <div>home</div>
          </AuthGuard>
        </AuthProvider>
      ),
    },
    { path: "other", Component: () => <Link to="/any">other</Link> },
  ]);
}
describe("Home", () => {
  describe("認証済み", () => {
    beforeEach(() => {
      // @ts-ignore
      vi.spyOn(AuthMock, "useAuth").mockReturnValue({ isAuthenticated: true });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("速攻子要素表示", async () => {
      const Stub = mkStub();
      render(<Stub initialEntries={["/any"]} />);
      expect(await screen.findByText("home")).toBeInTheDocument();
    });

    it("ページ遷移でも速攻", async () => {
      const Stub = mkStub();
      render(<Stub initialEntries={["/other"]} />);
      const user = userEvent.setup();
      await user.click(screen.getByRole("link"));
      expect(await screen.findByText("home")).toBeInTheDocument();
    });
  });

  describe("認証未済み", () => {
    it("User情報取得を試みてローディング", async () => {
      const Stub = mkStub();
      render(<Stub initialEntries={["/any"]} />);
      expect(await screen.findByText(/Loading.../)).toBeInTheDocument();
    });

    it("認証失敗でログインを促す", async () => {
      server.use(
        http.get("*/user/me", async () => {
          await delay(200);
          return new HttpResponse(null, { status: 401 });
        }),
      );
      const Stub = mkStub();
      render(<Stub initialEntries={["/any"]} />);
      expect(await screen.findByText(/Loading.../)).toBeInTheDocument();
      waitFor(() => {
        expect(screen.queryByText(/ログイン/i)).toBeInTheDocument();
      });
    });
  });
});
