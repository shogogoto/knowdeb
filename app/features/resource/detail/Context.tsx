import type { DirectedGraph } from "graphology";
import { type ReactNode, createContext, useContext } from "react";
import type {
  ResourceDetailTerms,
  ResourceDetailUids,
} from "~/shared/generated/fastAPI.schemas";

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
