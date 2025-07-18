import { URLSearchParams } from "node:url";
import { cleanup } from "@testing-library/react";
// これがないと screenのメソッドにアクセスできない
import "@testing-library/jest-dom/vitest";
// import fetch, { Request, Response, Headers } from "node-fetch";

// @ts-ignore
globalThis.URLSearchParams = URLSearchParams;
// nodejsはブラウザのfetchを模擬しているため予期しない動作をすることがある
// テストでは上書きする必要があるかも
// 1. globalThis.URLSearchParams が確実にNode.jsのURLSearchParamsになるようにする
// // 2. globalThis.fetch, Request, Response, Headers をnode-fetchで上書きする
//   globalThis.fetch = fetch;
//   globalThis.Request = Request;
//   globalThis.Response = Response;
//   globalThis.Headers = Headers;
//

// ここで環境変数をモックする
import.meta.env.VITE_CLOUD_NAME = "test_cloud_name";
import.meta.env.VITE_UPLOAD_PRESET = "test_upload_preset";

// 各テストの後にDOMをクリーンアップ
afterEach(() => {
  cleanup();
});
