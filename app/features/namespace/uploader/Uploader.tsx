import { useState } from "react";
import { Button } from "~/shared/components/ui/button";
import { Progress } from "~/shared/components/ui/progress";
import AcceptExtensions from "./AcceptExtensions";
import CustomFileUploader from "./CustomFileUploader";
import UploadUnit from "./UploadUnit";

export default function Uploader() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const [exts, setExts] = useState<string[]>([".txt", ".md", ".kn"]);

  function handleSuccess() {
    setSuccessCount((prev) => prev + 1);
  }

  function handleComplete() {
    if (!files) return;
    const completedIndex = uploadingIndex ?? -1;
    const completedCount = completedIndex + 1;
    setProgress((completedCount / files.length) * 100);

    const nextIndex = completedIndex + 1;
    if (nextIndex < files.length) {
      setUploadingIndex(nextIndex);
    } else {
      setUploadingIndex(null); // 全て完了
    }
  }

  async function handleSubmit() {
    if (!files || files.length === 0) {
      setError("Please select a directory.");
      return;
    }
    setError(null);
    setSuccessCount(0);
    setProgress(0);
    setUploadingIndex(0);
  }

  const isUploading = uploadingIndex !== null;

  return (
    <div className="space-y-4 p-4 w-full max-w-md">
      <AcceptExtensions exts={exts} setExts={setExts} />
      <CustomFileUploader
        acceptExt={exts}
        setFiles={(files) => {
          setFiles(files);
          setError(null);
          setSuccessCount(0);
          setProgress(0);
          setUploadingIndex(null);
        }}
      />
      {files && files.length > 0 && (
        <div>
          <p>{files.length} files selected.</p>
          <ul className="overflow-y-auto rounded-md border p-2 text-sm">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="truncate">
                <UploadUnit
                  file={file}
                  isUploading={uploadingIndex === index}
                  onSuccess={handleSuccess}
                  onComplete={handleComplete}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {isUploading && <Progress value={progress} className="w-full" />}
      {files && !isUploading && successCount > 0 && (
        <p>
          {successCount} / {files.length} files uploaded successfully.
        </p>
      )}
      <Button onClick={handleSubmit} disabled={isUploading || !files}>
        {isUploading
          ? `Uploading... (${successCount}/${files?.length})`
          : "Upload"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
