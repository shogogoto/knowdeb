import { useSubmit } from "react-router";
import { Button } from "~/components/ui/button";
import { useCloudinaryUpload } from "./hooks";

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

export default function ImageUploader() {
  const submit = useSubmit();
  const { openWidget, uploadStatus, imageUrl, widget } = useCloudinaryUpload(
    (uploadedImageUrl) => {
      const formData = new FormData();
      formData.append("profile_image_url", uploadedImageUrl);
      submit(formData, { method: "post" });
    },
  );
  return (
    <>
      <Button onClick={openWidget} disabled={!widget}>
        画像を選択・加工してアップロード
      </Button>
      <p>{uploadStatus}</p>
      {imageUrl && (
        <div>
          <p>アップロードされた画像のプレビュー:</p>
          <img
            src={imageUrl.replace(
              "/upload/",
              "/upload/w_200,h_200,c_fill,g_face/",
            )}
            alt="Profile"
            style={{ borderRadius: "50%" }}
          />
          <p>画像のURL: {imageUrl}</p>
        </div>
      )}
    </>
  );
}
