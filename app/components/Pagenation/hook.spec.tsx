/*

テスト設計
url との同期
カレントページサイズ
  見開きページみたいなことができる
*/

import { renderHook } from "@testing-library/react";
import { MemoryRouter, Routes } from "react-router";
import { Route } from "react-router";
import usePagingNeo from "./rephook";
import type { PaginationProps } from "./replace";
import { PProvider } from "./reprovider";

function renderHook_(props: PaginationProps) {
  const wrapper = ({ children }: React.PropsWithChildren) => {
    return (
      <MemoryRouter initialEntries={["/some/0"]}>
        <Routes>
          <Route
            path="/some/:page"
            Component={() => <PProvider {...props}>{children}</PProvider>}
          />
        </Routes>
      </MemoryRouter>
    );
  };
  return renderHook(() => usePagingNeo(), { wrapper });
}

describe("PagenationHook", () => {
  describe("ページ数計算", () => {
    it.each([
      { total: 100, pageSize: 10, expected: 10 },
      { total: 101, pageSize: 10, expected: 11 },
      { total: 9, pageSize: 10, expected: 1 },
      { total: 0, pageSize: 10, expected: 0 },
    ])(
      "total $total, pageSize $pageSize のとき $expected ページ",
      ({ total, pageSize, expected }) => {
        const { result } = renderHook_({ total, pageSize });
        expect(result.current.n_page).toBe(expected);
      },
    );

    it.each([
      { total: -1, pageSize: 10 },
      { total: 100, pageSize: 0 },
      { total: 100, pageSize: -1 },
    ])(
      "total $total, pageSize $pageSize のときエラー",
      ({ total, pageSize }) => {
        expect(() => renderHook_({ total, pageSize })).toThrow(
          "total must be non-negative and pageSize must be positive.",
        );
      },
    );
  });
  // describe("URLParamをセット", () => {
  // const location = useLocation();
  // const navigate = useNavigate();
  // function setPageUrlParam(currentPage: number) {
  //   const params = new URLSearchParams(location.search);
  //   params.set("page", String(currentPage));
  //   navigate(`${location.pathname}?${params.toString()}`);
  // }
  //
  //   it("?page=0", async () => {
  //     const { result } = renderHook_({ total: 1201, pageSize: 50 });
  //     act(() => {
  //       result.current.setPageUrlParam(100);
  //     });
  //     expect(result.current.location.search).toBe("?page=100");
  //     console.log(result.current);
  //   });
  // });
});
