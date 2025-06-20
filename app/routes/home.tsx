import { useCookies } from "react-cookie";
import { useSSORedirect } from "~/features/auth/hooks";
import { usersCurrentUserUserMeGet } from "~/generated/user/user";
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

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const res = await usersCurrentUserUserMeGet({ credentials: "include" });
  return { res };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  useSSORedirect();

  console.log(loaderData);

  const [cookies] = useCookies();
  // cookies オブジェクトを扱いやすい配列形式に変換
  const allCookies = Object.entries(cookies).map(([name, value]) => ({
    name: name,
    value: String(value),
  }));
  return (
    <>
      <div>{loaderData.res.status}</div>
      <div>
        <h2 className="text-4xl font-bold mb-4">現在のブラウザCookie一覧</h2>
        {allCookies.length === 0 ? (
          <p>現在設定されているCookieはありません。</p>
        ) : (
          <ul>
            {allCookies.map((cookie) => (
              <li key={cookie.name}>
                <strong>{cookie.name}:</strong> {cookie.value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
