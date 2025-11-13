export default function Uploader() {
  return (
    <input
      type="file"
      id="file-input"
      //webkitdirectory=""
      // directory=""
      accept=".txt, .md, .kn"
      multiple
    />
  );
}
