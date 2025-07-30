import { fixtureDetail1 } from "./fixture";

describe("detail", () => {
  it("aaa", async () => {
    const id = "ddeebd6f-8550-4839-96a4-7adf75df8622";

    expect(fixtureDetail1).toMatchObject({ uid: id });
  });
});
