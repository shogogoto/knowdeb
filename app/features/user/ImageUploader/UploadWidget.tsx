import type {
  CloudinaryUploadWidget,
  CloudinaryUploadWidgetError,
  CloudinaryUploadWidgetOptions,
  CloudinaryUploadWidgetResults,
} from "@cloudinary-util/types";
import type { KeyboardEvent, ReactElement } from "react";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

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

const uwConfig: CloudinaryUploadWidgetOptions = {
  cloudName: import.meta.env.VITE_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_UPLOAD_PRESET,
  folder: "avatar",
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
  theme: "minimal",
  showAdvancedOptions: true,
  // multiple: false,
  // tags: ['users', 'profile'],
  // context: { alt: 'user_uploaded' },
  clientAllowedFormats: ["jpeg", "jpg", "png", "gif", "webp", "svg", "bmp"],
  cropping: true,
  // showSkipCropButton: false,
  croppingShowBackButton: true,
  croppingShowDimensions: true,
  croppingValidateDimensions: true,
  autoMinimize: true,
  // maxImageFileSize: 5000000, // 5MB
  // maxImageWidth: 2000,
  //
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  // biome-ignore lint/suspicious/noExplicitAny:
  uploadSignature: async (callback: any, params_to_sign: any) => {
    // CloudinaryのUpload設定で signed, overwrite 有効にしたら上書きできた
    const formData = new FormData();
    for (const key in params_to_sign) {
      formData.append(key, params_to_sign[key]);
    }
    const res = await fetch("/user/signUpload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to fetch upload signature");
    }

    const { signature } = await res.json();
    callback(signature);
  },
};

type Props = {
  children: ReactElement;
  publicId: string;
  onUploadSuccess: (imageUrl: string) => void;
};

export default function UploadWidget({
  children,
  publicId,
  onUploadSuccess,
}: Props) {
  const widgetRef = useRef<CloudinaryUploadWidget | null>(null);
  const openWidget = useCallback(() => {
    widgetRef.current?.open();
  }, []);

  useEffect(() => {
    if (window.cloudinary && !widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        { ...uwConfig, publicId },
        (error, result) => {
          if (!error && result?.event === "success") {
            const uploadedImageUrl = (result.info as { secure_url: string })
              .secure_url;
            onUploadSuccess(uploadedImageUrl);
          } else if (error) {
            console.error("Upload failed:", error);
            toast.error("画像のアッフロートに失敗しました");
          }
        },
      );
    }
  }, [publicId, onUploadSuccess]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openWidget();
    }
  };

  return (
    <div
      onClick={openWidget}
      onKeyDown={handleKeyDown}
      id="upload_widget"
      className="cursor-pointer"
    >
      {children}
    </div>
  );
}
