import { SigmaContainer } from "@react-sigma/core";
import { DirectedGraph } from "graphology";
import "@react-sigma/core/lib/style.css";
import { useWorkerLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import { ladder } from "graphology-generators/classic";
import { useEffect } from "react";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const Fa2 = () => {
  const { start, kill } = useWorkerLayoutForceAtlas2({
    settings: { slowDown: 10 },
  });
  useEffect(() => {
    start();
    return () => kill();
  }, [start, kill]);
  return null;
};

export const DisplayGraph = () => {
  const g = ladder(DirectedGraph, 3);
  g.edges().forEach((e) => {
    g.setEdgeAttribute(e, "type", "arrow");
    g.setEdgeAttribute(e, "color", "red");
  });
  g.nodes().forEach((n) => {
    g.setNodeAttribute(n, "label", n);
    g.setNodeAttribute(n, "size", 10);
    g.setNodeAttribute(n, "x", randomInt(0, 100));
    g.setNodeAttribute(n, "y", randomInt(0, 100));
  });

  return (
    <SigmaContainer
      graph={g}
      style={{ height: "100vh", width: "100%" }}
      className="border"
    >
      <Fa2 />
    </SigmaContainer>
  );
};
