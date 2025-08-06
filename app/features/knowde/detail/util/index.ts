import Graph from "graphology";
import type {
  EdgeData,
  EdgeType,
  GraphData,
} from "~/generated/fastAPI.schemas";

function removeHyphen(id: string) {
  return id.replaceAll(/-/g, "");
}

function toSerializedEdge(edge: EdgeData) {
  return {
    attributes: {
      etype: edge.type, // type属性はsigma.jsで使われていた
    },
    source: edge.source,
    target: edge.target,
    key: [edge.source, edge.target].sort().join("->"),
  };
}

export function toGraph(g: GraphData) {
  const { nodes, edges } = g;
  const graph = new Graph({
    multi: true,
    type: "directed",
  });

  graph.import({
    nodes: nodes.map((node) => ({ key: node.id })),
    edges: edges.map(toSerializedEdge),
  });

  return graph;
}

type Accessor = (g: Graph, n: string, et: EdgeType) => string[];
export const succ: Accessor = (g, n, et) => {
  return g
    .filterOutEdges(n, (_, attr) => attr.etype === et)
    .map((e) => g.target(e));
};

// predecessor
export const pred: Accessor = (g, n, et) => {
  return g
    .filterInEdges(n, (_, attr) => attr.etype === et)
    .map((e) => g.source(e));
};

// n から 同じtypeのedgeを末まで辿る
export function pathsToEnd(
  g: Graph,
  n: string,
  t: EdgeType,
  accessor: Accessor,
) {
  const ls: string[][] = [];

  function _f(ns: string[]) {
    const last = ns.at(-1);
    if (!last) throw new Error();
    const accs = accessor(g, last, t);
    if (accs.length === 0 && ns.length !== 1) {
      // 自身のみのpathは除外
      ls.push(ns);
    }
    for (const a of accs) {
      _f([...ns, a]);
    }
  }
  _f([n]);
  return ls;
}
