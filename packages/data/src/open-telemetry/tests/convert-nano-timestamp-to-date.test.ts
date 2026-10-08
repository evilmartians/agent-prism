import { describe, expect, it } from "vitest";

import { convertNanoTimestampToDate } from "../utils/convert-nano-timestamp-to-date.js";

describe("convertNanoTimestampToDate", () => {
  it("should convert nanosecond timestamp string to a Date object", () => {
    const nanoString = "1697097600500000000";

    const date = convertNanoTimestampToDate(nanoString);

    expect(date).toBeInstanceOf(Date);
    expect(date.getTime()).toBe(1697097600500);
  });

  it("should convert a nanosecond timestamp given as a number", () => {
    const date = convertNanoTimestampToDate(1_697_097_600_500_000_000);

    expect(date.getTime()).toBe(1697097600500);
  });

  it("should handle timestamps with only seconds (no nanoseconds)", () => {
    const nanoString = "1697097600000000000";

    const date = convertNanoTimestampToDate(nanoString);

    expect(date).toBeInstanceOf(Date);
    expect(date.getTime()).toBe(1697097600000);
  });

  it("should handle timestamps with only nanoseconds (no full seconds)", () => {
    const nanoString = "500000000";

    const date = convertNanoTimestampToDate(nanoString);

    expect(date).toBeInstanceOf(Date);
    expect(date.getTime()).toBe(500);
  });

  it("should handle timestamps with zero seconds and zero nanoseconds", () => {
    const nanoString = "0";

    const date = convertNanoTimestampToDate(nanoString);

    expect(date).toBeInstanceOf(Date);
    expect(date.getTime()).toBe(0);
  });
});
