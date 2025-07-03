type Props = {
  url: string;
};

export default function UploadedPreview({ url }: Props) {
  const resizedUrl = url.replace(
    "/upload/",
    "/upload/w_200,h_200,c_fill,g_face/",
  );

  return (
    <div>
      <p>アップロードされた画像のプレビュー:</p>
      <img src={resizedUrl} alt="Profile" style={{ borderRadius: "50%" }} />
      <p>画像のURL: {url}</p>
      <p>リサイズ画像のURL: {resizedUrl}</p>
    </div>
  );
}
