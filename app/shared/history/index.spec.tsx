import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, Outlet, RouterProvider, createMemoryRouter } from "react-router";
import { historyCache } from "../lib/indexed";
import { useHistory } from "./hooks";
import History from "./index";

// `Test` and `mkrouter` are not used in the new test, but might be used by other tests.
// So, I'll keep them.
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
        path: "/",
        Component: () => (
          <div>
            home
            <History />
          </div>
        ),
      },

      {
        path: "/knowde/search?q=testquery",
        Component: () => {
          const { addHistory } = useHistory();
          addHistory({ title: "testquery" });
          return <div>Search Page</div>;
        },
      },
    ],
    {
      initialEntries: [initial],
    },
  );
}

describe("history", () => {
  beforeEach(async () => {
    await historyCache.clear();
  });

  describe("URLを履歴に追加", () => {
    // URLを履歴に追加
    // historyのtitleに何を選ぶかはURLに含まれる文字列Typeによって異なる
    // それぞれ /homeからターゲットのURLへ遷移した後に以下をテストする
    //   1. 履歴に適切なtypeとtitleが追加される
    //   2. それをクリックすると、そのURLに移動し、その履歴がハイライト&intoViewされる

    it("検索画面の履歴", async () => {
      const user = userEvent.setup();

      function SearchPage() {
        const { addHistory } = useHistory();
        addHistory({ title: "testquery" });
        return <div>Search Page</div>;
      }
      function HomePage() {
        return <div>Home Page</div>;
      }
      function TestApp() {
        return (
          <div>
            <History />
            <Outlet />
          </div>
        );
      }

      const router = createMemoryRouter(
        [
          {
            path: "/",
            element: <TestApp />,
            children: [
              { index: true, element: <HomePage /> },
              { path: "knowde/search", element: <SearchPage /> },
            ],
          },
        ],
        { initialEntries: ["/knowde/search?q=testquery"] },
      );

      render(<RouterProvider router={router} />);
      const historyItem = await screen.findByText("testquery");
      expect(historyItem).toBeInTheDocument(); // titleが表示される

      const parentDiv = historyItem.parentElement;
      expect(parentDiv?.querySelector("svg")).toBeInTheDocument();
      act(() => {
        router.navigate("/");
      });
      await user.click(historyItem);
      await waitFor(() => {
        expect(router.state.location.pathname).toBe("/knowde/search");
        expect(router.state.location.search).toBe("?q=testquery");
      });
    });

    //   it("knowde詳細画面履歴", async () => {
    //     const user = userEvent.setup();
    //     const knowdeId = "d9353547-6298-404d-b013-d61713117c32";
    //
    //     // Test components
    //     function KnowdeDetailPage() {
    //       return <div>Knowde Detail Page</div>;
    //     }
    //     function HomePage() {
    //       return <div>Home Page</div>;
    //     }
    //     function TestApp() {
    //       return (
    //         <div>
    //           <History />
    //           <Outlet />
    //         </div>
    //       );
    //     }
    //
    //     const router = createMemoryRouter(
    //       [
    //         {
    //           path: "/",
    //           element: <TestApp />,
    //           children: [
    //             { index: true, element: <HomePage /> },
    //             { path: "knowde/:knowdeId", element: <KnowdeDetailPage /> },
    //           ],
    //         },
    //       ],
    //       { initialEntries: ["/"] },
    //     );
    //
    //     render(<RouterProvider router={router} />);
    //
    //     // /knowde/:knowdeId に遷移
    //     await router.navigate(`/knowde/${knowdeId}`);
    //
    //     // 履歴に knowdeId が表示されるのを待つ
    //     const historyItem = await screen.findByText(knowdeId);
    //     expect(historyItem).toBeInTheDocument();
    //
    //     // アイコン(SVG)が表示されていることを確認
    //     const parentDiv = historyItem.parentElement;
    //     expect(parentDiv?.querySelector("svg")).toBeInTheDocument();
    //
    //     // TODO: アイコンがLightbulbアイコンであることをより厳密にテストする
    //
    //     // 別のページに遷移
    //     await router.navigate("/");
    //
    //     // 履歴アイテムをクリック
    //     await user.click(historyItem);
    //
    //     // URLが戻っていることを確認
    //     await waitFor(() => {
    //       expect(router.state.location.pathname).toBe(`/knowde/${knowdeId}`);
    //     });
    //   });
    //   it("userプロフィール画面", async () => {
    //     const user = userEvent.setup();
    //     const userId = "some-user-id";
    //
    //     // Test components
    //     function UserProfilePage() {
    //       return <div>User Profile Page</div>;
    //     }
    //     function HomePage() {
    //       return <div>Home Page</div>;
    //     }
    //     function TestApp() {
    //       return (
    //         <div>
    //           <History />
    //           <Outlet />
    //         </div>
    //       );
    //     }
    //
    //     const router = createMemoryRouter(
    //       [
    //         {
    //           path: "/",
    //           element: <TestApp />,
    //           children: [
    //             { index: true, element: <HomePage /> },
    //             { path: "user/:userId", element: <UserProfilePage /> },
    //           ],
    //         },
    //       ],
    //       { initialEntries: ["/"] },
    //     );
    //
    //     render(<RouterProvider router={router} />);
    //
    //     // /user/:userId に遷移
    //     await router.navigate(`/user/${userId}`);
    //
    //     // 履歴に "User: {userId}" が表示されるのを待つ
    //     const historyItem = await screen.findByText(`User: ${userId}`);
    //     expect(historyItem).toBeInTheDocument();
    //
    //     // アイコン(SVG)が表示されていることを確認
    //     const parentDiv = historyItem.parentElement;
    //     expect(parentDiv?.querySelector("svg")).toBeInTheDocument();
    //
    //     // TODO: アイコンがUserアイコンであることをより厳密にテストする
    //
    //     // 別のページに遷移
    //     await router.navigate("/");
    //
    //     // 履歴アイテムをクリック
    //     await user.click(historyItem);
    //
    //     // URLが戻っていることを確認
    //     await waitFor(() => {
    //       expect(router.state.location.pathname).toBe(`/user/${userId}`);
    //     });
    //   });
    //
    //   it("resource画面", async () => {
    //     const user = userEvent.setup();
    //     const resourceId = "some-resource-id";
    //
    //     // Test components
    //     function ResourcePage() {
    //       return <div>Resource Page</div>;
    //     }
    //     function HomePage() {
    //       return <div>Home Page</div>;
    //     }
    //     function TestApp() {
    //       return (
    //         <div>
    //           <History />
    //           <Outlet />
    //         </div>
    //       );
    //     }
    //
    //     const router = createMemoryRouter(
    //       [
    //         {
    //           path: "/",
    //           element: <TestApp />,
    //           children: [
    //             { index: true, element: <HomePage /> },
    //             { path: "resource/:resourceId", element: <ResourcePage /> },
    //           ],
    //         },
    //       ],
    //       { initialEntries: ["/"] },
    //     );
    //
    //     render(<RouterProvider router={router} />);
    //
    //     // /resource/:resourceId に遷移
    //     await router.navigate(`/resource/${resourceId}`);
    //
    //     // 履歴に "Resource: {resourceId}" が表示されるのを待つ
    //     const historyItem = await screen.findByText(`Resource: ${resourceId}`);
    //     expect(historyItem).toBeInTheDocument();
    //
    //     // アイコン(SVG)が表示されていることを確認
    //     const parentDiv = historyItem.parentElement;
    //     expect(parentDiv?.querySelector("svg")).toBeInTheDocument();
    //
    //     // TODO: アイコンがFileアイコンであることをより厳密にテストする
    //
    //     // 別のページに遷移
    //     await router.navigate("/");
    //
    //     // 履歴アイテムをクリック
    //     await user.click(historyItem);
    //
    //     // URLが戻っていることを確認
    //     await waitFor(() => {
    //       expect(router.state.location.pathname).toBe(`/resource/${resourceId}`);
    //     });
    //   });
    //
    //   it("その他の画面", async () => {
    //     // Test components
    //     function OtherPage() {
    //       return <div>Other Page</div>;
    //     }
    //     function HomePage() {
    //       return <div>Home Page</div>;
    //     }
    //     function TestApp() {
    //       return (
    //         <div>
    //           <History />
    //           <Outlet />
    //         </div>
    //       );
    //     }
    //
    //     const router = createMemoryRouter(
    //       [
    //         {
    //           path: "/",
    //           element: <TestApp />,
    //           children: [
    //             { index: true, element: <HomePage /> },
    //             { path: "some/other/page", element: <OtherPage /> },
    //           ],
    //         },
    //       ],
    //       { initialEntries: ["/"] },
    //     );
    //
    //     render(<RouterProvider router={router} />);
    //
    //     // 初期状態で履歴が空であることを確認
    //     expect(
    //       await screen.findByText("閲覧履歴はありません"),
    //     ).toBeInTheDocument();
    //
    //     // 履歴が追加されないページに遷移
    //     await router.navigate("/some/other/page");
    //
    //     // 履歴が空のままであることを確認
    //     await waitFor(() => {
    //       expect(screen.getByText("閲覧履歴はありません")).toBeInTheDocument();
    //     });
    //
    //     // ホームに戻っても履歴は空のまま
    //     await router.navigate("/");
    //     await waitFor(() => {
    //       expect(screen.getByText("閲覧履歴はありません")).toBeInTheDocument();
    //     });
    //   });
    //
    //   it("既に履歴がある場合", async () => {
    //     const knowdeId = "d9353547-6298-404d-b013-d61713117c32";
    //     const knowdeUrl = `/knowde/${knowdeId}`;
    //
    //     // Test components
    //     function KnowdeDetailPage() {
    //       return <div>Knowde Detail Page</div>;
    //     }
    //     function HomePage() {
    //       return <div>Home Page</div>;
    //     }
    //     function TestApp() {
    //       return (
    //         <div>
    //           <History />
    //           <Outlet />
    //         </div>
    //       );
    //     }
    //
    //     const router = createMemoryRouter(
    //       [
    //         {
    //           path: "/",
    //           element: <TestApp />,
    //           children: [
    //             { index: true, element: <HomePage /> },
    //             { path: "knowde/:knowdeId", element: <KnowdeDetailPage /> },
    //           ],
    //         },
    //       ],
    //       { initialEntries: ["/"] },
    //     );
    //
    //     render(<RouterProvider router={router} />);
    //
    //     // 1. 最初にknowde詳細ページに遷移
    //     await router.navigate(knowdeUrl);
    //     await waitFor(async () => {
    //       // 履歴が1件追加されることを確認
    //       const items = await screen.findAllByText(knowdeId);
    //       expect(items).toHaveLength(1);
    //     });
    //
    //     // 2. ホームページに戻る
    //     await router.navigate("/");
    //     await waitFor(async () => {
    //       // 履歴は1件のまま
    //       const items = await screen.findAllByText(knowdeId);
    //       expect(items).toHaveLength(1);
    //     });
    //
    //     // 3. 再度同じknowde詳細ページに遷移
    //     await router.navigate(knowdeUrl);
    //     await waitFor(async () => {
    //       // 履歴が重複せず、1件のままであることを確認
    //       const items = await screen.findAllByText(knowdeId);
    //       expect(items).toHaveLength(1);
    //     });
    //
    //     // 4. historyCacheを直接確認して、件数が1であることを保証する
    //     const allHistory = await historyCache.getAll();
    //     expect(allHistory).toHaveLength(1);
    //     expect(allHistory[0].url).toBe(knowdeUrl);
    //   });
  });
});
