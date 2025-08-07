describe("Pagination 作り直し", () => {
  it("current なし", () => {
    it("n_page<0 エラー", async () => {});
    it("n_page=0 prev next のみ表示", async () => {});
    it("n_page=1 prev 1 next", async () => {});
    it("n_page=2 prev 1 2 next", async () => {});
    it("n_page=3 prev 1 2 3 next", async () => {});
    it("n_page>4 1,2,..,n_page", () => {
      it.each([4, 5, 100])("n_page=%i", async (n_page) => {});
    });
  });
  it("current あり", () => {
    it("currentが有効範囲[1, n_page]外", async () => {});
    it("currentが有効範囲[1, n_page]内", () => {
      it("prev disable current=1", () => {});
      it("next disable current=n_page", () => {});
    });
  });
});

// const server = setupServer(...getUserMock(), ...getAuthMock());
// beforeAll(() => server.listen());
// afterEach(() => {
//   server.resetHandlers();
//   vi.restoreAllMocks();
// });
// afterAll(() => server.close());

// import { render } from "@testing-library/react";
// import { createMemoryRouter } from "react-router";
// import { RouterProvider } from "react-router";
// import PageNavi from ".";
// import PageProvider from "./PageProvider";
//
// function mkrouter(total: number, size: number) {
//   const routesFixture = [
//     {
//       path: "/some",
//       Component: () => (
//         <PageProvider>
//           <PageNavi total={total} pageSize={size} />
//         </PageProvider>
//       ),
//     },
//   ];
//   return createMemoryRouter(routesFixture, {
//     initialEntries: ["/some"],
//   });
// }
//
// describe("Pagenation", () => {
//   it("値なしのとき ?page=0", async () => {
//     const router = mkrouter(1201, 50);
//     render(<RouterProvider router={router} />);
//
//     // await waitFor(() => {
//     //   // expect(router.state.location.pathname).toBe("/some?page=0");
//     //   //
//     //   // expect(router.state.location.pathname).toBe("/some?page=1");
//     // });
//   });
//   it("nextへ移動", async () => {
//     // tailまで行ったらdisable
//   });
//   it("prevへ移動", async () => {
//     // headまで行ったらdisable
//   });
//   it("aaaa", async () => {});
// });
/*

テスト設計
url との同期
page数 の計算
Provider要る？ url から状態は取ってこれるはずだが


カレントページサイズ
  見開きページみたいなことができる

page item数
  undefined ゼロ
  1
  2
  3
  4
  5






*/
