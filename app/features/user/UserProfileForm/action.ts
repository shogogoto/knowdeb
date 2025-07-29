import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "react-router";
import type { UserUpdate } from "~/generated/fastAPI.schemas";
import { usersPatchCurrentUserUserMePatch } from "~/generated/user/user"; // orvalが生成したAPIクライアント
import { UserProfileSchema } from ".";

export async function editUserProfile({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: UserProfileSchema });
  if (submission.status !== "success") {
    return Response.json({ submission: submission.reply() });
  }

  const userUpdate: UserUpdate = {
    display_name: submission.value.display_name,
    profile: submission.value.profile,
    username: submission.value.username,
    avatar_url: submission.value.avatar_url,
  };

  const res = await usersPatchCurrentUserUserMePatch(userUpdate, {
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
