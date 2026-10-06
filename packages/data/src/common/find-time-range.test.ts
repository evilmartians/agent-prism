import { describe, expect, it } from "vitest";

import { findTimeRange } from "./find-time-range.js";
import { createTestSpan } from "./test-utils/create-test-span.js";

const span = (id: string, startTime: string, endTime: string) =>
  createTestSpan({
    endTime: new Date(endTime),
    id,
    startTime: new Date(startTime),
  });

describe("findTimeRange", () => {
  it("should return minStart and maxEnd for a single card", () => {
    expect(
      findTimeRange([
        span("1", "2023-10-01T10:00:00.000Z", "2023-10-01T12:00:00.000Z"),
      ]),
    ).toStrictEqual({
      maxEnd: Date.parse("2023-10-01T12:00:00.000Z"),
      minStart: Date.parse("2023-10-01T10:00:00.000Z"),
    });
  });

  it("should return minStart and maxEnd for multiple cards", () => {
    expect(
      findTimeRange([
        span("1", "2023-10-01T10:00:00.000Z", "2023-10-01T12:00:00.000Z"),
        span("2", "2023-10-01T09:00:00.000Z", "2023-10-01T11:00:00.000Z"),
        span("3", "2023-10-01T11:30:00.000Z", "2023-10-01T13:00:00.000Z"),
      ]),
    ).toStrictEqual({
      maxEnd: Date.parse("2023-10-01T13:00:00.000Z"),
      minStart: Date.parse("2023-10-01T09:00:00.000Z"),
    });
  });

  it("should return Infinity and -Infinity for an empty array", () => {
    expect(findTimeRange([])).toStrictEqual({
      maxEnd: -Infinity,
      minStart: Infinity,
    });
  });
});
