import { jwtVerify } from "jose";
import type { UserRead } from "~/generated/fastAPI.schemas";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

type UserJWTPayload = Pick<UserRead, "uid" | "username" | "display_name">;

// 認証済みのリクエスト以外は弾く server action 用
export default async function getAuth(
  request: Request,
): Promise<UserRead | null> {
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is not defined in environment variables.");
  }
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((c) => c.trim().split("=").map(decodeURIComponent)),
  );

  const token = cookies.access_token;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<UserJWTPayload>(token, secret);

    // 検証成功後、ペイロードからユーザー情報を構築して返す
    // ここではペイロードがUserReadと互換性があると仮定しています
    // 必要に応じて、ペイロードからUserRead型に変換する処理を追加してください
    return payload as unknown as UserRead;
  } catch (err) {
    // トークンが無効な場合（署名が違う、期限切れなど）
    console.error("JWT Verification failed:", err);
    return null;
  }
}
