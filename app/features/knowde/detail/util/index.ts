import Graph, { type DirectedGraph } from "graphology";
import type {
  EdgeData,
  EdgeType,
  GraphData,
  KnowdeDetail,
} from "~/shared/generated/fastAPI.schemas";
import { pathsToEnd, succ } from "./network";

export function toGraph(g: GraphData): DirectedGraph {
  const { nodes, edges } = g;
  const graph = new Graph({
    multi: true,
    type: "directed",
  });
  function toSerializedEdge(edge: EdgeData) {
    return {
      attributes: {
        etype: edge.type, // type属性はsigma.jsで使われていた
      },
      source: edge.source,
      target: edge.target,
    };
  }

  graph.import({
    nodes: nodes.map((node) => ({ key: node.id })),
    edges: edges.map(toSerializedEdge),
  });

  return graph;
}

export function graphForView(kd: KnowdeDetail) {
  const id = kd.uid.replaceAll(/-/g, "");
  return {
    g: toGraph(kd.g),
    rootId: id,
    knowdes: kd.knowdes,
    exceptedRoot: Object.keys(kd.knowdes).filter((v) => v !== kd.uid),
    root: kd.knowdes[id],
    location: kd.location,
    kn: (id: string) => kd.knowdes[id],
  };
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const EdgeColors: Partial<Record<EdgeType, string>> = {
  below: "brown",
  sibling: "orange",
  to: "gray",
  resolved: "darkgreen",
};

export function toDisplayGraph(kd: KnowdeDetail) {
  const { uid, g, knowdes } = kd;
  const id = uid.replaceAll(/-/g, "");
  const graph = toGraph(g);

  graph.setNodeAttribute(id, "x", 0);
  graph.setNodeAttribute(id, "y", 0);
  // graph.setNodeAttribute(id, "size", );

  function toLabel(n: string) {
    const k = knowdes[n];
    return `${k.term?.names?.join(" ") || ""}: ${k.sentence}`;
  }

  console.log({ id });

  const paths = pathsToEnd(
    graph,
    id,
    (attr) => ["below", "sibling"].includes(attr.etype),
    succ,
  );
  // succ(graph, id, "to").forEach((n) => {
  //   console.log(n, toLabel(n));
  // });
  //
  // succ(graph, id, "resolved").forEach((n) => {
  //   console.log(n, toLabel(n));
  // });

  graph.edges().forEach((e) => {
    const et = graph.getEdgeAttribute(e, "etype") as EdgeType;
    graph.setEdgeAttribute(e, "label", et);

    const color = EdgeColors[et] ?? "";
    graph.setEdgeAttribute(e, "color", color);
    // graph.setEdgeAttribute(e, "size", 5);
    // console.log(graph.source(e));
  });
  graph.nodes().forEach((n, i) => {
    const k = knowdes[n];
    const label = `${k.term?.names?.join(" ") || ""}: ${k.sentence}`;
    graph.setNodeAttribute(n, "label", label);
    graph.setNodeAttribute(n, "size", k.stats.score);

    graph.setNodeAttribute(n, "x", randomInt(0, 10));
    graph.setNodeAttribute(n, "y", -i);
    // graph.setnodeattribute(n, "x", k.stats.n_premise);
    // graph.setnodeattribute(n, "y", k.stats.n_conclusion);
  });

  return { id, graph };
}
