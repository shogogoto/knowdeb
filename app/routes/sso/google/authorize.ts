import { redirect } from "react-router";
import { oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet } from "~/generated/google/google";

export async function clientLoader() {
  const res = await oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet();
  if (res.status === 200) {
    return redirect(res.data.authorization_url);
  }
  console.error("Google SSO failed:", res.data.detail);
  return redirect("/");
}
