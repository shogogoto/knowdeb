import { useEffect } from "react";
import { useLocation } from "react-router";

// ★ あなたの GA4 測定IDに置き換えてください
const MEASUREMENT_ID: string = "G-02M34HWF8J";

// グローバルな window オブジェクトに gtag 関数が存在することを TypeScript に教える
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * React Router の URL変更を監視し、GA4に手動でページビューを送信する
 */
export default function GATracker() {
  // 1. useLocation フックで現在のルーティング情報を取得
  const location = useLocation();

  // 2. location.pathname (URLパス) が変わるたびに実行
  useEffect(() => {
    // window.gtag が存在し、GA4 タグがロードされていることを確認
    if (typeof window.gtag === "function") {
      // 3. GA4にページビューイベントを手動で送信
      window.gtag("event", "page_view", {
        page_title: document.title, // ページのタイトル
        // location.search はクエリパラメータ (?tab=1 など) を含む
        page_path: location.pathname + location.search,
        page_location: window.location.href, // 完全な URL
        send_to: MEASUREMENT_ID, // 送信先の測定ID
      });
      console.log(`GA4 Page View Sent (TSX): ${location.pathname}`); // 開発確認用
    }
    // 依存配列に location.pathname と location.search を含める
  }, [location.pathname, location.search]);

  // このコンポーネントは UI に何も表示しない
  return null;
}
