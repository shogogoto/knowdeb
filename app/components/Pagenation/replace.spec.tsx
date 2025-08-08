import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import _ from "lodash";
import { MemoryRouter } from "react-router";
import PagingNavi, { numberPage } from "./replace";
import { PProvider } from "./reprovider";

function common_expect() {
  expect(screen.getByText("Previous")).toBeInTheDocument();
  expect(screen.getByText("Next")).toBeInTheDocument();
}

function undisplayed_expect(first: number, last: number) {
  const end = last + 1;
  [..._.range(0 - 2, first), ..._.range(end, end + 2)].forEach((i) => {
    expect(screen.queryByText(`${i}`)).not.toBeInTheDocument();
  });
}

function render_(n_page: number, current?: number) {
  const pageSize = 10;
  const total = n_page * pageSize;

  const props = { pageSize, total, initial: current };

  return render(
    <MemoryRouter>
      <PProvider {...props}>
        <PagingNavi total={total} />
      </PProvider>
    </MemoryRouter>,
  );
}

describe("Pagination 作り直し", () => {
  describe("current なし", () => {
    it("n_page<0 エラー", async () => {
      expect(() => render_(-1)).toThrow();
    });
    it("n_page=0 prev next のみ表示", async () => {
      render_(0);
      common_expect();
      expect(screen.queryByText("0")).not.toBeInTheDocument();
      undisplayed_expect(0, 0);
    });
    describe("n_page=1~5 まで増加 prev 1, ..., 5 next", async () => {
      it.each([1, 2, 3, 4, 5])("n_page=%i", async (n_page) => {
        render_(n_page);
        common_expect();
        _.range(1, n_page + 1).forEach((i) => {
          expect(screen.getByText(`${i}`)).toBeInTheDocument();
        });
        undisplayed_expect(1, n_page);
      });
    });
    describe("n_page>5 からスクロールに変わる", () => {
      it.each([6, 7, 10, 15, 20, 100])("n_page=%i", async (n_page) => {
        const { container } = render_(n_page);
        common_expect();
        expect(
          container.querySelector('[data-slot="scroll-area"]'),
        ).toBeInTheDocument();
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText(`${n_page}`)).toBeInTheDocument();
      });
    });
    describe("current あり", () => {
      it("currentが有効範囲[1, n_page]外 でエラー", async () => {
        expect(() => render_(10, 20)).toThrow();
      });

      describe("currentが有効範囲[1, n_page]内", () => {
        it.each([1, 4, 5, 6, 20])(
          "prev disable current=1 n_page=%i",
          async (n_page) => {
            render_(n_page, 1);
            expect(
              screen.getByText("Previous").closest("button"),
            ).toBeDisabled();
          },
        );

        it.each([1, 4, 5, 6, 20])(
          "next disable current, n_page=%i",
          async (n_page) => {
            render_(n_page, n_page);
            expect(screen.getByText("Next").closest("button")).toBeDisabled();
          },
        );
      });
    });
  });

  function assert_current(page: number) {
    expect(screen.getByRole("button", { name: `${page}` })).toHaveAttribute(
      "aria-current",
      "page",
    );
  }
  describe("currentPage更新", () => {
    it("nextへ移動", async () => {
      const user = userEvent.setup();
      render_(5, 4); // 4番目がアクティブ
      assert_current(4);
      await user.click(screen.getByText("Next"));
      assert_current(5);
      expect(screen.getByText("Next").closest("button")).toBeDisabled();
    });

    it("prevへ移動", async () => {
      const user = userEvent.setup();
      render_(5, 2); // 2番目がアクティブ
      assert_current(2);
      await user.click(screen.getByText("Previous"));
      assert_current(1);
      expect(screen.getByText("Previous").closest("button")).toBeDisabled();
    });
    it("項目をクリック", async () => {
      const user = userEvent.setup();
      render_(5, 2); // 2番目がアクティブ
      await user.click(screen.getByText("3"));
      assert_current(3);
      await user.click(screen.getByText("1"));
      assert_current(1);
      await user.click(screen.getByText("5"));
      assert_current(5);
    });

    it("項目をクリック scroll", async () => {
      const user = userEvent.setup();
      render_(10, 2); // 2番目がアクティブ
      await user.click(screen.getByText("3"));
      assert_current(3);
      await user.click(screen.getByText("1"));
      assert_current(1);
      await user.click(screen.getByText("10"));
      assert_current(10);
    });
  });

  describe("ページ数計算", () => {
    it.each([
      { total: 100, pageSize: 10, expected: 10 },
      { total: 101, pageSize: 10, expected: 11 },
      { total: 9, pageSize: 10, expected: 1 },
      { total: 0, pageSize: 10, expected: 0 },
    ])(
      "total $total, pageSize $pageSize のとき $expected ページ",
      ({ total, pageSize, expected }) => {
        expect(numberPage(total, pageSize)).toBe(expected);
      },
    );

    it.each([
      { total: -1, pageSize: 10 },
      { total: 100, pageSize: 0 },
      { total: 100, pageSize: -1 },
    ])(
      "total $total, pageSize $pageSize のときエラー",
      ({ total, pageSize }) => {
        expect(() => numberPage(total, pageSize)).toThrow(
          "total must be non-negative and pageSize must be positive.",
        );
      },
    );
  });
});
