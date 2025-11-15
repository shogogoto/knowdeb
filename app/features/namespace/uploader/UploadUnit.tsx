import { useCallback, useEffect, useState } from "react";
import { Progress } from "~/shared/components/ui/progress";
import { usePostFilesResourcePost } from "~/shared/generated/entry/entry";

type Props = {
  file: File;
  isUploading: boolean;
  onSuccess: () => void;
  onComplete: () => void;
};

// Uploaderで選択された１ファイルから生成されるコンポーネント
export default function UploadUnit({
  file,
  isUploading,
  onSuccess,
  onComplete,
}: Props) {
  const { data, trigger, isMutating, error } = usePostFilesResourcePost({
    fetch: { credentials: "include" },
  });
  const [progress, setProgress] = useState(0);

  const handleUpload = useCallback(async () => {
    try {
      // const result = await trigger({ files: [file] });
      const result = await trigger({ files: [file] });
      if (result && result.status >= 200 && result.status < 300) {
        onSuccess();
      }
    } catch (e) {
      console.error(e);
    } finally {
      onComplete();
    }
  }, [file, trigger, onSuccess, onComplete]);

  useEffect(() => {
    if (isUploading) {
      handleUpload();
    }
  }, [isUploading, handleUpload]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isMutating) {
      setProgress(0); // Reset progress on new upload
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isMutating]);

  useEffect(() => {
    if (data) {
      setProgress(100);
    }
  }, [data]);

  const showProgress = isMutating || (data && !error);

  // ここで triggerの結果、成功、失敗、エラー内容などを表示したい
  //   元は isMutatingなどで処理中である場合にそれを示す
  return (
    <div className="p-1">
      <p className="truncate">{file.name}</p>
      {showProgress && <Progress value={progress} className="w-full h-1" />}
      {error && (
        <p className="text-sm text-red-500">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
      )}
      {data && !error && !isMutating && (
        <p className="text-sm text-green-500">✓ Upload successful</p>
      )}
    </div>
  );
}
