import { v2 as cloudinary } from "cloudinary";
import type { ActionFunctionArgs } from "react-router"; // React Routerの型定義

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function signUpload({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    // biome-ignore lint/suspicious/noExplicitAny:
    const params = Object.fromEntries(formData) as Record<string, any>;
    if (!params.timestamp) {
      console.error("Missing timestamp parameter in upload request.");
      return new Response(
        JSON.stringify({ error: "Missing timestamp parameter." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    // public_id が指定されていれば、既存の画像を上書きするように設定
    // ウィジェットのpublicIdオプションは署名パラメータに自動で含まれる
    params.overwrite = true;

    // Cloudinary API Secret が環境変数に設定されているかを確認
    const apiSecret = cloudinary.config().api_secret;
    if (!apiSecret) {
      console.error(
        "CLOUDINARY_API_SECRET is not set in environment variables.",
      );
      return new Response(
        JSON.stringify({ error: "Server configuration error." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // パラメータとAPI Secretを使って安全な署名を生成
    const signature = cloudinary.utils.api_sign_request(params, apiSecret);

    // 生成した署名とタイムスタンプをJSON形式でクライアントに返す
    return new Response(
      JSON.stringify({
        signature: signature,
        timestamp: params.timestamp,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error signing Cloudinary upload:", error);
    // エラーが発生した場合は、ステータスコード500でエラーレスポンスを返す
    return new Response(
      JSON.stringify({ error: "Failed to sign upload request." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
