import type {
  CloudinaryUploadWidget,
  CloudinaryUploadWidgetError,
  CloudinaryUploadWidgetOptions,
  CloudinaryUploadWidgetResults,
} from "@cloudinary-util/types";
import { useEffect, useRef, useState } from "react";
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

    const res2 = await res.json();
    callback(res2.signature);
  },
};

type Props = {
  children: React.ReactNode;
  publicId: string;
  onUploadSuccess: (imageUrl: string) => void;
};

export default function UploadWidget({
  children,
  publicId,
  onUploadSuccess,
}: Props) {
  const uploadWidgetRef = useRef<CloudinaryUploadWidget | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isScriptLoaded && window.cloudinary) {
      uploadWidgetRef.current = window.cloudinary.createUploadWidget(
        { ...uwConfig, publicId },
        (error, result) => {
          if (!error && result && result.event === "success") {
            // @ts-ignore
            const uploadedImageUrl = result.info.secure_url;
            onUploadSuccess(uploadedImageUrl);
          } else if (error) {
            console.error("アップロードに失敗しました。:", error);
          }
        },
      );
    }
  }, [isScriptLoaded, publicId, onUploadSuccess]);

  const handleUploadClick = () => {
    if (uploadWidgetRef.current) {
      uploadWidgetRef.current.open();
    }
  };

  return (
    <Button onClick={handleUploadClick} id="upload_widget" asChild>
      {children}
    </Button>
  );
}
