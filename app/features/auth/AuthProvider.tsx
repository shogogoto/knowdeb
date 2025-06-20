import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
  useAuthJwtLoginAuthJwtLoginPost,
  useAuthJwtLogoutAuthJwtLogoutPost,
  useRegisterRegisterAuthRegisterPost,
} from "~/generated/auth/auth";
import type { UserRead } from "~/generated/fastAPI.schemas"; // Adjust path
import { useUsersCurrentUserUserMeGet } from "~/generated/user/user";
import { AuthContext } from "./AuthContext";

const TOKEN_COOKIE_NAME = "jwt_token";

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [cookies, setCookie, removeCookie] = useCookies([TOKEN_COOKIE_NAME]);
  const [token, setToken] = useState<string | null>(cookies[TOKEN_COOKIE_NAME]);
  const [user, setUser] = useState<UserRead | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null); // エラー状態を追加

  const { trigger: loginTrigger } = useAuthJwtLoginAuthJwtLoginPost();
  const { trigger: logoutTrigger } = useAuthJwtLogoutAuthJwtLogoutPost();
  const { trigger: registerTrigger } = useRegisterRegisterAuthRegisterPost();

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
    isValidating: userValidating, // データ取得中かどうかをより正確に判断するために追加
  } = useUsersCurrentUserUserMeGet({
    swr: {
      enabled: !!token, // トークンが存在する場合のみフェッチ
      revalidateOnFocus: false, // ウィンドウフォーカス時に再検証しない
      // エラー発生時の再試行を無効にするか、回数を制限することを検討
      // retry: false,
    },
    fetch: {
      headers: {
        // HttpOnlyクッキーを使用している場合、ブラウザが自動的にクッキーを送信するため、
        // ここでAuthorizationヘッダーを手動で設定する必要がない場合があります。
        // バックエンドがクッキーからJWTを読み取るように設定されているか確認してください。
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  });

  // token ステートが変更された際にクッキーに反映させる
  useEffect(() => {
    if (token) {
      setCookie(TOKEN_COOKIE_NAME, token, {
        path: "/", // cookie を全てのパスで有効にする
        maxAge: 3600 * 24 * 7, //sec (1週間)
        secure: process.env.NODE_ENV === "production", // HTTPSでのみ送信
        httpOnly: true, // JavaScript からのアクセスを禁止
        // もしtrueにする場合、クライアントサイドのJSからはこのクッキーを直接読み取れません。
        // その場合は、`setToken(response.data.access_token)` のみが `token` ステートを更新する方法になります。
        // ここでは HttpOnly を false にしておきますが、実際のアプリケーションではサーバー側で HttpOnly を設定するべきです。
      });
    } else {
      removeCookie(TOKEN_COOKIE_NAME, { path: "/" });
    }
  }, [token, setCookie, removeCookie]);

  // ユーザーデータと認証状態の更新ロジック
  useEffect(() => {
    if (token) {
      if (userData?.data) {
        setUser(userData.data);
        setAuthError(null); // エラーをクリア
      } else if (userError) {
        // トークンが無効または期限切れの可能性、クリアする
        console.error("Failed to fetch user or token invalid:", userError);
        setToken(null); // tokenをnullにしてクッキーも削除させる
        setUser(null);
        setAuthError(
          "認証情報の取得に失敗しました。再度ログインしてください。",
        );
      }
    } else {
      // トークンがない場合はユーザーとエラーをクリア
      setUser(null);
      setAuthError(null);
    }
    // userLoadingだけでなく、userValidatingも考慮してローディング状態を管理
    setIsLoading(userLoading || (!!token && userValidating));
  }, [token, userData, userError, userLoading, userValidating]);

  const signIn = useCallback(
    async (username: string, password: string) => {
      try {
        const response = await loginTrigger({ username, password });
        if (response.status === 200) {
          setToken(response.data.access_token);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      }
    },
    [loginTrigger],
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await registerTrigger({ email, password });
        return response.status === 201;
      } catch (error) {
        console.error("Registration failed:", error);
        return false;
      }
    },
    [registerTrigger],
  );

  const signOut = useCallback(async () => {
    try {
      await logoutTrigger();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_COOKIE_NAME);
    }
  }, [logoutTrigger]);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
