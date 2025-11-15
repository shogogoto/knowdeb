import { fileWithoutTopDirectory } from ".";
const cases = [
  [
    "トップディレクトリあり",
    "toplevel/foo/bar.txt", // webkitRelativePath
    "bar.txt", // fileName
    "foo/bar.txt", // expectedName
  ],
  [
    "トップディレクトリなし",
    "foobar.txt", // webkitRelativePath
    "foobar.txt", // fileName
    "foobar.txt", // expectedName
  ],
];

describe("fileWithoutTopDirectory", () => {
  it.each(cases)(
    "%s", // description をテスト名として使用
    (_, webkitRelativePath, fileName, expectedName) => {
      const fileContent = "test content";
      const originalFile = new File([fileContent], fileName, {
        type: "text/plain",
        lastModified: new Date("2023-01-01").getTime(),
      });
      if (webkitRelativePath !== undefined) {
        // webkitRelativePathは読み取り専用なので、Object.definePropertyで設定する
        Object.defineProperty(originalFile, "webkitRelativePath", {
          value: webkitRelativePath,
          writable: true,
        });
      }
      const newFile = fileWithoutTopDirectory(originalFile);
      expect(newFile.name).toBe(expectedName);
    },
  );
});
