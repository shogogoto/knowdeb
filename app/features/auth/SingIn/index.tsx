import { parseWithZod } from "@conform-to/zod";
import { useEffect } from "react";
import type { ActionFunctionArgs } from "react-router";
import { useActionData, useNavigate } from "react-router";
import { Navigate } from "react-router";
import { authCookieLoginAuthCookieLoginPost } from "~/generated/auth/auth";
import { useAuth } from "../AuthProvider";
import AuthForm, { authSchema } from "../components/AuthForm";

export async function signInAction(username: string, password: string) {
  const res = await authCookieLoginAuthCookieLoginPost(
    {
      username: username,
      password: password,
    },
    { credentials: "include" },
  );
  console.log(res);
  return res;
}

export async function UserSignInAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: authSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const res = await signInAction(
    submission.value.email,
    submission.value.password,
  );
  if (res.status !== 204) {
    return submission.reply({
      formErrors: [`ログインに失敗しました: ${res.data || "不明なエラー"}`],
    });
  }
}

export default function SignInForm() {
  const lastResult = useActionData<typeof UserSignInAction>();
  const { isAuthorized } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(lastResult);
    if (isAuthorized) {
      navigate("/home");
    }
  }, [isAuthorized, navigate, lastResult]);

  if (isAuthorized) {
    return <Navigate to="/home" />;
  }

  return <AuthForm lastResult={lastResult} title="ログイン" />;
}
