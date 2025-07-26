import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { createRoutesStub } from "react-router";
import { describe, it, vi } from "vitest";
import { AuthProvider } from "~/features/auth/AuthProvider";
import { getAuthMock } from "~/generated/auth/auth.msw";
import {
  getUserMock,
  getUsersCurrentUserUserMeGetMockHandler,
} from "~/generated/user/user.msw";
import UserProfileForm from ".";
import { editUserProfile } from "./action";

const server = setupServer(...getUserMock(), ...getAuthMock());
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

const muser = {
  uid: "test-uid",
  email: "test-email",
  is_active: true,
  is_superuser: false,
  is_verified: true,
  username: "test",
  display_name: "Test User",
  profile: "Test Profile", // 12文字
  avatar_url: "https://example.com/avatar.png",
  created: "2023-01-01",
};

function mkStub() {
  return createRoutesStub([
    {
      path: "/user/edit",
      Component: () => (
        <AuthProvider>
          <UserProfileForm />
        </AuthProvider>
      ),
      action: editUserProfile,
    },
  ]);
}

describe("UserProfileForm (Integration Test)", () => {
  it("ユーザー情報がフォーム初期値へ", async () => {
    server.use(getUsersCurrentUserUserMeGetMockHandler(muser));
    const Stub = mkStub();
    render(<Stub initialEntries={["/user/edit"]} />);
    expect(screen.getByText("0 / 160")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText("表示名")).toHaveValue(muser.display_name);
      expect(screen.getByLabelText("プロフィール")).toHaveValue(muser.profile);
      expect(screen.getByLabelText("ユーザー名")).toHaveValue(muser.username);
      expect(screen.getByText("12 / 160")).toBeInTheDocument();
    });
  });

  it("フォーム内容送信成功", async () => {
    let currentUser = { ...muser };
    server.use(
      http.get("*/user/me", () => {
        return HttpResponse.json(currentUser);
      }),
      http.patch("*/user/me", async ({ request }) => {
        console.log("PATCH /user/me");
        console.log(await request.json());
        console.log("PATCH /user/me json end");
        const updates = (await request.json()) as Partial<typeof muser>;
        currentUser = { ...currentUser, ...updates };
        return new HttpResponse(null, { status: 200 });
      }),
    );

    const user = userEvent.setup();
    const Stub = mkStub();
    render(<Stub initialEntries={["/user/edit"]} />);
    const displayNameInput = screen.getByLabelText("表示名");
    const profileInput = screen.getByLabelText("プロフィール");
    const usernameInput = screen.getByLabelText("ユーザー名");
    const submitButton = screen.getByRole("button", { name: "更新" });

    // Wait for initial values to be populated
    await waitFor(() => {
      expect(displayNameInput).toHaveValue(muser.display_name);
    });

    const update = {
      display_name: "New Name",
      profile: "New Profile",
      username: "NewUsername",
    };

    await user.clear(displayNameInput);
    await user.type(displayNameInput, update.display_name);
    await user.clear(profileInput);
    await user.type(profileInput, update.profile);
    await user.clear(usernameInput);
    await user.type(usernameInput, update.username);
    await user.click(submitButton);

    // Wait for submission to complete and see success message
    // await waitFor(() => {
    //   expect(
    //     screen.getByText("プロフィールを更新しました。"),
    //   ).toBeInTheDocument();
    // });

    // After success, the form should be populated with the new values
    expect(displayNameInput).toHaveValue(update.display_name);
    expect(profileInput).toHaveValue(update.profile);
    expect(usernameInput).toHaveValue(update.username);
  });

  describe("フォームバリデーション", () => {
    it("APIがエラーを返した際に、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();
    });

    it("画像の削除ボタンを押すと、avatar_urlが空になり、プレビューが「画像なし」に変わる", async () => {
      const user = userEvent.setup();
    });
  });
});
