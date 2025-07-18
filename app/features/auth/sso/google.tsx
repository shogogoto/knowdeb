import { Navigate, redirect } from "react-router";
import {
  oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet,
  oauthGoogleCookieCallbackGoogleCookieCallbackGet,
} from "~/generated/google/google";
import AuthGuard from "../AuthGuard";
import { useAuth } from "../AuthProvider";
import type { Route } from ".react-router/types/app/routes/sso/google/+types/callback";

export async function authorize({ request }: Route.ClientLoaderArgs) {
  const res = await oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet(
    {},
    {
      credentials: "include",
    },
  );
  if (res.status === 200) {
    console.log(res.data.authorization_url);
    return redirect(res.data.authorization_url);
  }
  console.error("Google SSO failed:", res.data.detail);
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
  if (res?.status === 200) {
    return redirect("/home");
  }
  console.error("Google SSO failed:", res.data.detail);
  return redirect("/");
}

// clientLoaderのためにあるだけで表示されることはなさそう
export default function GoogleCallback({ loaderData }: Route.ComponentProps) {
  // const { is } = loaderData;
  const { isAuthorized } = useAuth();

  if (isAuthorized) {
    return <Navigate to="/home" />;
  }
  return <AuthGuard />;
}
