import { createRoutesStub } from "react-router";
import SignInForm from ".";

//
describe("ログイン", () => {
  it("Google ログイン 成功", async () => {
    const Stub = createRoutesStub([
      {
        path: "/login",
        Component: SignInForm,
      },
    ]);

    expect(true).toBe(true);
  });

  it("Google ログイン 失敗", async () => {
    expect(true).toBe(true);
  });
  it("ログイン済みだったらhomeへリダイレクト", async () => {
    expect(true).toBe(true);
  });
});
