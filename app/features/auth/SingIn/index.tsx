import { parseWithZod } from "@conform-to/zod";
import { type ActionFunctionArgs, redirect } from "react-router";
import { useActionData } from "react-router";
import { authCookieLoginAuthCookieLoginPost } from "~/generated/auth/auth";
import AuthForm, { authSchema } from "../components/AuthForm";

export async function UserSignInAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: authSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const res = await authCookieLoginAuthCookieLoginPost({
    username: submission.value.email,
    password: submission.value.password,
  });

  if (res.status !== 204) {
    console.log(res);
    return submission.reply({
      formErrors: [`ログインに失敗しました: ${res.data || "不明なエラー"}`],
    });
  }
  return redirect("/home");
}

export default function SignInForm() {
  const lastResult = useActionData<typeof UserSignInAction>();
  return <AuthForm lastResult={lastResult} title="ログイン" />;
}
