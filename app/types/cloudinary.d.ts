// src/types/cloudinary.d.ts
// Cloudinary Upload Widget のグローバルな型定義
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: CloudinaryUploadWidgetOptions,
        callback: (
          error: CloudinaryError | null,
          result: CloudinaryUploadResult,
        ) => void,
      ) => CloudinaryUploadWidget;
    };
  }
}

// Upload Widget の設定オプションの型
export interface CloudinaryUploadWidgetOptions {
  cloudName: string;
  uploadPreset: string;
  folder?: string;
  sources?: (
    | "local"
    | "url"
    | "camera"
    | "dropbox"
    | "google_drive"
    | "image_search"
  )[];
  cropping?: boolean;
  showSkipCropButton?: boolean;
  croppingAspectRatio?: number;
  croppingShowDimensions?: boolean;
  multiple?: boolean;
  maxImageFileSize?: number;
  // 他のオプションも必要に応じて追加
}

// アップロード結果の型
export interface CloudinaryUploadResult {
  event:
    | "success"
    | "close"
    | "public_id"
    | "tags"
    | "context"
    | "log"
    | "open"
    | "source_changed"
    | "batch_uploaded"
    | "queue_changed";
  info?: {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    resource_type: "image" | "video" | "raw";
    bytes: number;
    // [key: string]: any; // その他のプロパティ
  };
  // event 'close' の場合は info がない場合がある
}

// エラーオブジェクトの型
export interface CloudinaryError {
  message: string;
  status: number;
  // [key: string]: any; // その他のプロパティ
}

// ウィジェットインスタンスの型
export interface CloudinaryUploadWidget {
  open: () => void;
  close: () => void;
  update: (options: CloudinaryUploadWidgetOptions) => void;
  show: () => void;
}
