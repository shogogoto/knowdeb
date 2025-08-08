import { cleanup } from "@testing-library/react";
// これがないと screenのメソッドにアクセスできない
import "@testing-library/jest-dom/vitest";
import dotenv from "dotenv";
import fetch, { Request, Response, Headers } from "node-fetch";

dotenv.config({ path: "./.env" }); // .envファイルのパスを指定
// nodejsはブラウザのfetchを模擬しているため予期しない動作をすることがある
// テストでは上書きする必要があるかも
// @ts-ignore
globalThis.URLSearchParams = URLSearchParams;
// @ts-ignore
globalThis.fetch = fetch;
// @ts-ignore
globalThis.Request = Request;
// @ts-ignore
globalThis.Response = Response;
// @ts-ignore
globalThis.Headers = Headers;

// node.js 環境にはないからモック
window.HTMLElement.prototype.scrollIntoView = () => {};

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// @ts-ignore
global.ResizeObserver = ResizeObserverMock;

// 各テストの後にDOMをクリーンアップ
afterEach(() => {
  cleanup();
});
