import { fixtureDetail1 } from "./fixture";
import { toGraph } from "./util";
describe("detail", () => {
  it("aaa", async () => {
    const { uid, g, knowdes } = fixtureDetail1;
    const { nodes, edges } = g;

    const _id = uid.replaceAll(/-/g, "");
    const a = edges.filter((e) => {
      return e.source === _id;
    });

    const cvt = toGraph(g);
    // console.log(a);
    // console.log(knowdes[uid]);
    // const id = "d9442f16-504e-4284-bac1-cc0be01b812f";
    // expect(fixtureDetail1).toMatchObject({ uid: id });
    expect(0).toBe(0);
  });
});
