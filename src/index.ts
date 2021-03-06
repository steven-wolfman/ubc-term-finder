/**
 * A full term specification for UBC: the academic (not necessarily calendar) year, the session, and the term.
 *
 * Only terms starting May of the year 1000 (1000S1) are supported. UBC was totally not open before then.
 */
export interface UbcTerm {
  /**
   * The year, must be an integer >= 1000.
   * Note that at UBC, January of 2021 is in the 2020 year
   * (in Term 2 of the Winter session).
   */
  year: number;

  /** One of Winter (W) or Summer (S) */
  session: "W" | "S";

  /**
   * Term 1 or Term 2.
   * This may be expanded in future to handle cross-term, self-paced,
   * and other term arrangements.
   */
  termNum: 1 | 2;
}

/**
 * Find the UBC term (year, session, term number) of the given date.
 *
 * Assumes: UBC Winter term 1 of a year starts Sep 1 of that year, UBC Winter term 2 starts Jan 1 of the following year. Summer term 1 starts May 1 of its year. Summer term 2 starts July 1 of its year.
 *
 * Known issue: Relies purely on the month in whatever
 * local timezone it is run on, which will incorrectly
 *
 * @param {Date} [date=now (new Date())] date for which to check the term. Must be a date corresponding to UBC term 1000S1 or after.
 * @returns {Date} the term of the provided date.
 */
export function getUbcTerm(date: Date = new Date()): UbcTerm {
  // Choose the term based on the ZERO-BASED month number
  switch (date.getMonth()) {
    case 0:
    case 1:
    case 2:
    case 3:
      return {
        // At UBC, 2020W2 is in the calendar year 2021.
        year: date.getFullYear() - 1,
        session: "W",
        termNum: 2,
      };
    case 4:
    case 5:
      return {
        year: date.getFullYear(),
        session: "S",
        termNum: 1,
      };
    case 6:
    case 7:
      return {
        year: date.getFullYear(),
        session: "S",
        termNum: 2,
      };
    case 8:
    case 9:
    case 10:
    case 11:
      return {
        year: date.getFullYear(),
        session: "W",
        termNum: 1,
      };
    default:
      throw new Error(
        `received month value "${date.getMonth()}", which is outside the allowable range [0, 11]`
      );
  }
}
