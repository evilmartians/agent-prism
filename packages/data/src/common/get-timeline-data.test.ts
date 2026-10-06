import { describe, expect, it } from "vitest";

import { getTimelineData } from "./get-timeline-data.js";
import { createTestSpan } from "./test-utils/create-test-span.js";

const MIN_START = Date.UTC(2023, 9, 1, 10);

describe("getTimelineData", () => {
  it.each([
    ["a span inside the range", 0, 30_000, 60_000, 30_000, 0, 50],
    [
      "a span that starts after the range start",
      30_000,
      45_000,
      60_000,
      15_000,
      50,
      25,
    ],
    [
      "a span that ends before the range end",
      0,
      20_000,
      60_000,
      20_000,
      0,
      (1 / 3) * 100,
    ],
    ["a very short span", 0, 1, 1000, 1, 0, 0.1],
    ["a very long span", 0, 59_000, 60_000, 59_000, 0, (59 / 60) * 100],
    ["a span covering the whole range", 0, 60_000, 60_000, 60_000, 0, 100],
    ["a zero-length span at the range start", 0, 0, 1000, 0, 0, 0],
    [
      "a span a quarter into the range",
      15_000,
      20_000,
      60_000,
      5000,
      25,
      (1 / 12) * 100,
    ],
    [
      "a span three quarters into the range",
      45_000,
      50_000,
      60_000,
      5000,
      75,
      (1 / 12) * 100,
    ],
    ["a span a tenth of the range wide", 0, 6000, 60_000, 6000, 0, 10],
    ["a span a fifth of the range wide", 0, 12_000, 60_000, 12_000, 0, 20],
    ["a 100ms span in a one-second range", 0, 100, 1000, 100, 0, 10],
    ["a 100ms span in a 200ms range", 0, 100, 200, 100, 0, 50],
    [
      "a five-minute span in an hour",
      0,
      300_000,
      3_600_000,
      300_000,
      0,
      (1 / 12) * 100,
    ],
    ["a 1ms span in a 10ms range", 0, 1, 10, 1, 0, 10],
    ["a span as long as a one-second range", 0, 1000, 1000, 1000, 0, 100],
  ])(
    "places %s",
    (_label, start, end, range, durationMs, startPercent, widthPercent) => {
      expect(
        getTimelineData({
          maxEnd: MIN_START + range,
          minStart: MIN_START,
          spanCard: createTestSpan({
            endTime: new Date(MIN_START + end),
            startTime: new Date(MIN_START + start),
          }),
        }),
      ).toStrictEqual({ durationMs, startPercent, widthPercent });
    },
  );
});
