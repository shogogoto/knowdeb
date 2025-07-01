import { parseWithZod } from "@conform-to/zod";
import { type ActionFunctionArgs, redirect } from "react-router";
import { usersPatchCurrentUserUserMePatch } from "~/generated/user/user"; // orvalが生成したAPIクライアント
import { UserProfileSchema } from ".";

export async function editUserProfile({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: UserProfileSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const res = await usersPatchCurrentUserUserMePatch(submission.value, {
    credentials: "include",
  });
  if (res.status !== 200) {
    return submission.reply({
      formErrors: [
        `プロフィールの更新に失敗しました: ${res.data || "不明なエラー"}`,
      ],
    });
  }
  return redirect("/home");
}
