import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { Navigate, createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router";
import {
  getGoogleMock,
  getOauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetMockHandler,
} from "~/generated/google/google.msw";
import { GoogleAuthButton, authorize } from "./google";

const server = setupServer(...getGoogleMock());
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function stubFixture(fakeGoogleAuthUrl: string, title: string) {
  return createMemoryRouter(
    [
      {
        path: "/login",
        Component: () => <GoogleAuthButton title={title} />,
      },
      {
        path: "/google/authorize",
        loader: authorize,
        Component: () => <div>dummy</div>,
      },
      {
        path: fakeGoogleAuthUrl,
        Component: () => <Navigate to="/google/callback" />,
      },
      {
        path: "/google/callback",
        Component: () => <div>fake</div>,
      },
      {
        path: "/home",
        Component: () => <div>home</div>,
      },
      {
        path: "/",
        Component: () => <div>root</div>,
      },
    ],
    { initialEntries: ["/login"] },
  );
}

describe("Google SSO", () => {
  it("authorize成功", async () => {
    const fakeGoogleAuthUrl = "/fake-google-auth-page";
    server.use(
      getOauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetMockHandler({
        authorization_url: fakeGoogleAuthUrl,
      }),
    );
    const title = "Google ログイン";
    const user = userEvent.setup();
    // const Stub = createRoutesStub(
    const Stub = stubFixture(fakeGoogleAuthUrl, title);
    // render(<Stub initialEntries={["/login"]} />);
    render(<RouterProvider router={Stub} />);
    const link = await screen.findByText(title);
    expect(link).toBeInTheDocument();
    screen.debug();
    await user.click(link); // 認証ボタン押して画面遷移
    // クリック後にawaitしないとrespons返らない
    // expect(await screen.findByText("fake")).not.toBeInTheDocument();
    // screen.debug();
  });

  // it("Google ログイン 失敗", async () => {
  //   expect(true).toBe(true);
  // });
  it("authorize失敗で / へリダイレクト", async () => {
    server.use(
      http.get("*/google/cookie/authorize", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    const title = "Google ログイン";
    const Stub = stubFixture("/fake-google-auth-page", title);
    render(<RouterProvider router={Stub} />);
    await userEvent.click(await screen.findByText(title));
    expect(
      await screen.findByText("Google SSO authorization failed"),
    ).toBeInTheDocument();
  });
});
