import { fixtureDetail1 } from "./fixture";

describe("detail", () => {
  it("aaa", async () => {
    const id = "d9442f16-504e-4284-bac1-cc0be01b812f";

    expect(fixtureDetail1).toMatchObject({ uid: id });
  });
});
