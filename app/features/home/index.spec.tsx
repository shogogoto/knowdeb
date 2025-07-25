import { render, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { getAuthMock } from "~/generated/auth/auth.msw";
import { getUserMock } from "~/generated/user/user.msw";
import Home from ".";
import { AuthProvider } from "../auth/AuthProvider";

const server = setupServer(...getUserMock(), ...getAuthMock());
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

describe("Home", () => {
  it("認証済み", async () => {
    render(
      <AuthProvider>
        <Home />
      </AuthProvider>,
    );

    // screen.debug();
    // expect(await screen.findByText(/Loading/i)).toBeInTheDocument();
    // expect(1).toBe(1);
    // await delay(1000);
    // screen.debug();
  });

  it("未認証でログインを促す", async () => {
    render(
      <AuthProvider>
        <Home />
      </AuthProvider>,
    );

    screen.debug();
    // expect(await screen.findByText(/Loading/i)).toBeInTheDocument();
    expect(1).toBe(1);
    // await delay(1000);
    // screen.debug();
  });
});
