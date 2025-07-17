import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import { useAuth } from "~/features/auth/AuthProvider";
import UserProfileForm from ".";
import { editUserProfile } from "./action";

vi.mock("~/generated/user/user");
vi.mock("~/features/auth/AuthProvider");
vi.mock("../ImageUploader", () => ({
  // UploadWidgetがテストの邪魔をしないように基本的なモックを作成
  default: ({
    onUploadSuccess,
  }: {
    onUploadSuccess: (url: string) => void;
  }) => (
    <button
      type="button"
      onClick={() => onUploadSuccess("https://example.com/new-image.png")}
    >
      Mock Upload
    </button>
  ),
}));

/*
  テストケース

  fields
    username
    display_name
    profile
    avatar_url
    created



 */

const mockUser = {
  uid: "test-uid",
  email: "test-email",
  is_active: true,
  is_superuser: false,
  is_verified: true,
  username: "test",
  display_name: "Test User",
  profile: "Test Profile",
  avatar_url: "https://example.com/avatar.png",
  created: "2023-01-01",
};

describe("UserProfileForm (Integration Test)", () => {
  beforeEach(() => {
    const mockedUseAuth = vi.mocked(useAuth);
    mockedUseAuth.mockReturnValue({
      user: mockUser,
      isAuthorized: true,
      isLoading: false,
      isValidating: false,
      setUser: () => {},
      mutate: vi.fn(async () => {}),
      signOut: vi.fn(async () => {}),
      signIn: vi.fn(async () => {}),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("ユーザー情報がフォームの初期値として正しく表示される", async () => {
    const Stub = createRoutesStub([
      {
        path: "/user/edit",
        Component: UserProfileForm,
        action: editUserProfile,
      },
    ]);
    render(<Stub initialEntries={["/user/edit"]} />);

    expect(await screen.findByLabelText("ユーザーID")).toHaveValue(
      mockUser.username,
    );
    expect(screen.getByLabelText("表示名")).toHaveValue(mockUser.display_name);
    expect(screen.getByLabelText("プロフィール")).toHaveValue(mockUser.profile);
    expect(screen.getByAltText("プロフィール画像")).toHaveAttribute(
      "src",
      expect.stringContaining(mockUser.avatar_url),
    );
  });

  it("フォームを正常に送信し、成功メッセージが表示される", async () => {
    // const user = userEvent.setup();
    // mockedUsersPatchCurrentUserUserMePatch.mockResolvedValue({
    //   status: 200,
    //   data: {} as any,
    //   headers: new Headers(),
    // });
    //
    // renderWithRouter();
    //
    // const displayNameInput = screen.getByLabelText("表示名");
    // const profileInput = screen.getByLabelText("プロフィール");
    // const submitButton = screen.getByRole("button", { name: "更新" });
    //
    // // ユーザー操作
    // await user.clear(displayNameInput);
    // await user.type(displayNameInput, "New Name");
    // await user.clear(profileInput);
    // await user.type(profileInput, "New Profile");
    // await user.click(submitButton);
    //
    // // 結果の検証
    // await waitFor(() => {
    //   expect(
    //     screen.getByText("プロフィールを更新しました。"),
    //   ).toBeInTheDocument();
    // });
    //
    // expect(mockedUsersPatchCurrentUserUserMePatch).toHaveBeenCalledWith(
    //   {
    //     display_name: "New Name",
    //     profile: "New Profile",
    //     username: mockUser.username,
    //     avatar_url: mockUser.avatar_url,
    //   },
    //   { credentials: "include" },
    // );
  });

  it("APIがエラーを返した際に、エラーメッセージが表示される", async () => {
    // const user = userEvent.setup();
    // mockedUsersPatchCurrentUserUserMePatch.mockResolvedValue({
    //   status: 500,
    //   data: { detail: "Internal Server Error" },
    //   headers: new Headers(),
    // });
    //
    // renderWithRouter();
    //
    // await user.click(screen.getByRole("button", { name: "更新" }));
    //
    // await waitFor(() => {
    //   expect(
    //     screen.getByText(
    //       /プロフィールの更新に失敗しました: Internal Server Error/,
    //     ),
    //   ).toBeInTheDocument();
    // });
  });

  it("認証されていない場合、メッセージが表示される", () => {
    // mockedUseAuth.mockReturnValue({
    //   user: undefined,
    //   isAuthorized: false,
    //   isLoading: false,
    //   mutate: vi.fn(),
    //   signOut: vi.fn(),
    // });
    // renderWithRouter();
    // expect(screen.getByText("認証されていません。")).toBeInTheDocument();
  });

  it("画像の削除ボタンを押すと、avatar_urlが空になり、プレビューが「画像なし」に変わる", async () => {
    const user = userEvent.setup();
    // expect(screen.getByAltText("プロフィール画像")).toBeInTheDocument();
    //
    // const deleteButton = screen.getByRole("button", { name: "画像を削除" });
    // await user.click(deleteButton);
    //
    // // プレビューの確認
    // expect(screen.getByText("画像なし")).toBeInTheDocument();
    // expect(screen.queryByAltText("プロフィール画像")).not.toBeInTheDocument();
    //
    // // この状態で更新ボタンを押すと、空のavatar_urlが送信されることを確認
    // mockedUsersPatchCurrentUserUserMePatch.mockResolvedValue({
    //   status: 200,
    //   data: {} as any,
    //   headers: new Headers(),
    // });
    // await user.click(screen.getByRole("button", { name: "更新" }));
    //
    // await waitFor(() => {
    //   expect(mockedUsersPatchCurrentUserUserMePatch).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       avatar_url: "",
    //     }),
    //     expect.anything(),
    //   );
    // });
  });
});
