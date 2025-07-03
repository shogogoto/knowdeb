import { useSubmit } from "react-router";
import { Button } from "~/components/ui/button";
import useCloudinaryUpload from "./hooks";

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

type Props = {
  publicId: string;
  onUploadWith?: (imageUrl: string) => void;
};

export default function ImageUploader({ publicId, onUploadWith }: Props) {
  const submit = useSubmit();
  const { openWidget, imageUrl, widget } = useCloudinaryUpload({
    publicId,
    onUploadSuccess: (uploadedImageUrl) => {
      const formData = new FormData();
      formData.append("profile_image_url", uploadedImageUrl);
      onUploadWith?.(uploadedImageUrl);
      // submit(formData, { method: "post" });
    },
  });
  return (
    <Button onClick={openWidget} disabled={!widget}>
      画像をアップロード
      {imageUrl}
    </Button>
  );
}
