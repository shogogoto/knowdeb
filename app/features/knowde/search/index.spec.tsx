import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { RouterProvider, createMemoryRouter } from "react-router";
import { vi } from "vitest";
import {
  getKnowdeMock,
  getSearchByTextKnowdeGetMockHandler,
  getSearchByTextKnowdeGetResponseMock,
} from "~/shared/generated/knowde/knowde.msw";
import KnowdeSearch from ".";

// MSWサーバーのセットアップ
const server = setupServer(...getKnowdeMock());
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

// 履歴管理フックのモック
const mockAddHistory = vi.fn();
vi.mock("~/shared/history/hooks", () => ({
  useHistory: () => ({
    addHistory: mockAddHistory,
  }),
}));

function mkrouter(initial: string) {
  return createMemoryRouter(
    [
      {
        path: "/knowde/search",
        Component: KnowdeSearch,
      },
    ],
    {
      initialEntries: [initial],
    },
  );
}

describe("Knowde Search", () => {
  // beforeEach(() => {
  //   vi.useFakeTimers();
  // });
  //
  // afterEach(() => {
  //   vi.runOnlyPendingTimers();
  //   vi.useRealTimers();
  // });
  //
  it("大きいページから小さいページへの遷移時にcurrent pageが範囲外にならない", async () => {
    const user = userEvent.setup();
    const total = 500;
    const pageSize = 50;
    const lastPage = total / pageSize; // 10

    const mock = getSearchByTextKnowdeGetResponseMock();
    server.use(
      getSearchByTextKnowdeGetMockHandler({
        total: total,
        data: Array(total).fill(mock.data[0]),
        // @ts-ignore
        owners: [],
      }),
    );

    // const res = await fetch("https://knowde.onrender.com/knowde/?size=10");
    // console.log(await res.json());
    const router = mkrouter(`/knowde/search?size=${pageSize}`);
    render(<RouterProvider router={router} />);

    // page=10に移動
    const pageLink = await screen.findByRole("link", {
      name: String(lastPage),
    });
    await user.click(pageLink);
    await waitFor(() => {
      expect(router.state.location.search).toContain(`page=${lastPage}`);
    });

    // 検索結果が10件(1ページ)しかない状態に変える
    const smTotal = 1;
    server.use(
      getSearchByTextKnowdeGetMockHandler({
        total: smTotal,
        data: Array(smTotal).fill(mock.data[0]),
        // @ts-ignore
        owners: [],
      }),
    );
    // const res2 = await fetch("https://knowde.onrender.com/knowde/?size=10");
    // console.log(await res2.json());
    const searchInput = await screen.findByPlaceholderText(
      "検索文字列を入力...",
    );
    await user.type(searchInput, "new query");
    await waitFor(() => {
      expect(router.state.location.search).toContain("page=1");
      // ここでdebounceを待つことになってpagenavgが変化するっぽい
      expect(router.state.location.search).toContain("q=new+query");
    });
    await waitFor(() => {
      expect(
        screen.queryByRole("link", { name: String(lastPage) }),
      ).not.toBeInTheDocument();

      expect(screen.queryByRole("link", { name: "1" })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "2" })).not.toBeInTheDocument();
    });
  });

  // describe("debounce test", () => {
  //   it("入力後500ms経過するまでAPIは呼ばれず、1000ms経過後にAPIが呼ばれる", async () => {
  //     const spy = vi.fn();
  //     server.use(
  //       http.get("*/knowde/", async (info) => {
  //         spy(info.request.url);
  //         return HttpResponse.json(getSearchByTextKnowdeGetResponseMock());
  //       }),
  //     );
  //
  //     render(<TestComponent />);
  //     const user = userEvent.setup({
  //       advanceTimers: (delay) => act(() => vi.advanceTimersByTime(delay)),
  //     });
  //
  //     const searchInput = await screen.findByPlaceholderText(
  //       "検索文字列を入力...",
  //     );
  //     expect(searchInput).toBeInTheDocument();
  //     expect(spy).not.toHaveBeenCalled();
  //
  //     await user.type(searchInput, "test");
  //
  //     await act(() => vi.advanceTimersByTime(499));
  //     expect(spy).not.toHaveBeenCalled();
  //
  //     // debounce(q) + debounce(params) の合計分待つ
  //     await act(() => vi.advanceTimersByTime(501));
  //     await waitFor(() => {
  //       expect(spy).toHaveBeenCalledTimes(1);
  //       expect(spy).toHaveBeenCalledWith(expect.stringContaining("q=test"));
  //     });
  //   });
  // });
  //
  // describe("URL -> State同期", () => {
  //   it("URLのクエリパラメータでコンポーネントが初期化される", async () => {
  //     const spy = vi.fn();
  //     server.use(
  //       http.get("*/knowde/", async (info) => {
  //         spy(info.request.url);
  //         return HttpResponse.json(getSearchByTextKnowdeGetResponseMock());
  //       }),
  //     );
  //
  //     render(<TestComponent initialEntries={["/knowde/search?q=initial"]} />);
  //
  //     // debounceを待つ
  //     await act(() => vi.advanceTimersByTime(1000));
  //
  //     // 初期レンダリング時にURLのクエリパラメータを使ってAPIが呼ばれる
  //     await waitFor(() => {
  //       expect(spy).toHaveBeenCalledWith(expect.stringContaining("q=initial"));
  //     });
  //
  //     // 検索窓にも値が反映されている
  //     const searchInput = await screen.findByDisplayValue("initial");
  //     expect(searchInput).toBeInTheDocument();
  //   });
  // });
  //
  // describe("State -> URL同期", () => {
  //   it("検索入力によってURLのクエリパラメータが更新される", async () => {
  //     const routes = [{ path: "/knowde/search", element: <TestComponent /> }];
  //     const router = createMemoryRouter(routes, {
  //       initialEntries: ["/knowde/search"],
  //     });
  //     render(<RouterProvider router={router} />);
  //
  //     const user = userEvent.setup({
  //       advanceTimers: (delay) => act(() => vi.advanceTimersByTime(delay)),
  //     });
  //
  //     const searchInput = await screen.findByPlaceholderText(
  //       "検索文字列を入力...",
  //     );
  //     await user.type(searchInput, "sync test");
  //
  //     // debounceを待つ
  //     await act(() => vi.advanceTimersByTime(1000));
  //
  //     await waitFor(() => {
  //       expect(router.state.location.search).toContain("q=sync+test");
  //     });
  //   });
  // });
});
