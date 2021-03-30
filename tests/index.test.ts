import * as module from "../src/index";

describe("the getUbcTerm function", () => {
  test("should be accessible in the module", () => {
    expect(module.getUbcTerm).toBeTruthy();
  });
  describe("should produce W1", () => {
    const W1_START_1000 = new Date(1000, 8, 1); // Sep 1, 1000
    const W1_MID_1999 = new Date(1999, 10, 14, 11, 14, 53, 496); // Sometime on Nov 14, 1999
    const W1_END_2020 = new Date(2020, 11, 31, 23, 59, 59, 999); // Last ms of Dec 31, 2020
    test("at the starting boundary", () => {
      expect(module.getUbcTerm(W1_START_1000)).toEqual({
        year: 1000,
        session: "W",
        term: 1,
      });
    });
    test("at an internal point", () => {
      expect(module.getUbcTerm(W1_MID_1999)).toEqual({
        year: 1999,
        session: "W",
        term: 1,
      });
    });
    test("at the ending boundary", () => {
      expect(module.getUbcTerm(W1_END_2020)).toEqual({
        year: 2020,
        session: "W",
        term: 1,
      });
    });
  });
  describe("should produce W2", () => {
    const W2_START_1000 = new Date(1001, 0, 1); // Jan 1, 1001
    const W2_MID_1999 = new Date(2000, 1, 21, 17, 3, 22, 100); // Sometime on Feb 21, 2000
    const W2_END_2020 = new Date(2021, 3, 30, 23, 59, 59, 999); // Last ms of Apr 30, 2021
    test("at the starting boundary", () => {
      expect(module.getUbcTerm(W2_START_1000)).toEqual({
        year: 1000,
        session: "W",
        term: 2,
      });
    });
    test("at an internal point", () => {
      expect(module.getUbcTerm(W2_MID_1999)).toEqual({
        year: 1999,
        session: "W",
        term: 2,
      });
    });
    test("at the ending boundary", () => {
      expect(module.getUbcTerm(W2_END_2020)).toEqual({
        year: 2020,
        session: "W",
        term: 2,
      });
    });
  });
  describe("should produce S1", () => {
    const S1_START_1000 = new Date(1000, 4, 1); // May 1, 1000
    const S1_MID_1999 = new Date(1999, 4, 7, 1, 59, 5, 892); // Sometime on May 7, 1999
    const S1_END_2020 = new Date(2020, 5, 30, 23, 59, 59, 999); // Last ms of Jun 30, 2020
    test("at the starting boundary", () => {
      expect(module.getUbcTerm(S1_START_1000)).toEqual({
        year: 1000,
        session: "S",
        term: 1,
      });
    });
    test("at an internal point", () => {
      expect(module.getUbcTerm(S1_MID_1999)).toEqual({
        year: 1999,
        session: "S",
        term: 1,
      });
    });
    test("at the ending boundary", () => {
      expect(module.getUbcTerm(S1_END_2020)).toEqual({
        year: 2020,
        session: "S",
        term: 1,
      });
    });
  });
  describe("should produce S2", () => {
    const S2_START_1000 = new Date(1000, 6, 1); // Jul 1, 1000
    const S2_MID_1999 = new Date(1999, 7, 1, 12, 0, 0, 0); // Sometime (noon) on Aug 1, 1999
    const S2_END_2020 = new Date(2020, 7, 31, 23, 59, 59, 999); // Last ms of Aug 31, 2020
    test("at the starting boundary", () => {
      expect(module.getUbcTerm(S2_START_1000)).toEqual({
        year: 1000,
        session: "S",
        term: 2,
      });
    });
    test("at an internal point", () => {
      expect(module.getUbcTerm(S2_MID_1999)).toEqual({
        year: 1999,
        session: "S",
        term: 2,
      });
    });
    test("at the ending boundary", () => {
      expect(module.getUbcTerm(S2_END_2020)).toEqual({
        year: 2020,
        session: "S",
        term: 2,
      });
    });
  });
  test.todo("should use the current time (per new Date()) by default");
});
