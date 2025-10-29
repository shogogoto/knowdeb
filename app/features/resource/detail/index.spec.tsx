import { toGraph } from "~/shared/lib/network";
import { resourceDetailFiture } from "./fixture";
import { toAdjacent } from "./util";

const { g, resource_info, uids, terms } = resourceDetailFiture;
const G = toGraph(g);

describe("ResourceDetail", () => {
  it("関係の周辺", () => {
    const id = "e4254a62-74cd-46d2-9d75-2e69a717c2ec";
    const adj = toAdjacent(id, G, uids, terms);
    expect(adj.kn.term?.names?.[0]).toBe("デイヴィッド・チャーマーズ");
    expect(adj.kn.sentence).toBe("28歳でクオリアが原理的に解明されない");
    expect(adj.premises()).toHaveLength(0);
    expect(adj.siblings()).toHaveLength(0); // 他の関係は省略
  });

  it("downArrays", () => {
    const rootId = resource_info.resource.uid;
    const adj = toAdjacent(rootId, G, uids, terms);
    const arrs = adj.downArrays();
    expect(arrs[0]).toHaveLength(1); // 兄弟なし
    expect(arrs[1]).toHaveLength(3); // 3兄弟
  });
});
