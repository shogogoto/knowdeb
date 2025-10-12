import { toGraph } from "~/shared/lib/network";
import { resourceDetailFiture } from "./fixture";

describe("ResourceDetail", () => {
  it("get head tree", () => {
    const { g, uids, terms } = resourceDetailFiture;
    // const { nodes, edges } = network.g;
    //
    // // for (const node of nodes) {
    // //   console.log(node.id);
    // // }
    //
    // const duplicateNodeIds = findDuplicateNodeIds(nodes, "id");
    //
    const graph = toGraph(g);

    graph.nodes().forEach((n) => {
      // const node = graph.getNodeAttribute(n, "id");
      console.log(n);
    });

    expect(true).toBe(true);
  });
});
