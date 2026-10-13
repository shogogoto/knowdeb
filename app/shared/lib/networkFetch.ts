/** Translate transport failures without retrying writes or hiding HTTP errors. */
export async function networkFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  try {
    return await fetch(input, init);
  } catch (cause) {
    if (
      cause instanceof TypeError ||
      (cause instanceof Error && cause.name === "NetworkError")
    ) {
      throw new Error(
        "サーバーに接続できませんでした。接続を確認して再試行してください。",
        { cause },
      );
    }
    throw cause;
  }
}
