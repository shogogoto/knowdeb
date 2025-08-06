import type Graph from "graphology";
import type { Attributes } from "graphology-types";
import type { EdgeType } from "~/generated/fastAPI.schemas";

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
      // 自身のみのpathは除外
      ls.push(ns);
    }
    for (const a of accs) {
      _f([...ns, a]);
    }
  }
  _f([start]);
  return ls;
}

function stack(n: string) {
  const ls: string[] = [];
}
// accessがなくなるまで辿りながら処理する
export function repeatToEnd(
  g: Graph,
  start: string,
  predicate: EdgePredicate,
  accessor: Accessor,
) {
  function _f(n: string) {
    const nexts = accessor(g, n, predicate);
    if (nexts.length === 0) {
    }
    for (const next of nexts) {
      _f(next);
    }
  }
  _f(start);
}
