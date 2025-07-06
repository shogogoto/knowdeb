import type { CloudinaryUploadWidget } from "@cloudinary-util/types";
import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";

export default function CloudinaryUploadWidget2({ uwConfig, setPublicId }) {
  const uploadWidgetRef = useRef<CloudinaryUploadWidget | null>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const initializeUploadWidget = () => {
      if (window.cloudinary && uploadButtonRef.current) {
        // Create upload widget
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          uwConfig,
          (error, result) => {
            if (!error && result && result.event === "success") {
              console.log("Upload successful:", result.info);
              setPublicId(result.info.public_id);
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
  }, [uwConfig, setPublicId]);

  return (
    <Button
      ref={uploadButtonRef}
      id="upload_widget"
      className="cloudinary-button"
    >
      Upload
    </Button>
  );
}
