import { useState } from "react";
import CustomFileUploader from "./CustomFileUploader";
import UploadUnit from "./UploadUnit";

export default function Uploader() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const acceptExtensions = [".txt", ".md", ".kn"];

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
    <div className="space-y-4 p-4">
      <CustomFileUploader acceptExt={acceptExtensions} setFiles={setFiles} />
      {files && files.length > 0 && (
        <div>
          <p>{files.length} files selected.</p>
          <ul className="h-48 overflow-y-auto rounded-md border p-2 text-sm">
            {Array.from(files).map((file) => (
              <li key={file.webkitRelativePath} className="truncate">
                <UploadUnit file={file} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* <Button onClick={handleSubmit} disabled={isMutating || !files}> */}
      {/*   {isMutating ? "Uploading..." : "Upload"} */}
      {/* </Button> */}
      {/**/}
      {/* {isMutating && <Progress value={progress} className="w-full" />} */}
      {/**/}
      {/* {error && <p className="text-sm text-red-500">{error}</p>} */}
    </div>
  );
}
