import { DirectedGraph } from "graphology";
import { ladder } from "graphology-generators/classic";
import { eqEdgeType, pathsToEnd, pred, succ } from ".";

function fixture() {
  // 0→1→2
  // ↓ ↓ ↓
  // 1→3→5
  const g = ladder(DirectedGraph, 3);
  g.edges().forEach((e) => {
    g.setEdgeAttribute(e, "etype", "below");
  });
  return g;
}

describe("グラフユーティリティ", () => {
  it("succ", () => {
    expect(succ(fixture(), "0", eqEdgeType("below"))).to.members(["1", "3"]);
    expect(succ(fixture(), "5", eqEdgeType("below"))).to.members([]);
    expect(succ(fixture(), "0", eqEdgeType("to"))).toEqual([]);
  });
  it("pred", () => {
    expect(pred(fixture(), "5", eqEdgeType("below"))).to.members(["2", "4"]);
    expect(pred(fixture(), "0", eqEdgeType("below"))).to.members([]);
  });

  it("succ pathsToEnd", () => {
    expect(pathsToEnd(fixture(), "0", eqEdgeType("below"), succ)).toEqual([
      ["0", "1", "2", "5"],
      ["0", "1", "4", "5"],
      ["0", "3", "4", "5"],
    ]);
    expect(pathsToEnd(fixture(), "1", eqEdgeType("below"), succ)).toEqual([
      ["1", "2", "5"],
      ["1", "4", "5"],
    ]);
    expect(pathsToEnd(fixture(), "5", eqEdgeType("below"), succ)).toEqual([]);
  });
});
