import type { DirectedGraph } from "graphology";
import { type ReactNode, createContext, useContext } from "react";
import type {
  ResourceDetailTerms,
  ResourceDetailUids,
} from "~/shared/generated/fastAPI.schemas";
import { useTraceMemory } from "./util";

export type ResourceDetailContextState = {
  graph: DirectedGraph;
  uids: ResourceDetailUids;
  terms: ResourceDetailTerms;
};

const ResourceDetailContext = createContext<
  ResourceDetailContextState | undefined
>(undefined);

export function useResourceDetail() {
  const context = useContext(ResourceDetailContext);
  if (!context) {
    throw new Error(
      "useResourceDetail must be used within a ResourceDetailProvider",
    );
  }
  return context;
}

export const ResourceDetailProvider = ({
  children,
  ...state
}: { children: ReactNode } & ResourceDetailContextState) => {
  return (
    <ResourceDetailContext.Provider value={state}>
      {children}
    </ResourceDetailContext.Provider>
  );
};

type TraceMemory = ReturnType<typeof useTraceMemory>;

const TraceContext = createContext<TraceMemory | undefined>(undefined);

export function useTrace() {
  const context = useContext(TraceContext);
  if (context === undefined) {
    throw new Error("useTrace must be used within a TraceProvider");
  }
  return context;
}

export function TraceProvider({ children }: { children: ReactNode }) {
  const traceMemory = useTraceMemory();
  return (
    <TraceContext.Provider value={traceMemory}>
      {children}
    </TraceContext.Provider>
  );
}
