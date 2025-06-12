import { authJwtLoginAuthJwtLoginPost } from "~/generated/auth/auth";

describe("orval gen", async () => {
  const email = "test@test.com";
  const password = "test";
  // const res = await registerRegisterAuthRegisterPost({ email, password });
  // {
  //   id: 'cd1db89f-f88b-4b60-b47f-12e262e01169',
  //   email: 'test@test.com',
  //   is_active: true,
  //   is_superuser: false,
  //   is_verified: false,
  //   display_name: null
  // }
  // 201

  const res = await authJwtLoginAuthJwtLoginPost({ username: email, password });
  console.log(res.data);
  console.log(res.status);
  // expect(1).toBe(2);
});
