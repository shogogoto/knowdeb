// Uploaderで選択された１ファイルから生成されるコンポーネント
//

type Props = {
  file: File;
};

export default function UploadUnit({ file }: Props) {
  return <div>{file.webkitRelativePath}</div>;
}
