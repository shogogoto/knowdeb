import { renderHook } from "@testing-library/react";
import { describe } from "vitest";
import useCloudinaryUpload from "./hooks";

describe("useCounter", () => {
  const mockOnUploadSuccess = vi.fn();
  const initialProps = {
    publicId: "test-public-id",
    onUploadSuccess: mockOnUploadSuccess,
  };

  test("初期値が正しく設定されること", () => {
    const { result } = renderHook(() => useCloudinaryUpload(initialProps));
    console.log(result);
    expect(result.current.widget).toBeNull();
    // スクリプトがまだロードされていないため、createUploadWidgetは呼び出されていない
    // expect(window.cloudinary?.createUploadWidget).not.toHaveBeenCalled();
    // const aaa = result.current.openWidget();
    // console.log(result);
    // console.log(aaa);
    // expect(result.current.count).toBe(10);
    //
  });

  //   test("increment でカウントが増加すること", () => {
  //     const { result } = renderHook(() => useCounter(0));
  //
  //     // act()内で状態の更新を行うことで、Reactの状態の更新を待つことができる
  //     act(() => {
  //       result.current.increment();
  //     });
  //
  //     expect(result.current.count).toBe(1);
  //   });
  //
  //   test("decrement でカウントが減少すること", () => {
  //     const { result } = renderHook(() => useCounter(5));
  //
  //     act(() => {
  //       result.current.decrement();
  //     });
  //
  //     expect(result.current.count).toBe(4);
  //   });
  //
  //   test("reset で初期値に戻ること", () => {
  //     const { result } = renderHook(() => useCounter(10));
  //
  //     act(() => {
  //       result.current.increment();
  //       result.current.increment();
  //       result.current.reset();
  //     });
  //
  //     expect(result.current.count).toBe(10);
  //   });
});
