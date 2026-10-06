import { describe, expect, it } from "vitest";

import { getDurationMs } from "./get-duration-ms.js";
import { createTestSpan } from "./test-utils/create-test-span.js";

describe("getDurationMs", () => {
  it.each([
    ["the duration in milliseconds", "00:00:00.000", "00:00:05.500", 5500],
    ["0 when start and end times are equal", "00:00:00.000", "00:00:00.000", 0],
    ["a negative duration as is", "00:05:00.000", "00:00:00.000", -300_000],
  ])("returns %s", (_label, start, end, expected) => {
    expect(
      getDurationMs(
        createTestSpan({
          endTime: new Date(`2023-01-01T${end}Z`),
          startTime: new Date(`2023-01-01T${start}Z`),
        }),
      ),
    ).toBe(expected);
  });
});
