import { toGraph } from ".";
import { fixtureDetail1 } from "../fixture";

describe("graph arrange", () => {
  it("toDisplayGraph", () => {
    const { g, knowdes } = fixtureDetail1;
    const G = toGraph(g);

    // console.log({ G });
  });
});
