import * as module from "../src/index";

const W1_START_1000 = new Date(1000, 8, 1); // Sep 1, 1000
const W1_MID_1999 = new Date(1999, 10, 14, 11, 14, 53, 496); // Sometime on Nov 14, 1999
const W1_END_2020 = new Date(2020, 11, 31, 23, 59, 59, 999); // Last ms of Dec 31, 2020
const W2_START_1000 = new Date(1001, 0, 1); // Jan 1, 1001
const W2_MID_1999 = new Date(2000, 1, 21, 17, 3, 22, 100); // Sometime on Feb 21, 2000
const W2_END_2020 = new Date(2021, 3, 30, 23, 59, 59, 999); // Last ms of Apr 30, 2021
const S1_START_1000 = new Date(1000, 4, 1); // May 1, 1000
const S1_MID_1999 = new Date(1999, 4, 7, 1, 59, 5, 892); // Sometime on May 7, 1999
const S1_END_2020 = new Date(2020, 5, 30, 23, 59, 59, 999); // Last ms of Jun 30, 2020
const S2_START_1000 = new Date(1000, 6, 1); // Jul 1, 1000
const S2_MID_1999 = new Date(1999, 7, 1, 12, 0, 0, 0); // Sometime (noon) on Aug 1, 1999
const S2_END_2020 = new Date(2020, 7, 31, 23, 59, 59, 999); // Last ms of Aug 31, 2020

