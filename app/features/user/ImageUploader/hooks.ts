import { useCallback, useEffect, useState } from "react";

import type {
  CloudinaryUploadWidget,
  CloudinaryUploadWidgetError,
  CloudinaryUploadWidgetOptions,
  CloudinaryUploadWidgetResults,
} from "@cloudinary-util/types";

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: CloudinaryUploadWidgetOptions,
        callback: (
          error: CloudinaryUploadWidgetError | null,
          result: CloudinaryUploadWidgetResults,
        ) => void,
      ) => CloudinaryUploadWidget;
    };
  }
}

const CLOUDINARY_UPLOAD_URL =
  "https://upload-widget.cloudinary.com/latest/global/all.js";

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET as string;
const FOLDER_NAME = "avatar";

type Props = {
  publicId: string;
  onUploadSuccess: (imageUrl: string) => void;
};

export function useCloudinaryUpload({ onUploadSuccess, publicId }: Props) {
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [widget, setWidget] = useState<CloudinaryUploadWidget | null>(null);

  const initializeWidget = useCallback(() => {
    if (!window.cloudinary) {
      console.error("Cloudinary widget script is not loaded.");
      return;
    }

    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        folder: FOLDER_NAME,
        sources: [
          "local",
          "url",
          "camera",
          "image_search",
          "google_drive",
          "facebook",
          "instagram",
          "dropbox",
        ],
        cropping: true,
        showSkipCropButton: false,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,
        maxImageFileSize: 5000000, // 5MB
        publicId,
        // biome-ignore lint/suspicious/noExplicitAny:
        uploadSignature: async (callback: any, params_to_sign: any) => {
          try {
            // サーバーサイドの署名APIを呼び出す
            console.log("Fetching upload signature:", params_to_sign);
            const response = await fetch("/api/cloudinary-sign-upload", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(params_to_sign),
            });

            if (!response.ok) {
              throw new Error("Failed to fetch upload signature");
            }

            const { signature, timestamp } = await response.json();
            callback(null, { signature, timestamp });
          } catch (error) {
            console.error("Error fetching upload signature:", error);
            callback(error, null);
          }
        },
      },
      (error, result) => {
        if (
          !error &&
          result.event === "success" &&
          result.info &&
          typeof result.info === "object" &&
          "secure_url" in result.info
        ) {
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
  }, [onUploadSuccess, publicId]);

  useEffect(() => {
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
    // ウィジェットが既に存在する場合は何もしない
    if (widget) return;

    if (window.cloudinary) {
      initializeWidget();
    } else {
      loadScript(CLOUDINARY_UPLOAD_URL)
        .then(() => initializeWidget())
        .catch((err) => console.error("Failed to load Cloudinary script", err));
    }
  }, [initializeWidget, widget]); // widgetを依存配列に追加

  const openWidget = () => {
    if (widget) {
      widget.open();
    } else {
      console.warn("Cloudinary widget is not initialized yet.");
    }
  };

  return { openWidget, uploadStatus, imageUrl, widget };
}
