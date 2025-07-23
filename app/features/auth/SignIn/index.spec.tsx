import { render, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { RouterProvider, createMemoryRouter } from "react-router";
import { getAuthMock } from "~/generated/auth/auth.msw";
import { getGoogleMock } from "~/generated/google/google.msw";
import { getUserMock } from "~/generated/user/user.msw";
import SignInForm from ".";
import { AuthProvider } from "../AuthProvider";
import * as AuthMock from "../AuthProvider";

const server = setupServer(
  ...getGoogleMock(),
  ...getUserMock(),
  ...getAuthMock(),
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const routesFixture = [
  {
    path: "/login",
    // Component: () => <Navigate to="/home" />,
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
    // expect(router.state.location.pathname).toBe("/home");
  });
});