describe("the getUbcTerm function", () => {
  test("should be running in America/Vancouver timezone for testing", () => {
    // As of current commit, this is set up in package.json
    // as a bash environment variable (TZ) prior to running tests.
    expect(process.env.TZ).toEqual("America/Vancouver");

    // It's tempting to set this within the tests, but see:
    // https://github.com/facebook/jest/issues/9856 for why not.
    // Short version: jest disallows mutation of process.env.
  });
  test("should be accessible in the module", () => {
    expect(module.getUbcTerm).toBeTruthy();
  });
  test.each`
    point              | ubcterm                                                       | date
    ${"at the start"}  | ${{ year: 1000, session: "W", termNum: 1 } as module.UbcTerm} | ${W1_START_1000}
    ${"in the middle"} | ${{ year: 1999, session: "W", termNum: 1 } as module.UbcTerm} | ${W1_MID_1999}
    ${"at the end"}    | ${{ year: 2020, session: "W", termNum: 1 } as module.UbcTerm} | ${W1_END_2020}
    ${"at the start"}  | ${{ year: 1000, session: "W", termNum: 2 } as module.UbcTerm} | ${W2_START_1000}
    ${"in the middle"} | ${{ year: 1999, session: "W", termNum: 2 } as module.UbcTerm} | ${W2_MID_1999}
    ${"at the end"}    | ${{ year: 2020, session: "W", termNum: 2 } as module.UbcTerm} | ${W2_END_2020}
    ${"at the start"}  | ${{ year: 1000, session: "S", termNum: 1 } as module.UbcTerm} | ${S1_START_1000}
    ${"in the middle"} | ${{ year: 1999, session: "S", termNum: 1 } as module.UbcTerm} | ${S1_MID_1999}
    ${"at the end"}    | ${{ year: 2020, session: "S", termNum: 1 } as module.UbcTerm} | ${S1_END_2020}
    ${"at the start"}  | ${{ year: 1000, session: "S", termNum: 2 } as module.UbcTerm} | ${S2_START_1000}
    ${"in the middle"} | ${{ year: 1999, session: "S", termNum: 2 } as module.UbcTerm} | ${S2_MID_1999}
    ${"at the end"}    | ${{ year: 2020, session: "S", termNum: 2 } as module.UbcTerm} | ${S2_END_2020}
  `(
    "should produce $ubcterm.session$ubcterm.termNum $point ($date)",
    ({ ubcterm, date }) => {
      expect(module.getUbcTerm(date)).toEqual(ubcterm);
    }
  );
  describe("should use the current time by default", () => {
    describe("tested via mocking, which is probably inferior to using jest.setSystemTime", () => {
      let dateSpy: jest.SpyInstance;
      beforeAll(() => {
        dateSpy = jest.spyOn(global, "Date");
      });
      beforeEach(() => {
        // Reset counters.
        dateSpy.mockClear();
      });
      afterAll(() => {
        // Return Date to its original functionality.
        dateSpy.mockRestore();
      });
      test("including using the result of 'new Date()' when called with no arguments", () => {
        const result = module.getUbcTerm();

        // new Date() should be called exactly once, with no arguments:
        expect(dateSpy).toHaveBeenCalledTimes(1);
        expect(dateSpy).toHaveBeenCalledWith();
        expect(dateSpy).toHaveReturned();

        // And the end result is the same as getUbcTerm with the explicit date
        const date = dateSpy.mock.results[0].value;
        expect(result).toEqual(module.getUbcTerm(date));
      });

      test.each`
        point              | ubcterm                                                       | date
        ${"at the start"}  | ${{ year: 1000, session: "W", termNum: 1 } as module.UbcTerm} | ${W1_START_1000}
        ${"in the middle"} | ${{ year: 1999, session: "W", termNum: 1 } as module.UbcTerm} | ${W1_MID_1999}
        ${"at the end"}    | ${{ year: 2020, session: "W", termNum: 1 } as module.UbcTerm} | ${W1_END_2020}
        ${"at the start"}  | ${{ year: 1000, session: "W", termNum: 2 } as module.UbcTerm} | ${W2_START_1000}
        ${"in the middle"} | ${{ year: 1999, session: "W", termNum: 2 } as module.UbcTerm} | ${W2_MID_1999}
        ${"at the end"}    | ${{ year: 2020, session: "W", termNum: 2 } as module.UbcTerm} | ${W2_END_2020}
        ${"at the start"}  | ${{ year: 1000, session: "S", termNum: 1 } as module.UbcTerm} | ${S1_START_1000}
        ${"in the middle"} | ${{ year: 1999, session: "S", termNum: 1 } as module.UbcTerm} | ${S1_MID_1999}
        ${"at the end"}    | ${{ year: 2020, session: "S", termNum: 1 } as module.UbcTerm} | ${S1_END_2020}
        ${"at the start"}  | ${{ year: 1000, session: "S", termNum: 2 } as module.UbcTerm} | ${S2_START_1000}
        ${"in the middle"} | ${{ year: 1999, session: "S", termNum: 2 } as module.UbcTerm} | ${S2_MID_1999}
        ${"at the end"}    | ${{ year: 2020, session: "S", termNum: 2 } as module.UbcTerm} | ${S2_END_2020}
      `(
        "producing the appropriate term: $ubcterm.session$ubcterm.termNum $point ($date)",
        ({ ubcterm, date }) => {
          dateSpy.mockImplementationOnce(() => {
            return date;
          });
          expect(module.getUbcTerm()).toEqual(ubcterm);
        }
      );
    });
    describe("tested via jest.useFakeTimers/jest.setSystemTime", () => {
      test.skip("demonstrating that fake system timers do not advance", () => {
        // Once we use fake timers, the time stops advancing automatically.
        // So, this test passes if run as is but fails if run with the
        // useFakeTimers/setSystemTime line commented out:
        jest.useFakeTimers("modern").setSystemTime(new Date(1900, 0));
        const now = new Date();

        // Waste some time.
        for (let i = 0; i < 1000000; i++) {
          if (i % 30000 == 0) {
            expect(i).toBe(i);
          }
        }

        expect(new Date()).toEqual(now);

        jest.useRealTimers();
      });
      test.each`
        point              | ubcterm                                                       | date
        ${"at the start"}  | ${{ year: 1000, session: "W", termNum: 1 } as module.UbcTerm} | ${W1_START_1000}
        ${"in the middle"} | ${{ year: 1999, session: "W", termNum: 1 } as module.UbcTerm} | ${W1_MID_1999}
        ${"at the end"}    | ${{ year: 2020, session: "W", termNum: 1 } as module.UbcTerm} | ${W1_END_2020}
        ${"at the start"}  | ${{ year: 1000, session: "W", termNum: 2 } as module.UbcTerm} | ${W2_START_1000}
        ${"in the middle"} | ${{ year: 1999, session: "W", termNum: 2 } as module.UbcTerm} | ${W2_MID_1999}
        ${"at the end"}    | ${{ year: 2020, session: "W", termNum: 2 } as module.UbcTerm} | ${W2_END_2020}
        ${"at the start"}  | ${{ year: 1000, session: "S", termNum: 1 } as module.UbcTerm} | ${S1_START_1000}
        ${"in the middle"} | ${{ year: 1999, session: "S", termNum: 1 } as module.UbcTerm} | ${S1_MID_1999}
        ${"at the end"}    | ${{ year: 2020, session: "S", termNum: 1 } as module.UbcTerm} | ${S1_END_2020}
        ${"at the start"}  | ${{ year: 1000, session: "S", termNum: 2 } as module.UbcTerm} | ${S2_START_1000}
        ${"in the middle"} | ${{ year: 1999, session: "S", termNum: 2 } as module.UbcTerm} | ${S2_MID_1999}
        ${"at the end"}    | ${{ year: 2020, session: "S", termNum: 2 } as module.UbcTerm} | ${S2_END_2020}
      `(
        "producing the appropriate term: $ubcterm.session$ubcterm.termNum $point ($date)",
        ({ ubcterm, date }) => {
          jest.useFakeTimers("modern").setSystemTime(date);
          expect(module.getUbcTerm()).toEqual(ubcterm);
          jest.useRealTimers();
        }
      );
    });
  });
});
