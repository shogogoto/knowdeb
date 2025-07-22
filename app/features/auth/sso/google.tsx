import { Link, Navigate, redirect } from "react-router";
import GoogleIcon from "~/components/icons/Google";
import { Button } from "~/components/ui/button";
import {
  oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet,
  oauthGoogleCookieCallbackGoogleCookieCallbackGet,
} from "~/generated/google/google";
import { useAuth } from "../AuthProvider";
import type { Route } from ".react-router/types/app/routes/sso/google/+types/callback";

export async function authorize() {
  const res = await oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet(
    {},
    { credentials: "include" },
  );
  if (res.status === 200) {
    return redirect(res.data.authorization_url);
  }
  throw new Error("Google SSO authorization failed");
}

export async function receiveCookie({ request }: Route.ClientLoaderArgs) {
  const urlParams = new URLSearchParams(new URL(request.url).search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const res = await oauthGoogleCookieCallbackGoogleCookieCallbackGet(
    { state, code },
    { credentials: "include" },
  );
  if (res?.status === 200) {
    return redirect("/home");
  }
  console.error("Google SSO failed:", res.data.detail);
  return redirect("/");
}

// clientLoaderのためにあるだけで表示されることはなさそう
export default function GoogleCallback({ loaderData }: Route.ComponentProps) {
  const { isAuthorized } = useAuth();

  if (isAuthorized) {
    return <Navigate to="/home" />;
  }
  return <div />;
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
