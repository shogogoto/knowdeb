export function fileWithoutTopDirectory(file: File): File {
  const originalPath = file.webkitRelativePath;
  const firstSeparatorIndex = originalPath.indexOf("/");
  let newName: string;
  if (firstSeparatorIndex === -1) {
    newName = originalPath;
  } else {
    newName = originalPath.slice(firstSeparatorIndex + 1);
  }
  return new File([file], newName, {
    type: file.type,
    lastModified: file.lastModified,
  });
}
