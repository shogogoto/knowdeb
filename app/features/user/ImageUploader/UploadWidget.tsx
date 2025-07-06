import type {
  CloudinaryUploadWidget,
  CloudinaryUploadWidgetError,
  CloudinaryUploadWidgetOptions,
  CloudinaryUploadWidgetResults,
} from "@cloudinary-util/types";
import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";

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

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET as string;

const uwConfig: CloudinaryUploadWidgetOptions = {
  cloudName: CLOUD_NAME,
  uploadPreset: UPLOAD_PRESET,
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
  // maxImageFileSize: 5000000, // 5MB
  // maxImageWidth: 2000,
  //// biome-ignore lint/suspicious/noExplicitAny:
  //   uploadSignature: async (callback: any, params_to_sign: any) => {
  //     try {
  //       // サーバーサイドの署名APIを呼び出す
  //       console.log("Fetching upload signature:", params_to_sign);
  //       const response = await fetch("/api/cloudinary-sign-upload", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(params_to_sign),
  //       });
  //
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch upload signature");
  //       }
  //
  //       const { signature, timestamp } = await response.json();
  //       callback(null, { signature, timestamp });
  //     } catch (error) {
  //       console.error("Error fetching upload signature:", error);
  //       callback(error, null);
  //     }
  //   },
};

type Props = {
  publicId: string;
  onUploadSuccess: (imageUrl: string) => void;
};

export default function UploadWidget({ publicId, onUploadSuccess }: Props) {
  const uploadWidgetRef = useRef<CloudinaryUploadWidget | null>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const initializeUploadWidget = () => {
      if (window.cloudinary && uploadButtonRef.current) {
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          { ...uwConfig, publicId },
          (error, result) => {
            if (!error && result && result.event === "success") {
              // @ts-ignore
              const uploadedImageUrl = result.info.secure_url;
              onUploadSuccess(uploadedImageUrl);
              console.log("Upload successful:", result.info);
            } else if (error) {
              console.error("アップロードに失敗しました。:", error);
            }
          },
        );

        const handleUploadClick = () => {
          if (uploadWidgetRef.current) {
            uploadWidgetRef.current.open();
          }
        };

        const buttonElement = uploadButtonRef.current;
        buttonElement.addEventListener("click", handleUploadClick);

        return () => {
          buttonElement.removeEventListener("click", handleUploadClick);
        };
      }
    };

    initializeUploadWidget();
  }, [publicId, onUploadSuccess]);

  return (
    <Button ref={uploadButtonRef} id="upload_widget">
      Upload
    </Button>
  );
}
