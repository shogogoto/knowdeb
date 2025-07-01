import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/features/auth/AuthProvider";
import { uploadImage } from "~/features/user/ImageUploader";
import type { Route } from "./+types/home";

// export function meta({}: Route.MetaArgs) {
export function meta() {
  return [
    { title: "Knowde" },
    {
      name: "description",
      content: "Welcome to Knowde - Your Knowledge Search Platform",
    },
  ];
}

export const clientAction = uploadImage;

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user, isLoading, isValidating } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">ユーザー情報を読み込み中...</div>
      </div>
    );
  }
  return (
    <>
      <Link to="/login">
        <h1>ホーム</h1>
      </Link>
      <div>{isValidating}</div>
      <div className={isLoading ? "loading" : "hidden"}>aaa</div>
      <div>{user?.id as string}</div>
      <div>{user?.email}</div>
      <div>{user?.display_name}</div>
      <div>{user?.profile}</div>
      <Button>
        <Link to="/user/edit">プロフ編集</Link>
      </Button>
    </>
  );
}
