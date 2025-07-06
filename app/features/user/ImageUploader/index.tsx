import UploadWidget from "./UploadWidget";

export async function uploadImage({ request }: { request: Request }) {
  const formData = await request.formData();
  const profileImageUrl = formData.get("profile_image_url");

  if (typeof profileImageUrl === "string") {
    console.log(
      "Received profile image URL from clientAction:",
      profileImageUrl,
    );
    return { success: true, message: "プロフィール画像が更新されました。" };
  }
  return { success: false, message: "画像のURLが見つかりませんでした。" };
}

export default UploadWidget;
