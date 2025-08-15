// server ations
import { v2 as cloudinary } from "cloudinary";
import type { ActionFunctionArgs } from "react-router";
import type { UserRead } from "~/shared/generated/fastAPI.schemas";

cloudinary.config({
  cloud_name: process.env.VITE_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: process.env.NODE_ENV === "production",
});

export const CLOUD_FOLDER = process.env.VITE_CLOUD_FOLDER || "avatar";

export async function listImages() {
  const res = await cloudinary.api.resources({
    type: "upload",
    prefix: CLOUD_FOLDER,
  });
  console.log({ res: JSON.stringify(res) });
  return res;
}

export async function uploadImage(
  user: Pick<UserRead, "uid" | "username" | "display_name">,
) {
  const res = await cloudinary.uploader.upload("./public/favicon.svg", {
    resource_type: "image",
    public_id: user.uid, // userのuidを設定する
    display_name: user.display_name || user.username || user.uid, // userのdisplay_name
    folder: CLOUD_FOLDER,
    unique_filename: false, // default:true では末尾にランダム文字を追加して一意にする
    overwrite: true,
    // notification_url: "https://xxx", // cloudinaryで設定されたwebhookを上書きできる
    // tags: ["tag1", "tag2"], 画像のグルーピング
  });
  // console.log({ res: JSON.stringify(res) });
  return res;
}

export async function deleteImage({ request }: ActionFunctionArgs) {
  // coockie で認証できればいいな
  const formData = await request.formData();
  const publicId = formData.get("public_id") as string;
  const res = await cloudinary.uploader.destroy(`${CLOUD_FOLDER}/${publicId}`, {
    resource_type: "image",
    invalidate: false,
  });
  // console.log({ res: JSON.stringify(res) });
  return res;
}

// ------------------------------------------------------------------------------
// widget overrwrite upload に必要
export default async function signUpload({ request }: ActionFunctionArgs) {
  const apiSecret = cloudinary.config().api_secret;
  if (!apiSecret) {
    console.error("CLOUDINARY_API_SECRET is not set in environment variables.");
    return new Response(
      JSON.stringify({ error: "Server configuration error." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const formData = await request.formData();
  const params = Object.fromEntries(formData) as Record<string, unknown>;
  if (!params.timestamp) {
    console.error("Missing timestamp parameter in upload request.");
    return {
      error: "Missing timestamp parameter.",
      status: 400,
      headers: { "Content-Type": "application/json" },
    };
  }
  // params.overwrite = true;
  const signature = cloudinary.utils.api_sign_request(params, apiSecret);

  return { signature };
}
