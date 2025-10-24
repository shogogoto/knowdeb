import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { TraceMemoryProvider } from "./Context";
import { useTraceMemory } from "./hooks";

describe("useTraceMemory", () => {
  it("providerなしエラー", () => {
    expect(() => renderHook(() => useTraceMemory())).toThrow(
      "useTraceMemory must be used within a TraceMemoryProvider",
    );
  });

  it("should return context value when wrapped in TraceMemoryProvider", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <TraceMemoryProvider>{children}</TraceMemoryProvider>
    );
    const { result } = renderHook(() => useTraceMemory(), { wrapper });
    expect(result.current.getNumber("1")).toBe(undefined);
    expect(result.current.isRegistered("1")).toBeFalsy();
    act(() => {
      result.current.register("1");
    });
    expect(result.current.isRegistered("1")).toBeTruthy();
    expect(result.current.isRegistered("2")).toBeFalsy();
    expect(result.current.isRegistered("3")).toBeFalsy();
    expect(result.current.getNumber("1")).toBe(1);
    act(() => {
      result.current.register("2");
    });
    expect(result.current.isRegistered("1")).toBeTruthy();
    expect(result.current.isRegistered("2")).toBeTruthy();
    expect(result.current.isRegistered("3")).toBeFalsy();
    expect(result.current.getNumber("2")).toBe(2);
    expect(result.current.getNumber("3")).toBe(undefined);
  });
});
