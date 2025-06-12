import {
  authJwtLoginAuthJwtLoginPost,
  registerRegisterAuthRegisterPost,
} from "~/generated/auth/auth";

describe("try-auth-orval", () => {
  it("test", async () => {
    const email = "test1@test.com";
    const password = "test";
    const res1 = await registerRegisterAuthRegisterPost({ email, password });
    // console.log(res1.data);
    console.log(res1.status);
    // {
    //   id: 'cd1db89f-f88b-4b60-b47f-12e262e01169',
    //   email: 'test@test.com',
    //   is_active: true,
    //   is_superuser: false,
    //   is_verified: false,
    //   display_name: null
    // }
    // 201
    //
    //
    //
    //
    //
    //

    const body = {
      username: email,
      password: password,
      // grant_type, scope, client_id, client_secret は必要に応じて設定
      grant_type: "password", // 通常、JWTログインでは 'password' を指定
      scope: "",
      client_id: null,
      client_secret: null,
    };

    const response = await authJwtLoginAuthJwtLoginPost(body);

    if (response.status === 200) {
      console.log("ログイン成功:", response.data);
      // ここでログイン後の処理（例: トークンを保存、ユーザーをリダイレクト）
    } else {
      console.error("ログイン失敗:");
      // エラー処理
    }

    const res = await authJwtLoginAuthJwtLoginPost(
      {
        grant_type: "password",
        username: email,
        password: password,
        scope: "",
        client_id: "string",
        client_secret: "string",
      }, // 最初の引数は不要な場合が多い
    );
    console.log(res.status);
    // res.status;
    // console.log(res.data);
    expect(1).toBe(1);
  });
});
