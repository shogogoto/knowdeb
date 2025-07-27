import { Link, Navigate, redirect } from "react-router";
import GoogleIcon from "~/components/icons/Google";
import { Button } from "~/components/ui/button";
import {
  oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet,
  oauthGoogleCookieCallbackGoogleCookieCallbackGet,
} from "~/generated/google/google";
import type { Route } from ".react-router/types/app/routes/sso/google/+types/callback";

export async function authorize() {
  const res = await oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet(
    {},
    { credentials: "include" },
  );
  if (res.status === 200) {
    return redirect(res.data.authorization_url);
  }
  console.error("Google SSO authorization failed", { cause: res });
  return redirect("/");
}

export async function receiveCookie({ request }: Route.ClientLoaderArgs) {
  const urlParams = new URLSearchParams(new URL(request.url).search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const res = await oauthGoogleCookieCallbackGoogleCookieCallbackGet(
    { state, code },
    { credentials: "include" },
  );
  // @ts-ignore なぜか 200が期待されてる
  if (res?.status === 204) {
    return redirect("/home");
  }
  console.error("Google SSO callback failed:", res.status);
  return redirect("/");
}

// clientLoaderのためにあるだけで表示されることはなさそう
export default function GoogleCallback() {
  return <Navigate to="/home" />;
}

export function GoogleAuthButton({ title }: { title: string }) {
  return (
    <Button variant="outline" className="w-full" asChild>
      <Link to="/google/authorize">
        <GoogleIcon className="mr-2 h-4 w-4" /> {title}
      </Link>
    </Button>
  );
}
