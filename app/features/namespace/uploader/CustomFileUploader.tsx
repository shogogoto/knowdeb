import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from "react";

type Props = {
  acceptExt?: string[];
  setFiles: Dispatch<SetStateAction<File[] | null>>;
};

// デフォルトのinput要素ではフィルタ前のfiles数が表示されてしまう
export default function CustomFileUploader({ acceptExt, setFiles }: Props) {
  const [filteredFileCount, setFilteredFileCount] = useState(0);
  const [directoryName, setDirectoryName] = useState(
    "フォルダを選択してください",
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const filteredFiles = Array.from(files).filter((file) => {
          return acceptExt?.some((ext) => file.name.endsWith(ext));
        });
        setFiles(filteredFiles);
        setFilteredFileCount(filteredFiles.length);
        const pathParts = files[0].webkitRelativePath.split("/");
        setDirectoryName(pathParts[0]); // 絶対パスの取得は制限されているらしい
      } else {
        setFilteredFileCount(0);
        setDirectoryName("フォルダを選択してください");
      }
      // 💡 注意点: ユーザーが同じフォルダを連続で選択できるように
      // inputの値をリセットしておくと便利です。
      e.target.value = "";
    },
    [acceptExt, setFiles],
  );

  // 表示するテキストを決定
  const displayLabel =
    filteredFileCount > 0
      ? `${directoryName} 内の ${filteredFileCount} 個の対象ファイル`
      : directoryName;

  return (
    <div className="relative w-80 h-10 border border-gray-300 rounded-md overflow-hidden">
      <input
        id="directory-upload"
        type="file"
        // @ts-ignore
        webkitdirectory=""
        onChange={handleFileChange}
        // 🚨 スタイルで input を完全に透明にし、上の要素をクリック可能にする
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        accept={acceptExt?.join(",")}
      />
      <div className="absolute inset-0 flex items-center bg-gray-100 text-gray-700 hover:bg-gray-200 transition duration-150 z-10">
        {/* <span className="shrink-0 rounded-md border-0 bg-accent px-4 py-2 text-accent-foreground hover:bg-accent/80 font-medium ml-1"> */}
        {/*   フォルダ選択 */}
        {/* </span> */}
        <span className="truncate ml-3 text-sm text-gray-600">
          {displayLabel}
        </span>
      </div>
    </div>
  );
}
