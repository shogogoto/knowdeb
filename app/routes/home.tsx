import { useEffect } from "react";
import { useAuth } from "~/features/auth/AuthProvider";
import { useSSORedirect } from "~/features/auth/hooks";
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

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user, isLoading, isValidating, mutate } = useAuth();

  useSSORedirect();
  useEffect(() => {
    mutate();
  }, [mutate]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">ユーザー情報を読み込み中...</div>
      </div>
    );
  }
  return (
    <>
      <div>{isValidating}</div>
      <div className={isLoading ? "loading" : "hidden"}>aaa</div>
      <div>{user?.id}</div>
      <div>{user?.email}</div>
      <div>{user?.display_name}</div>
    </>
  );
}
