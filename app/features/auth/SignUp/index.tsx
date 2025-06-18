import { useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  type ActionFunctionArgs,
  Form,
  redirect,
  useNavigation,
} from "react-router";
import { useActionData } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { registerRegisterAuthRegisterPost } from "~/generated/auth/auth";
import { registerRegisterAuthRegisterPostBody } from "~/generated/auth/auth.zod";
import useShowToggle from "~/hooks/useShowToggle";

const schema = registerRegisterAuthRegisterPostBody
  .pick({
    email: true,
    password: true,
  })
  .extend({
    email: z
      .string({ required_error: "メールアドレスは必須です" })
      .email("有効なメールアドレスを入力してください")
      .min(1, "メールアドレスは必須です"),
    password: z
      .string({ required_error: "パスワードは必須です" })
      .min(3, "パスワードは6文字以上で入力してください"),
  });

export async function UserRegisterAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  console.log(formData);
  const submission = parseWithZod(formData, { schema });

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
  const { show, ShowToggleIcon } = useShowToggle();
  const navigation = useNavigation();
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    constraint: getZodConstraint(schema),
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-[380px] shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">ユーザー新規作成</CardTitle>
          <CardDescription>
            メールアドレスとパスワードを入力してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            {...form}
            method="post"
            className="space-y-4"
            aria-invalid={form.errors ? true : undefined}
            aria-describedby={form.errors ? form.errorId : undefined}
          >
            <div className="grid gap-2">
              <Label htmlFor={fields.email.id}>メールアドレス</Label>
              <Input
                name={fields.email.name}
                id={fields.email.id}
                placeholder="user@example.com"
                type="email"
              />
              <div
                className="h-5 text-sm text-red-500"
                id={fields.email.errorId}
              >
                {fields.email.errors?.[0]}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={fields.password.id}>パスワード</Label>
              <div className="relative flex items-center">
                <Input
                  name={fields.password.name}
                  id={fields.password.id}
                  type={show ? "text" : "password"}
                />
                {ShowToggleIcon}
              </div>
              <div
                className="h-5 text-sm text-red-500"
                id={fields.password.errorId}
              >
                {fields.password.errors?.[0]}
              </div>
            </div>
            <Button type="submit" className="w-full">
              {navigation.state === "submitting" ? "送信中..." : "登録"}
            </Button>
            <div className="text-sm text-red-500" id={fields.password.errorId}>
              {form.errors?.[0]}
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
