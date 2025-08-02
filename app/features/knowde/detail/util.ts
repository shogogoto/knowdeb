import Graph from "graphology";
import type { EdgeData, GraphData } from "~/generated/fastAPI.schemas";

function removeHyphen(id: string) {
  return id.replaceAll(/-/g, "");
}

function toSerializedEdge(edge: EdgeData) {
  return {
    type: edge.type,
    source: edge.source,
    target: edge.target,
    key: [edge.source, edge.target].sort().join("-"),
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
