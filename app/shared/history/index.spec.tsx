import { Link, createMemoryRouter } from "react-router";

function Test() {
  return (
    <div>
      test
      <Link to="/home">Home</Link>
    </div>
  );
}

function mkrouter(initial: string) {
  return createMemoryRouter(
    [
      {
        path: "/other",
        Component: () => <div>somewhere</div>,
      },
      {
        path: "/home",
        Component: () => <div>home</div>,
      },
    ],
    {
      initialEntries: [initial],
    },
  );
}

describe("history", () => {
  describe("URLを履歴に追加", () => {
    // URLを履歴に追加
    // historyのtitleに何を選ぶかはURLに含まれる文字列Typeによって異なる
    // それぞれ /homeからターゲットのURLへ遷移した後に以下をテストする
    //   1. 履歴に適切なtypeとtitleが追加される
    //   2. それをクリックすると、そのURLに移動し、その履歴がハイライト&intoViewされる

    it("検索画面の履歴", async () => {
      // Search Iconが表示される
      //
      // 検索画面では現状、検索条件をインメモリで管理しているので
      // URLのパラメータに検索条件が同期されるように修正する必要がある
      // titleには検索文字列を入れる
      //
    });
    it("knowde詳細画面履歴", async () => {
      // Lightbulb Iconが表示される
    });
    it("userプロフィール画面", async () => {
      // User Iconが表示される
    });

    it("resource画面", async () => {
      // File Iconが表示される
    });

    it("その他の画面", async () => {
      // Iconが表示されない
    });

    it("既に履歴がある場合", async () => {
      // knowde詳細画面でテスト
      //   重複した履歴があった場合はそれを削除する(delete insertみたいな)
    });
  });
});
