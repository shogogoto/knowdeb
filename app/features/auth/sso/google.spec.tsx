import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { createRoutesStub } from "react-router";
import {
  getGoogleMock,
  getOauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetMockHandler,
} from "~/generated/google/google.msw";
import { GoogleAuthButton, authorize } from "./google";

const server = setupServer(...getGoogleMock());
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Google SSO", () => {
  it("Google authorize成功", async () => {
    const fakeGoogleAuthUrl = "/fake-google-auth-page";
    server.use(
      getOauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetMockHandler({
        authorization_url: fakeGoogleAuthUrl,
      }),
    );
    const title = "Google ログイン";
    const user = userEvent.setup();
    const Stub = createRoutesStub([
      {
        path: "/login",
        Component: () => <GoogleAuthButton title={title} />,
      },
      {
        path: "/google/authorize",
        loader: authorize,
      },
      {
        path: fakeGoogleAuthUrl,
        // Component: () => <Navigate to="/google/callback" />,
        Component: () => <div>fake</div>,
      },
      {
        path: "/google/callback",
        Component: () => <div>fake</div>,
      },
    ]);

    render(<Stub initialEntries={["/login"]} />);
    const tgt = await screen.findByText(title);
    expect(tgt).toBeInTheDocument();

    await user.click(await screen.findByText(title));
    // クリック後にawaitしないとrespons返らない
    expect(await screen.findByText("fake")).toBeInTheDocument();
  });

  // it("Google ログイン 失敗", async () => {
  //   expect(true).toBe(true);
  // });
  // it("authorize loaderはAPIエラー時にルートへリダイレクトする", async () => {
  //   server.use(
  //     http.get("*/google/cookie/authorize", () => {
  //       return new HttpResponse(null, { status: 500 });
  //     }),
  //   );
  //
  //   const Stub = createRoutesStub([
  //     {
  //       path: "/login",
  //       Component: () => <GoogleAuthButton title="Google ログイン" />,
  //     },
  //     {
  //       path: "/google/authorize",
  //       loader: authorize,
  //     },
  //     {
  //       path: "/",
  //       Component: () => <div>Home Page</div>,
  //     },
  //   ]);
  //
  //   render(<Stub initialEntries={["/login"]} />);
  //   await userEvent.click(await screen.findByText("Google ログイン"));
  //
  //   expect(await screen.findByText("Home Page")).toBeInTheDocument();
  // });
});
