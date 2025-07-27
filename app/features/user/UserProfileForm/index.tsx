import {
  type SubmissionResult,
  getFormProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useEffect } from "react";
import { Link, useFetcher, useNavigation } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/features/auth/AuthProvider";
import type { UserRead } from "~/generated/fastAPI.schemas";
import {
  userProfileUserProfileUsernameGetResponse,
  userProfileUserProfileUsernameGetResponseDisplayNameMaxOne,
} from "~/generated/public-user/public-user.zod";
import { usersPatchCurrentUserUserMePatchResponseProfileMaxOne } from "~/generated/user/user.zod";
import { InputFormControl, TextareaFormControl } from "./controls";

const MAX_DN = userProfileUserProfileUsernameGetResponseDisplayNameMaxOne;
export const UserProfileSchema = userProfileUserProfileUsernameGetResponse
  .pick({
    display_name: true,
    profile: true,
    username: true,
  })
  .extend({
    display_name: z.string().max(MAX_DN, `${MAX_DN}文字以下で入力してください`),
  });

type UserProfileFormType = z.infer<typeof UserProfileSchema>;

type FetcherData = {
  submission: SubmissionResult<string[]>;
  message?: string;
  user?: UserRead;
};

export default function UserProfileForm() {
  const { user, mutate } = useAuth();
  const fetcher = useFetcher<FetcherData>();
  const lastSubmission = fetcher.data;
  const navigation = useNavigation();

  const [form, fields] = useForm<UserProfileFormType>({
    id: user?.uid, // userの読み込み途中では全てundefinedで初期化されるのを防ぐ
    defaultValue: {
      username: user?.username,
      display_name: user?.display_name,
      profile: user?.profile,
    },
    lastResult: lastSubmission?.submission,
    constraint: getZodConstraint(UserProfileSchema), // HTML5としても制約する
    onValidate({ formData }) {
      console.log({ formData });
      return parseWithZod(formData, { schema: UserProfileSchema });
    },
  });

  useEffect(() => {
    if (lastSubmission?.user) {
      const { user } = lastSubmission;
      mutate(
        { data: user, status: 200, headers: new Headers() },
        { revalidate: false },
      );
    }
  }, [lastSubmission, mutate]);

  const isSubmitting =
    navigation.state === "submitting" || fetcher.state === "submitting";
  return (
    <div className="p-6 bg-card rounded-lg shadow-lg">
      <fetcher.Form
        action="/user/edit"
        method="patch"
        {...getFormProps(form)}
        className="space-y-6 flex flex-col items-center"
      >
        <InputFormControl
          label="ユーザー名"
          field={fields.username}
          placeholder="ユーザー名"
          disabled={isSubmitting}
        />
        <InputFormControl
          label="表示名"
          field={fields.display_name}
          placeholder="表示名を入力してください"
          disabled={isSubmitting}
        />
        <TextareaFormControl
          label="プロフィール"
          field={fields.profile}
          placeholder="プロフィールを入力してください"
          rows={4}
          maxLength={usersPatchCurrentUserUserMePatchResponseProfileMaxOne}
          disabled={isSubmitting}
        />
        <div className="flex flex-col w-full max-w-sm gap-2">
          <Button type="submit" className="w-full">
            {isSubmitting ? "更新中..." : "更新"}
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/home">ホームに戻る</Link>
          </Button>
          <div className="text-sm text-red-500">{form.errors?.[0]}</div>
        </div>
      </fetcher.Form>
      {lastSubmission?.message && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center">
          {lastSubmission.message}
        </div>
      )}
    </div>
  );
}
