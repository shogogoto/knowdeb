// import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { DataTransfer } from "happy-dom";
// import { http, HttpResponse } from "msw";
// import { setupServer } from "msw/node";
// import { getPostFilesResourcePostUrl } from "~/shared/generated/entry/entry";
// import { getEntryMock } from "~/shared/generated/entry/entry.msw";
// import Uploader from "./Uploader";
//
// const server = setupServer(...getEntryMock());
//
// function createFileList(files: File[]): FileList {
//   const dataTransfer = new DataTransfer();
//   files.forEach((file) => dataTransfer.items.add(file));
//   return dataTransfer.files;
// }
//
describe("Uploader", () => {
  it("should select a directory and display file list", async () => {
    //     render(<Uploader />);
    //
    //     const file1 = new File(["content1"], "file1.txt");
    //     Object.defineProperty(file1, "webkitRelativePath", {
    //       value: "test-dir/file1.txt",
    //     });
    //     const file2 = new File(["content2"], "file2.txt");
    //     Object.defineProperty(file2, "webkitRelativePath", {
    //       value: "test-dir/subdir/file2.txt",
    //     });
    //
    //     const input = screen.getByLabelText("Select Directory");
    //     fireEvent.change(input, {
    //       target: {
    //         files: createFileList([file1, file2]),
    //       },
  });
  //
  //     expect(await screen.findByText("Selected Directory:")).toBeInTheDocument();
  //     expect(screen.getByText("test-dir")).toBeInTheDocument();
  //     expect(screen.getByText("2 files selected.")).toBeInTheDocument();
  //     expect(screen.getByText("test-dir/file1.txt")).toBeInTheDocument();
  //     expect(screen.getByText("test-dir/subdir/file2.txt")).toBeInTheDocument();
  //   });
  //
  //   it("should upload files sequentially when upload button is clicked", async () => {
  //     let requestCount = 0;
  //     const receivedFiles: string[] = [];
  //
  //     server.use(
  //       http.post(getPostFilesResourcePostUrl(), async ({ request }) => {
  //         requestCount++;
  //         const formData = await request.formData();
  //         const anchorPath = formData.get("anchor_path");
  //         const files = formData.getAll("files") as File[];
  //
  //         expect(anchorPath).toBe("test-dir");
  //         expect(files).toHaveLength(1);
  //         receivedFiles.push(files[0].name); // file.name is webkitRelativePath
  //
  //         return HttpResponse.json(null, { status: 200 });
  //       }),
  //     );
  //
  //     render(<Uploader />);
  //
  //     const file1 = new File(["content1"], "file1.txt");
  //     Object.defineProperty(file1, "webkitRelativePath", {
  //       value: "test-dir/file1.txt",
  //     });
  //     const file2 = new File(["content2"], "file2.txt");
  //     Object.defineProperty(file2, "webkitRelativePath", {
  //       value: "test-dir/subdir/file2.txt",
  //     });
  //
  //     const input = screen.getByLabelText("Select Directory");
  //     fireEvent.change(input, {
  //       target: {
  //         files: createFileList([file1, file2]),
  //       },
  //     });
  //
  //     const uploadButton = screen.getByRole("button", { name: "Upload" });
  //     await userEvent.click(uploadButton);
  //
  //     await waitFor(() => {
  //       expect(requestCount).toBe(2);
  //     });
  //
  //     expect(receivedFiles).toEqual([
  //       "test-dir/file1.txt",
  //       "test-dir/subdir/file2.txt",
  //     ]);
  //     expect(screen.getByRole("progressbar")).toHaveAttribute(
  //       "aria-valuenow",
  //       "100",
  //     );
  //
  //     await waitFor(() => expect(uploadButton).not.toBeDisabled());
  //   });
  //
  //   it("should show an error message if upload fails", async () => {
  //     server.use(
  //       http.post(getPostFilesResourcePostUrl(), () => {
  //         return new HttpResponse(null, { status: 500 });
  //       }),
  //     );
  //
  //     render(<Uploader />);
  //
  //     const file1 = new File(["content1"], "file1.txt");
  //     Object.defineProperty(file1, "webkitRelativePath", {
  //       value: "test-dir/file1.txt",
  //     });
  //
  //     const input = screen.getByLabelText("Select Directory");
  //     fireEvent.change(input, {
  //       target: {
  //         files: createFileList([file1]),
  //       },
  //     });
  //
  //     const uploadButton = screen.getByRole("button", { name: "Upload" });
  //     await userEvent.click(uploadButton);
  //
  //     expect(
  //       await screen.findByText(
  //         "Failed to upload file1.txt: An error occurred while uploading files.",
  //       ),
  //     ).toBeInTheDocument();
  //   });
});
