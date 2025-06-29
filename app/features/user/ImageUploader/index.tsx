import { useCallback, useEffect, useState } from "react";
import { useSubmit } from "react-router";
import { Button } from "~/components/ui/button";
import type {
  CloudinaryError,
  CloudinaryUploadResult,
  CloudinaryUploadWidget,
} from "~/features/user/types/cloudinary";

// Cloudinaryの環境変数
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
const FOLDER_NAME = "profile_images";

export default function ImageUploader() {
  // アップロードのステータスを管理するstate
  const [uploadStatus, setUploadStatus] = useState<string>("");
  // アップロードされた画像のURLを管理するstate
  const [imageUrl, setImageUrl] = useState<string>("");
  // Cloudinaryウィジェットインスタンスを管理するstate
  const [widget, setWidget] = useState<CloudinaryUploadWidget | null>(null);

  const submit = useSubmit();
  const initializeWidget = useCallback(() => {
    // Cloudinaryスクリプトがロードされているか確認
    if (!window.cloudinary) {
      console.error("Cloudinary widget script is not loaded.");
      return;
    }

    const widgetOptions = {
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET,
      folder: FOLDER_NAME,
      sources: ["local", "url", "camera"] as const,
      cropping: true,
      showSkipCropButton: false,
      croppingAspectRatio: 1,
      croppingShowDimensions: true,
      multiple: false,
      maxImageFileSize: 5000000, // 5MB
    };

    // Upload Widgetのインスタンスを生成
    const myWidget = window.cloudinary.createUploadWidget(
      widgetOptions,
      (error: CloudinaryError | null, result: CloudinaryUploadResult) => {
        // エラーがなく、イベントが成功した場合
        if (!error && result.event === "success" && result.info) {
          const uploadedImageUrl: string = result.info.secure_url;
          console.log("Upload success:", result.info);
          setUploadStatus("画像のアップロードが完了しました。");
          setImageUrl(uploadedImageUrl);

          // FormDataオブジェクトに画像URLを格納
          const formData = new FormData();
          formData.append("profile_image_url", uploadedImageUrl);

          // useSubmitを使ってactionにデータをPOST送信
          submit(formData, { method: "post" });
        } else if (error) {
          // アップロードでエラーが発生した場合
          setUploadStatus("アップロードに失敗しました。");
          console.error("Upload error:", error);
        }
      },
    );

    // ウィジェットインスタンスをstateに保存
    setWidget(myWidget);
  }, [submit]);

  /**
   * コンポーネントがマウントされたときにCloudinaryスクリプトをロード
   */
  useEffect(() => {
    // スクリプトをロードするヘルパー関数
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.body.appendChild(script);
      });
    };

    // Cloudinaryスクリプトがすでにロードされているか確認
    if (window.cloudinary) {
      initializeWidget();
    } else {
      // ロードされていない場合はスクリプトをロードし、成功後にウィジェットを初期化
      loadScript("https://upload-widget.cloudinary.com/latest/global/all.js")
        .then(() => initializeWidget())
        .catch((err) => console.error("Failed to load Cloudinary script", err));
    }
  }, [initializeWidget]); // initializeWidgetが変更されたら再実行

  /**
   * ウィジェットを開く関数
   */
  const openWidget = () => {
    if (widget) {
      widget.open();
    } else {
      console.warn("Cloudinary widget is not initialized yet.");
    }
  };

  return (
    <div>
      <h2>プロフィール画像のアップロードと加工</h2>
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
    </div>
  );
}
