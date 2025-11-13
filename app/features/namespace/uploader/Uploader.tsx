import { type ChangeEvent, useState } from "react";
import useSWRMutation from "swr/mutation";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import { Progress } from "~/shared/components/ui/progress";
import {
  getPostFilesResourcePostUrl,
  type postFilesResourcePostResponse,
} from "~/shared/generated/entry/entry";

type PostFilesArg = {
  files: File[];
  anchorPath: string;
};

async function postFiles(
  url: string,
  { arg }: { arg: PostFilesArg },
): Promise<postFilesResourcePostResponse> {
  const formData = new FormData();
  formData.append("anchor_path", arg.anchorPath);

  // 逐次送信なので、arg.files には常に1つのファイルしか入っていない
  const file = arg.files[0];
  formData.append("files", file, file.webkitRelativePath);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const data: any = body ? JSON.parse(body) : {};

  if (!res.ok) {
    const error = new Error("An error occurred while uploading files.");
    throw error;
  }

  return {
    data,
    status: res.status,
    headers: res.headers,
  } as postFilesResourcePostResponse;
}

export default function Uploader() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [anchorPath, setAnchorPath] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const { trigger, isMutating } = useSWRMutation(
    getPostFilesResourcePostUrl(),
    postFiles,
    {
      onSuccess: () => {
        if (files && progress >= (files.length - 1 / files.length) * 100) {
          setFiles(null);
          setAnchorPath("");
        }
      },
      onError: (err) => {
        setError(err.message);
      },
    },
  );

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(selectedFiles);
      const firstFile = selectedFiles[0];
      if (firstFile.webkitRelativePath) {
        const pathParts = firstFile.webkitRelativePath.split("/");
        setAnchorPath(pathParts[0]);
      } else {
        setError("Directory selection is not supported by your browser.");
      }
      setProgress(0);
      setError(null);
    }
  }

  async function handleSubmit() {
    if (!files || files.length === 0 || !anchorPath) {
      setError("Please select a directory.");
      return;
    }
    setError(null);

    const fileArray = Array.from(files);
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      try {
        await trigger({ files: [file], anchorPath });
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
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="directory-upload">Select Directory</Label>
        <Input
          id="directory-upload"
          type="file"
          //webkitdirectory=""
          onChange={handleFileChange}
          className="file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-4 file:py-2 file:text-accent-foreground hover:file:bg-accent/80"
        />
      </div>

      {anchorPath && (
        <p>
          Selected Directory: <code className="font-mono">{anchorPath}</code>
        </p>
      )}

      {/* {files && files.length > 0 && ( */}
      {/*   <div> */}
      {/*     <p>{files.length} files selected.</p> */}
      {/*     <ul className="h-48 overflow-y-auto rounded-md border p-2 text-sm"> */}
      {/*       {Array.from(files).map((file, index) => ( */}
      {/*         <li key={index} className="truncate"> */}
      {/*           {file.webkitRelativePath} */}
      {/*         </li> */}
      {/*       ))} */}
      {/*     </ul> */}
      {/*   </div> */}
      {/* )} */}

      <Button onClick={handleSubmit} disabled={isMutating || !files}>
        {isMutating ? "Uploading..." : "Upload"}
      </Button>

      {isMutating && <Progress value={progress} className="w-full" />}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
