import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { getTraceSpanDurationMs } from "./get-trace-span-duration-ms";

describe("getTraceSpanDurationMs", () => {
  it("should return the correct duration in milliseconds", () => {
    const spanCard: TraceSpan = {
      id: "1",
      title: "Test Span",
      startTime: new Date("2023-01-01T00:00:00.000Z"),
      endTime: new Date("2023-01-01T00:00:05.500Z"),
      duration: 0,
      type: "llm_call",
      status: "success",
      cost: 0,
      raw: "",
      attributes: [],
      tokensCount: 0,
    };

    const result = getTraceSpanDurationMs(spanCard);
    expect(result).toBe(5500);
  });

  it("should return 0 when start and end times are equal", () => {
    const spanCard: TraceSpan = {
      id: "1",
      title: "Test Span",
      startTime: new Date("2023-01-01T00:00:00.000Z"),
      endTime: new Date("2023-01-01T00:00:00.000Z"),
      duration: 0,
      cost: 0,
      type: "llm_call",
      status: "success",
      raw: "",
      attributes: [],
      tokensCount: 0,
    };

    const result = getTraceSpanDurationMs(spanCard);
    expect(result).toBe(0);
  });

  it("should handle negative duration correctly", () => {
    const spanCard: TraceSpan = {
      id: "1",
      title: "Test Span",
      startTime: new Date("2023-01-01T00:05:00.000Z"),
      endTime: new Date("2023-01-01T00:00:00.000Z"),
      duration: 0,
      cost: 0,
      type: "llm_call",
      status: "success",
      raw: "",
      attributes: [],
      tokensCount: 0,
    };

    const result = getTraceSpanDurationMs(spanCard);
    expect(result).toBe(-300000);
  });
});
