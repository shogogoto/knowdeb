import { useContext } from "react";
import { TraceMemoryContext } from "./Context";

export function useTraceMemory() {
  const context = useContext(TraceMemoryContext);
  if (context === undefined) {
    throw new Error("useTraceMemory must be used within a TraceMemoryProvider");
  }
  return context;
}
