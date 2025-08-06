import { useNavigate } from "react-router";
import { UAParser } from "ua-parser-js";
import { oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet } from "~/generated/google/google";

export function shouldOpenExternal() {
  const inApp = ["Line"]; // 外部ブラウザで開きたい
  const parser = new UAParser(navigator.userAgent);
  const browser = parser.getBrowser();
  return inApp.includes(browser.name as string);
}

// アプリ内ブラウザだとgoogle認証が403エラーになるので、外部ブラウザで開く
export function navigateExternal(authorization_url: string) {
  const parser = new UAParser(navigator.userAgent);
  const os = parser.getOS().name;
  switch (os) {
    case "Android": {
      const url = new URL(authorization_url);
      const urlWithoutScheme = authorization_url.substring(url.protocol.length);
      const fallbackUrl = `S.browser_fallback_url=${encodeURIComponent(
        authorization_url,
      )}`;
      const intentUrl = `intent:${urlWithoutScheme}#Intent;scheme=https;action=android.intent.action.VIEW;${fallbackUrl};end`;
      location.href = intentUrl;
      break;
    }
    case "iOS":
      alert(
        "アプリ内ブラウザではGoogle認証ができない場合があるので外部ブラウザで開こうと試みます。",
      );
      window.open(authorization_url, "_blank");
      break;
    default:
      location.href = authorization_url;
      break;
  }
}

export function useHandleGoogleSSOExternal() {
  const navigate = useNavigate();
  async function handleGoogleSSO() {
    const res = await oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet(
      {},
      { credentials: "include" },
    );
    if (res.status === 200) {
      const { authorization_url } = res.data;
      navigateExternal(authorization_url);
      return;
    }
    console.error("Google SSO authorization failed", { cause: res });
    navigate("/");
  }

  return { handleGoogleSSO };
}
