import { useState } from "react";
import { Button } from "~/shared/components/ui/button";
import AcceptExtensions from "./AcceptExtensions";
import CustomFileUploader from "./CustomFileUploader";
import UploadUnit from "./UploadUnit";

export default function Uploader() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const [exts, setExts] = useState<string[]>([".txt", ".md", ".kn"]);

  async function handleSubmit() {
    if (!files || files.length === 0) {
      setError("Please select a directory.");
      return;
    }
    setError(null);

    const fileArray = Array.from(files);
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      try {
        //await trigger({ files: [file], anchorPath });
        setProgress(((i + 1) / fileArray.length) * 100);
      } catch (e) {
        if (e instanceof Error) {
          setError(`Failed to upload ${file.name}: ${e.message}`);
        } else {
          setError(`Failed to upload ${file.name}.`);
        }
        break;
      }
    }
  }

  return (
    <div className="space-y-4 p-4 w-full max-w-md">
      <AcceptExtensions exts={exts} setExts={setExts} />
      <CustomFileUploader acceptExt={exts} setFiles={setFiles} />
      {files && files.length > 0 && (
        <div>
          <p>{files.length} files selected.</p>
          <ul className="overflow-y-auto rounded-md border p-2 text-sm">
            {Array.from(files).map((file) => (
              <li key={file.webkitRelativePath} className="truncate">
                <UploadUnit file={file} />
              </li>
            ))}
          </ul>
        </div>
      )}
      <Button
        onClick={handleSubmit}
        //disabled={isMutating || !files}
      >
        {/* {isMutating ? "Uploading..." : "Upload"} */}
        Upload
      </Button>
    </div>
  );
}
