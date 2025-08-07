import { render, screen } from "@testing-library/react";
import _ from "lodash";
import { MemoryRouter } from "react-router";
import PagingNavi from "./replace";

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
      <PagingNavi {...props} />
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

  describe("currentPage更新 n_page=10", () => {
    it("nextへ移動", async () => {});
    it("prevへ移動", async () => {
      // headまで行ったらdisable
    });
    it("aaaa", async () => {});
  });
});
