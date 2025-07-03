import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useEffect } from "react";
import { Link, useFetcher, useNavigation } from "react-router";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input"; // Inputコンポーネントをimport
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea"; // Textareaコンポーネントをimport
import { useAuth } from "~/features/auth/AuthProvider";
import {
  usersPatchCurrentUserUserMePatchBody,
  usersPatchCurrentUserUserMePatchResponseProfileMaxOne,
} from "~/generated/user/user.zod";
import useCloudinaryUpload from "../ImageUploader/hooks";

export const UserProfileSchema = usersPatchCurrentUserUserMePatchBody.pick({
  display_name: true,
  profile: true,
  avatar_url: true,
});

type UserProfileFormType = z.infer<typeof UserProfileSchema>;

export default function UserProfileForm() {
  const {
    user,
    setUser,
    isAuthorized,
    isLoading: isUserLoading,
    mutate,
  } = useAuth();
  const fetcher = useFetcher();
  const lastSubmission = fetcher.data;
  const navigation = useNavigation();

  const [form, fields] = useForm<UserProfileFormType>({
    defaultValue: {
      display_name: user?.display_name,
      profile: user?.profile,
      avatar_url: user?.avatar_url,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UserProfileSchema });
    },
    lastResult: lastSubmission,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    constraint: getZodConstraint(UserProfileSchema),
  });
  const { openWidget, imageUrl, widget } = useCloudinaryUpload({
    publicId: user?.id as string,
    onUploadSuccess: (imageUrl) => {
      if (user) {
        setUser({ ...user, avatar_url: imageUrl });
        form.update({ name: "avatar_url", value: imageUrl });
      }
    },
  });

  // フォーム送信成功後、SWRのキャッシュを更新
  useEffect(() => {
    if (lastSubmission?.message) {
      mutate();
    }
  }, [lastSubmission, mutate]);

  const isSubmitting =
    navigation.state === "submitting" || fetcher.state === "submitting";

  if (isUserLoading || user === undefined) {
    return <div className="text-center p-4">ユーザー情報を読み込み中...</div>;
  }
  if (!isAuthorized) {
    return (
      <div className="text-center p-8 bg-card rounded-lg shadow-lg">
        <p className="text-destructive font-bold">認証されていません。</p>
        <p className="text-muted-foreground mt-2">
          ログインしてプロフィールを編集してください。
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="p-6 bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-card-foreground">
          プロフィール編集
        </h2>

        {/* 成功メッセージの表示 */}
        {lastSubmission?.message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center">
            {lastSubmission.message}
          </div>
        )}

        {/* Conformのフォームコンポーネント */}
        <fetcher.Form
          method="post"
          {...getFormProps(form)}
          className="space-y-6 flex flex-col items-center"
        >
          {/* プロフィール画像のセクション */}
          <div className="flex flex-col items-center space-y-4">
            <Label className="block text-sm font-medium text-gray-700">
              プロフィール画像
            </Label>
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-border">
              {fields.avatar_url.value ? (
                <img
                  src={fields.avatar_url.value as string}
                  alt="プロフィール画像"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                  <span className="text-sm">画像なし</span>
                </div>
              )}
            </div>
            <Button onClick={openWidget} disabled={!widget}>
              画像アップロード
            </Button>
            <Input
              {...getInputProps(fields.avatar_url, { type: "hidden" })}
              name={fields.avatar_url.name}
              defaultValue={fields.avatar_url.initialValue}
            />
            <Button
              type="button"
              variant="ghost"
              className="text-destructive hover:text-destructive-foreground"
              onClick={() => form.update({ name: "avatar_url", value: "" })}
            >
              画像を削除
            </Button>
          </div>

          {/* 表示名フィールド */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor={fields.display_name.id}>表示名</Label>
            <Input
              {...getInputProps(fields.display_name, { type: "text" })}
              placeholder="表示名を入力してください"
            />
            {fields.display_name.errors && (
              <span className="text-destructive text-sm mt-1">
                {fields.display_name.errors}
              </span>
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor={fields.profile.id}>プロフィール</Label>
            <Textarea
              {...getInputProps(fields.profile, { type: "text" })}
              rows={4}
              placeholder="プロフィールを入力してください"
            />
            {fields.profile.errors && (
              <span className="text-destructive text-sm mt-1">
                {fields.profile.errors}
              </span>
            )}
            <div className="text-right text-sm text-gray-500">
              {fields.profile.value?.length || 0} /{" "}
              {usersPatchCurrentUserUserMePatchResponseProfileMaxOne}
            </div>
          </div>

          <div className="flex flex-col w-full max-w-sm gap-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "更新中..." : "更新"}
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/home">ホームに戻る</Link>
            </Button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
