import type Graph from "graphology";
import type { Attributes } from "graphology-types";
import type { EdgeType } from "~/shared/generated/fastAPI.schemas";

type EdgePredicate = (attr: Attributes) => boolean;

type Accessor = (g: Graph, n: string, predicate: EdgePredicate) => string[];

export function eqEdgeType(t: EdgeType): EdgePredicate {
  return (attr) => attr.etype === t;
}

export const succ: Accessor = (g, n, predicate) => {
  return g
    .filterOutEdges(n, (_, attr) => predicate(attr))
    .map((e) => g.target(e));
};

// predecessor
export const pred: Accessor = (g, n, predicate) => {
  return g
    .filterInEdges(n, (_, attr) => predicate(attr))
    .map((e) => g.source(e));
};

// n から 同じtypeのedgeを末まで辿る
export function pathsToEnd(
  g: Graph,
  start: string,
  predicate: EdgePredicate,
  accessor: Accessor,
) {
  const ls: string[][] = [];

  function _f(ns: string[]) {
    const last = ns.at(-1);
    if (!last) throw new Error();
    const accs = accessor(g, last, predicate);
    if (accs.length === 0 && ns.length !== 1) {
      ls.push(ns); // 自身のみのpathは除外
    }
    for (const a of accs) {
      _f([...ns, a]);
    }
  }
  _f([start]);
  return ls;
}

export function operatorGraph(g: Graph, edgeType: EdgeType) {
  const predicate = eqEdgeType(edgeType);
  return {
    succ: (n: string) => succ(g, n, predicate),
    pred: (n: string) => pred(g, n, predicate),
    pathsToEnd: (start: string, predicate: EdgePredicate) =>
      pathsToEnd(g, start, predicate, succ),
  };
}
