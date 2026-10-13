import { vi } from "vitest";
import { networkFetch } from "./networkFetch";

afterEach(() => vi.unstubAllGlobals());

it.each([
  new TypeError("Failed to fetch"),
  Object.assign(new Error("NetworkError when attempting to fetch resource."), {
    name: "NetworkError",
  }),
])(
  "explains a network failure without automatically repeating the write",
  async (cause) => {
    const fetch = vi.fn().mockRejectedValue(cause);
    vi.stubGlobal("fetch", fetch);
    await expect(
      networkFetch("https://example.test/battle", { method: "POST" }),
    ).rejects.toMatchObject({
      message:
        "サーバーに接続できませんでした。接続を確認して再試行してください。",
      cause,
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  },
);

it("preserves cancellations and HTTP responses", async () => {
  const aborted = new DOMException("Cancelled", "AbortError");
  const response = new Response("Unavailable", { status: 503 });
  vi.stubGlobal(
    "fetch",
    vi.fn().mockRejectedValueOnce(aborted).mockResolvedValue(response),
  );
  await expect(networkFetch("https://example.test/battle")).rejects.toBe(
    aborted,
  );
  expect(await networkFetch("https://example.test/battle")).toBe(response);
});
