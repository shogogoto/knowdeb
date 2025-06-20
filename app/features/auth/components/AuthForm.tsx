import { type SubmissionResult, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Link } from "react-router";
import { Form, useNavigation } from "react-router";
import { z } from "zod";
import GoogleIcon from "~/components/icons/Google";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { registerRegisterAuthRegisterPostBody } from "~/generated/auth/auth.zod";
import useShowToggle from "~/hooks/useShowToggle";

export const authSchema = registerRegisterAuthRegisterPostBody
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
      .min(3, "パスワードは3文字以上で入力してください"),
  });

type Props = {
  lastResult: SubmissionResult<string[]> | undefined;
  title: string;
};

export default function AuthForm({ lastResult, title }: Props) {
  const { show, ShowToggleIcon } = useShowToggle();
  const navigation = useNavigation();
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: authSchema });
    },
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    constraint: getZodConstraint(authSchema),
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-[380px] shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Link to="/google/authorize">
              <Button variant="outline" className="w-full">
                <GoogleIcon className="mr-2 h-4 w-4" /> Googleで{title}
              </Button>
            </Link>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  または
                </span>
              </div>
            </div>
          </div>
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
              {navigation.state === "submitting" ? "送信中..." : "送信"}
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
