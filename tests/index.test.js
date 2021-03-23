import * as UbcTerm from "index";

describe("this bogus testing unit", () => {
  test("to pass automatically", () => {
    expect(1).toBe(1);
  });
  test("to access stuff from UbcTerm"),
    () => {
      expect(UbcTerm.getUbcTerm).toBeTruthy();
    };
});
