import { useCallback, useEffect, useState } from "react";
import type {
  CloudinaryError,
  CloudinaryUploadResult,
  CloudinaryUploadWidget,
} from "../types/cloudinary";

const CLOUDINARY_UPLOAD_URL =
  "https://upload-widget.cloudinary.com/latest/global/all.js";

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
const FOLDER_NAME = "profile_images";

type OnUploadSuccess = (imageUrl: string) => void;

export const useCloudinaryUpload = (onUploadSuccess?: OnUploadSuccess) => {
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [widget, setWidget] = useState<CloudinaryUploadWidget | null>(null);

  const initializeWidget = useCallback(() => {
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

    const myWidget = window.cloudinary.createUploadWidget(
      widgetOptions,
      (error: CloudinaryError | null, result: CloudinaryUploadResult) => {
        if (!error && result.event === "success" && result.info) {
          const uploadedImageUrl: string = result.info.secure_url;
          console.log("Upload success:", result.info);
          setUploadStatus("画像のアップロードが完了しました。");
          setImageUrl(uploadedImageUrl);

          if (onUploadSuccess) {
            onUploadSuccess(uploadedImageUrl);
          }
        } else if (error) {
          setUploadStatus("アップロードに失敗しました。");
          console.error("Upload error:", error);
        }
      },
    );

    setWidget(myWidget);
  }, [onUploadSuccess]);

  /**
   * Cloudinaryスクリプトのロードとウィジェットの初期化、そしてクリーンアップ
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

    // ウィジェットがすでに初期化されているか、スクリプトがロードされているか確認
    if (widget) {
      // ウィジェットが既に存在する場合は何もしない
      return;
    }

    if (window.cloudinary) {
      initializeWidget();
    } else {
      loadScript(CLOUDINARY_UPLOAD_URL)
        .then(() => initializeWidget())
        .catch((err) => console.error("Failed to load Cloudinary script", err));
    }

    return () => {
      if (widget && typeof widget.close === "function") {
        widget.close();
        //setWidget(null); // stateをリセットして参照を解放
        console.log("Cloudinary widget has been closed and cleaned up.");
      }
    };
    // ----- ここまで -----
  }, [initializeWidget, widget]); // widgetを依存配列に追加

  const openWidget = () => {
    if (widget) {
      widget.open();
    } else {
      console.warn("Cloudinary widget is not initialized yet.");
    }
  };

  return { openWidget, uploadStatus, imageUrl, widget };
};
