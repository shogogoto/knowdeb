import { redirect } from "react-router";
import { oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet } from "~/generated/google/google";

// googleにログインの画面を開く
export async function loader() {
  const res = await oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet();
  if (res.status === 200) {
    // console.log("成功！Google ログインURL:", res.data.authorization_url);
    return redirect(res.data.authorization_url);
  }
  return redirect("/");
}
