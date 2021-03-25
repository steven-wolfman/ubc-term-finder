import * as module from "../src/index";

describe("the getUbcTerm function", () => {
  test("should be accessible in the module", () => {
    expect(module.getUbcTerm).toBeTruthy();
  });
  test("should produce W1 on boundaries and at an internal point", () => {
    const W1_START_1000 = new Date(1000, 8, 1); // Sep 1, 1000
    const W1_MID_1999 = new Date(1999, 10, 14, 11, 14, 53, 496); // Sometime on Nov 14, 1999
    const W1_END_2020 = new Date(2020, 11, 31, 23, 59, 59, 999); // Last ms of Dec 31, 2020
    expect(module.getUbcTerm(W1_START_1000)).toEqual({
      year: 1000,
      session: "W",
      term: 1,
    });
    expect(module.getUbcTerm(W1_MID_1999)).toEqual({
      year: 1999,
      session: "W",
      term: 1,
    });
    expect(module.getUbcTerm(W1_END_2020)).toEqual({
      year: 2020,
      session: "W",
      term: 1,
    });
  });
  test.todo(
    "should produce W2 on boundaries and at an internal point, with appropriate year"
  );
  test.todo("should produce S1 on boundaries and at an internal point");
  test.todo("should produce S2 on boundaries and at an internal point");
  test.todo("should use the current time (per new Date()) by default");
});
