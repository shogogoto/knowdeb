import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { RouterProvider, createMemoryRouter } from "react-router";
import { getAuthMock } from "~/generated/auth/auth.msw";
import { getGoogleMock } from "~/generated/google/google.msw";
import { getUserMock } from "~/generated/user/user.msw";
import SignInForm, { UserSignInAction } from ".";
import { AuthProvider } from "../AuthProvider";
import * as AuthMock from "../AuthProvider";

const server = setupServer(
  ...getGoogleMock(),
  ...getUserMock(),
  ...getAuthMock(),
);
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

const routesFixture = [
  {
    path: "/login",
    action: UserSignInAction,
    Component: () => (
      <AuthProvider>
        <SignInForm />
      </AuthProvider>
    ),
  },
  {
    path: "/home",
    Component: () => <div>home</div>,
  },
  {
    path: "/",
    Component: () => <div>root</div>,
  },
];

describe("ログイン", () => {
  it("ログイン済みはhomeへリダイレクト", async () => {
    // @ts-ignore
    vi.spyOn(AuthMock, "useAuth").mockReturnValue({ isAuthorized: true });
    const router = createMemoryRouter(routesFixture, {
      initialEntries: ["/login"],
    });
    render(<RouterProvider router={router} />);
    await screen.findByText("home");
    expect(router.state.location.pathname).toBe("/home");
  });

  // it("送信中にフォームがdisable", async () => {
  //   const router = createMemoryRouter(routesFixture, {
  //     initialEntries: ["/login"],
  //   });
  //   render(<RouterProvider router={router} />);
  // });

  it("ログイン成功でhomeにリダイレクト", async () => {
    const router = createMemoryRouter(routesFixture, {
      initialEntries: ["/login"],
    });
    render(<RouterProvider router={router} />);
    expect(router.state.location.pathname).toBe("/login");

    const user = userEvent.setup();
    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const submitButton = screen.getByRole("button", { name: "送信" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");

    await user.click(submitButton);
    expect(
      screen.getByRole("button", { name: "送信中..." }),
    ).toBeInTheDocument();
    // 送信中はdisable
    expect(
      screen.getByRole("button", { name: "送信中..." }),
    ).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();

    await screen.findByText("home"); // homeへのリダイレクトを待つ
    expect(router.state.location.pathname).toBe("/home");
  });

  describe("フォームバリデーション", () => {
    it("入力ないところを赤文字で注意", async () => {});
    it("入力不備でエラー表示", async () => {});
  });
});
