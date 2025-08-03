import { useEffect } from "react";
import { Navigate, redirect, useFetcher, useNavigate } from "react-router";
import GoogleIcon from "~/components/icons/Google";
import { Button } from "~/components/ui/button";
import {
  oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet,
  oauthGoogleCookieCallbackGoogleCookieCallbackGet,
} from "~/generated/google/google";
import type { Route } from ".react-router/types/app/routes/sso/google/+types/callback";

export async function authorize() {
  return await oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet(
    {},
    { credentials: "include" },
  );
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
  const fetcher = useFetcher();
  const res = fetcher.data;
  const navigate = useNavigate();
  useEffect(() => {
    if (!res) return;
    if (res.status === 200) {
      const { authorization_url } = res.data;
      navigate(authorization_url);
      return;
    }
    console.error("Google SSO authorization failed", { cause: res });
    navigate("/");
  }, [res, navigate]);

  const handleGoogleSignIn = () => {
    fetcher.submit({}, { method: "get", action: "/google/authorize" });
  };
  return (
    <>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
        <GoogleIcon className="mr-2 h-4 w-4" /> {title}
      </Button>
    </>
  );
}
