import { parseWithZod } from "@conform-to/zod";
import { type ActionFunctionArgs, redirect } from "react-router";
import { useActionData } from "react-router";
import { registerRegisterAuthRegisterPost } from "~/generated/auth/auth";
import AuthForm, { authSchema } from "../components/AuthForm";

export async function UserRegisterAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: authSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const res = await registerRegisterAuthRegisterPost(submission.value);

  if (res.status !== 201) {
    return submission.reply({
      formErrors: [`登録に失敗しました: ${res.data.detail || "不明なエラー"}`],
    });
  }
  return redirect("/home");
}

export default function SignUpForm() {
  const lastResult = useActionData<typeof UserRegisterAction>();
  return <AuthForm lastResult={lastResult} title="ユーザー登録" />;
}
