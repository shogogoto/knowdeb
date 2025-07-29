import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "react-router";
import { usersPatchCurrentUserUserMePatch } from "~/generated/user/user"; // orvalが生成したAPIクライアント
import { UserProfileSchema } from ".";

export async function editUserProfile({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: UserProfileSchema });
  if (submission.status !== "success") {
    return Response.json({ submission: submission.reply() });
  }

  const cvt = Object.fromEntries(
    Object.entries(submission.value).map(([k, v]) => {
      // if (k === "username") return [k, v]; // usernameは空にできない
      return [k, v === undefined ? "" : v];
    }),
  );

  const res = await usersPatchCurrentUserUserMePatch(cvt, {
    credentials: "include",
  });
  if (res.status !== 200) {
    return Response.json({
      submission: submission.reply({
        formErrors: [
          `プロフィールの更新に失敗しました: ${JSON.stringify(res.data) || "不明なエラー"}`,
        ],
      }),
    });
  }
  return Response.json({
    submission: submission.reply(),
    message: "プロフィールを更新しました。",
    user: res.data,
  });
}
