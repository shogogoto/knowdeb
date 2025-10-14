import type Graph from "graphology";
import { eqEdgeType, pathsToEnd, succ } from "~/shared/lib/network";

export function toTree(g: Graph, root: string) {
  const tops = succ(g, root, eqEdgeType("below"));
  for (const head of tops) {
    const sib_paths = pathsToEnd(g, head, eqEdgeType("sibling"), succ);
    // const heads2 = succ(g, root, eqEdgeType("below"));
    for (const sib_path of sib_paths) {
    }
  }
  return tops.map((head) => {
    const sib_paths = pathsToEnd(g, head, eqEdgeType("sibling"), succ);
    return {
      // [head]: ,
    };
  });
}
