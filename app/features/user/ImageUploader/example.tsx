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
  theme: "purple",
  showAdvancedOptions: true,
  // multiple: false,
  // tags: ['users', 'profile'],
  // context: { alt: 'user_uploaded' },
  clientAllowedFormats: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
  ],
  cropping: true,
  // showSkipCropButton: false,
  // croppingAspectRatio: 1,
  // croppingShowBackButton: true,
  // croppingShowDimensions: true,
  // maxImageFileSize: 5000000, // 5MB
  // maxImageWidth: 2000,
};

type Props = {
  publicId: string;
  onUploadSuccess: (imageUrl: string) => void;
};

export default function CloudinaryUploadWidget2({
  publicId,
  onUploadSuccess,
}: Props) {
  const uploadWidgetRef = useRef<CloudinaryUploadWidget | null>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const initializeUploadWidget = () => {
      if (window.cloudinary && uploadButtonRef.current) {
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          { ...uwConfig, publicId },
          (error, result) => {
            if (!error && result && result.event === "success") {
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
