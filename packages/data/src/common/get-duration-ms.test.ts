import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { getDurationMs } from "./get-duration-ms.js";

describe("getDurationMs", () => {
  it("should return the correct duration in milliseconds", () => {
    const spanCard: TraceSpan = {
      attributes: [],
      endTime: new Date("2023-01-01T00:00:05.500Z"),
      id: "1",
      raw: [],
      startTime: new Date("2023-01-01T00:00:00.000Z"),
      status: "success",
      title: "Test Span",
      tokenUsage: { total: { cost: 0, tokens: 0 } },
      type: "llm_call",
    };

    const result = getDurationMs(spanCard);
    expect(result).toBe(5500);
  });

  it("should return 0 when start and end times are equal", () => {
    const spanCard: TraceSpan = {
      attributes: [],
      endTime: new Date("2023-01-01T00:00:00.000Z"),
      id: "1",
      raw: [],
      startTime: new Date("2023-01-01T00:00:00.000Z"),
      status: "success",
      title: "Test Span",
      tokenUsage: { total: { cost: 0, tokens: 0 } },
      type: "llm_call",
    };

    const result = getDurationMs(spanCard);
    expect(result).toBe(0);
  });

  it("should handle negative duration correctly", () => {
    const spanCard: TraceSpan = {
      attributes: [],
      endTime: new Date("2023-01-01T00:00:00.000Z"),
      id: "1",
      raw: [],
      startTime: new Date("2023-01-01T00:05:00.000Z"),
      status: "success",
      title: "Test Span",
      tokenUsage: { total: { cost: 0, tokens: 0 } },
      type: "llm_call",
    };

    const result = getDurationMs(spanCard);
    expect(result).toBe(-300000);
  });
});
