import { v2 as cloudinary } from "cloudinary";
import type { ActionFunctionArgs } from "react-router";

// Cloudinaryの設定を初期化
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // HTTPSを使用
});

export async function deleteImage({ request }: ActionFunctionArgs) {
  if (request.method !== "DELETE" && request.method !== "POST") {
    return Response.json({ message: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const publicId = formData.get("publicId"); // クライアントから送られてくるpublicId

    if (!publicId || typeof publicId !== "string") {
      return Response.json(
        { message: "Public ID is required." },
        { status: 400 },
      );
    }

    // Cloudinaryから画像を削除
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return Response.json({ message: "Image deleted successfully." });
    }
    if (result.result === "not found") {
      return Response.json(
        { message: "Image not found on Cloudinary." },
        { status: 404 },
      );
    }
    console.error("Cloudinary deletion error:", result);
    return Response.json(
      { message: "Failed to delete image from Cloudinary." },
      { status: 500 },
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return Response.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
