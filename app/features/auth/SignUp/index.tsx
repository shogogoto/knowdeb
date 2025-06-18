import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
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
import useShowToggle from "~/hooks/useShowToggle";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const signUp = useSignUp(); // useSignUpフックを使用
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    // console.log("hello");
    // const success = await signU(email, password);
    // if (success) {
    //   alert("Registration successful! You can now log in.");
    //   navigate("/login"); // 成功後にログインページへリダイレクト
    // } else {
    //   alert("Registration failed. Please try again.");
    // }
  };
  const { show, ShowToggleIcon } = useShowToggle();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">アカウントを作成</CardTitle>
          <CardDescription>
            メールアドレスとパスワードを入力してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form method="post" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">パスワード</Label>
              <div className="relative flex items-center">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {ShowToggleIcon}
              </div>
            </div>
            <Button type="submit" className="w-full">
              登録
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
