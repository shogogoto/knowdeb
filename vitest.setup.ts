// vitest.setup.ts
import { URLSearchParams } from "node:url";
// import fetch, { Request, Response, Headers } from "node-fetch";

// @ts-ignore
globalThis.URLSearchParams = URLSearchParams;

// // 1. globalThis.URLSearchParams が確実にNode.jsのURLSearchParamsになるようにする
// if (
//   typeof globalThis.URLSearchParams === "undefined" ||
//   globalThis.URLSearchParams !== URLSearchParams
// ) {
//   console.log(
//     "Vitest setup: globalThis.URLSearchParams has been set/overwritten.",
//   );
// } else {
//   console.log("Vitest setup: globalThis.URLSearchParams already OK.");
// }
//
// // 2. globalThis.fetch, Request, Response, Headers をnode-fetchで上書きする
// // jsdomが提供するfetchよりもnode-fetchの方が、Node.js環境でのURLSearchParamsの扱いに一貫性がある可能性があります。
// if (typeof globalThis.fetch === "undefined") {
//   globalThis.fetch = fetch;
//   console.log("Vitest setup: globalThis.fetch has been set to node-fetch.");
// } else {
//   console.log(
//     "Vitest setup: globalThis.fetch already exists. Skipping overwrite.",
//   );
//   // 既にfetchがある場合は、そのfetchが問題ないか確認するか、強制的に上書きするか検討
//   // 例えば、jsdomのfetchを強制的にnode-fetchに置き換えたい場合は、このif文を削除
//   // globalThis.fetch = fetch;
// }
//
// // Request, Response, Headers もnode-fetchのものを使用するように設定
// if (
//   typeof globalThis.Request === "undefined" ||
//   globalThis.Request !== Request
// ) {
//   globalThis.Request = Request;
//   console.log(
//     "Vitest setup: globalThis.Request has been set to node-fetch.Request.",
//   );
// }
// if (
//   typeof globalThis.Response === "undefined" ||
//   globalThis.Response !== Response
// ) {
//   globalThis.Response = Response;
//   console.log(
//     "Vitest setup: globalThis.Response has been set to node-fetch.Response.",
//   );
// }
// if (
//   typeof globalThis.Headers === "undefined" ||
//   globalThis.Headers !== Headers
// ) {
//   globalThis.Headers = Headers;
//   console.log(
//     "Vitest setup: globalThis.Headers has been set to node-fetch.Headers.",
//   );
// }
//
// console.log("Vitest setup file loaded!");
