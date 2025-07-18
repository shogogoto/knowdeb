import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Link, useFetcher, useNavigation } from "react-router";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuth } from "~/features/auth/AuthProvider";
import { userProfileUserProfileUsernameGetResponse } from "~/generated/public-user/public-user.zod";
import { usersPatchCurrentUserUserMePatchResponseProfileMaxOne } from "~/generated/user/user.zod";
import UploadWidget from "../ImageUploader";
import { getTransformedImageUrl } from "../libs/image";
import { InputFormControl, TextareaFormControl } from "./controls";

export const UserProfileSchema = userProfileUserProfileUsernameGetResponse.pick(
  {
    display_name: true,
    profile: true,
    avatar_url: true,
    username: true,
    created: true,
    uid: true,
  },
);

type UserProfileFormType = z.infer<typeof UserProfileSchema>;

export default function UserProfileForm() {
  const { user, isAuthorized, isLoading } = useAuth();
  const fetcher = useFetcher();
  const lastSubmission = fetcher.data;
  const navigation = useNavigation();

  const [form, fields] = useForm<UserProfileFormType>({
    defaultValue: {
      username: user?.username,
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

  // useEffect(() => {
  //   if (lastSubmission?.message) {
  //     mutate();
  //   }
  // }, [lastSubmission, mutate]);

  const isSubmitting =
    navigation.state === "submitting" || fetcher.state === "submitting";

  const avatarDisplayUrl = getTransformedImageUrl(
    fields.avatar_url.value,
    128,
    128,
    "fill",
  );

  return (
    <div className="">
      <div className="p-6 bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-card-foreground">
          プロフィール編集
        </h2>

        {lastSubmission?.message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center">
            {lastSubmission.message}
          </div>
        )}

        <fetcher.Form
          method="post"
          {...getFormProps(form)}
          className="space-y-6 flex flex-col items-center"
        >
          <div className="flex flex-col items-center space-y-4">
            <Label className="block text-sm font-medium text-gray-700">
              プロフィール画像
            </Label>
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-border">
              {avatarDisplayUrl ? (
                <img
                  src={avatarDisplayUrl}
                  alt="プロフィール画像"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                  <span className="text-sm">画像なし</span>
                </div>
              )}
            </div>
            <UploadWidget
              publicId={user?.uid as string}
              onUploadSuccess={(imageUrl) => {
                if (user) {
                  form.update({ name: "avatar_url", value: imageUrl });
                }
              }}
            />
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
          <InputFormControl
            label="ユーザーID"
            field={fields.username}
            placeholder="ユーザーID"
          />
          <InputFormControl
            label="表示名"
            field={fields.display_name}
            placeholder="表示名を入力してください"
          />
          <TextareaFormControl
            label="プロフィール"
            field={fields.profile}
            placeholder="プロフィールを入力してください"
            rows={4}
            maxLength={usersPatchCurrentUserUserMePatchResponseProfileMaxOne}
          />
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
