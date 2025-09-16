import { describe, expect, it } from "vitest";

import { openTelemetrySpanAdapter } from "../adapter";

describe("openTelemetrySpanAdapter.convertNanoTimestampToDate", () => {
  it("should convert nanosecond timestamp string to a Date object", () => {
    const nanoString = "1697097600500000000"; // 1697097600 seconds and 500ms in nanoseconds

    const date =
      openTelemetrySpanAdapter.convertNanoTimestampToDate(nanoString);

    expect(date).toBeInstanceOf(Date);
    expect(date.getTime()).toBe(1697097600500); // Validate correct timestamp in milliseconds
  });

  it("should handle timestamps with only seconds (no nanoseconds)", () => {
    const nanoString = "1697097600000000000"; // 1697097600 seconds in nanoseconds

    const date =
      openTelemetrySpanAdapter.convertNanoTimestampToDate(nanoString);

    expect(date).toBeInstanceOf(Date);
    expect(date.getTime()).toBe(1697097600000);
  });

  it("should handle timestamps with only nanoseconds (no full seconds)", () => {
    const nanoString = "500000000"; // 0 seconds and 500ms in nanoseconds

    const date =
      openTelemetrySpanAdapter.convertNanoTimestampToDate(nanoString);

    expect(date).toBeInstanceOf(Date);
    expect(date.getTime()).toBe(500);
  });

  it("should handle timestamps with zero seconds and zero nanoseconds", () => {
    const nanoString = "0"; // 0 nanoseconds

    const date =
      openTelemetrySpanAdapter.convertNanoTimestampToDate(nanoString);

    expect(date).toBeInstanceOf(Date);
    expect(date.getTime()).toBe(0);
  });
});
