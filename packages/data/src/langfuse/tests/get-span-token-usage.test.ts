import type { LangfuseObservation } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { getDurationMs } from "../../common/get-duration-ms";
import {
  getTokenUsageEntries,
  getTotalCost,
  getTotalTokens,
} from "../../common/token-usage";
import { langfuseSpanAdapter } from "../adapter";
import { createMockLangfuseObservation } from "../utils/create-mock-langfuse-observation";

const observation = (
  overrides: Partial<LangfuseObservation>,
): LangfuseObservation => ({
  ...createMockLangfuseObservation(),
  ...overrides,
});

describe("langfuseSpanAdapter.getTokenUsage", () => {
  it("records each usage type with its cost", () => {
    const usage = langfuseSpanAdapter.getTokenUsage(
      observation({
        usageDetails: { input: 1115, output: 101, total: 1216 },
        costDetails: { input: 0.00139375, output: 0.00101, total: 0.00240375 },
      }),
    );

    expect(getTokenUsageEntries(usage)).toEqual([
      { type: "input", tokens: 1115, cost: 0.00139375 },
      { type: "output", tokens: 101, cost: 0.00101 },
    ]);
    expect(getTotalTokens(usage)).toBe(1216);
    expect(getTotalCost(usage)).toBe(0.00240375);
  });

  it("maps cached input to cache_read and folds reasoning back into output", () => {
    const usage = langfuseSpanAdapter.getTokenUsage(
      observation({
        usageDetails: {
          input: 200,
          input_cached_tokens: 800,
          output: 100,
          output_reasoning_tokens: 400,
          total: 1500,
        },
      }),
    );

    expect(usage?.cache_read?.tokens).toBe(800);
    expect(usage?.output?.tokens).toBe(500);
    expect(getTotalTokens(usage)).toBe(1500);
  });

  it("falls back to the totals when nothing is broken down", () => {
    const usage = langfuseSpanAdapter.getTokenUsage(
      observation({
        usageDetails: { total: 300 },
        costDetails: { total: 0.01 },
      }),
    );

    expect(getTokenUsageEntries(usage)).toEqual([
      { type: "total", tokens: 300, cost: 0.01 },
    ]);
  });

  it("reads the flat usage and cost fields when the details are missing", () => {
    const usage = langfuseSpanAdapter.getTokenUsage(
      observation({
        usageDetails: null,
        costDetails: undefined,
        inputUsage: 100,
        outputUsage: 20,
        totalUsage: 120,
        inputCost: 0.001,
        outputCost: 0.002,
        totalCost: 0.003,
      }),
    );

    expect(getTokenUsageEntries(usage)).toEqual([
      { type: "input", tokens: 100, cost: 0.001 },
      { type: "output", tokens: 20, cost: 0.002 },
    ]);
  });

  it("uses a flat total when that is all there is", () => {
    const usage = langfuseSpanAdapter.getTokenUsage(
      observation({ costDetails: null, totalCost: 0.05 }),
    );

    expect(getTokenUsageEntries(usage)).toEqual([
      { type: "total", tokens: 0, cost: 0.05 },
    ]);
  });

  it("ignores the flat fields when the details are present", () => {
    const usage = langfuseSpanAdapter.getTokenUsage(
      observation({
        usageDetails: { input: 1115, output: 101, total: 1216 },
        costDetails: { input: 0.00139375, output: 0.00101, total: 0.00240375 },
        inputUsage: 1115,
        outputUsage: 101,
        totalUsage: 1216,
        inputCost: 0.00139375,
        outputCost: 0.00101,
        totalCost: 0.00240375,
      }),
    );

    expect(getTotalTokens(usage)).toBe(1216);
    expect(getTotalCost(usage)).toBe(0.00240375);
  });

  it("is undefined for an observation without usage", () => {
    // Langfuse fills the flat fields with 0 or null when the details are empty.
    expect(
      langfuseSpanAdapter.getTokenUsage(
        observation({
          usageDetails: {},
          costDetails: {},
          inputUsage: 0,
          outputUsage: 0,
          totalUsage: 0,
          inputCost: null,
          outputCost: null,
          totalCost: 0,
        }),
      ),
    ).toBeUndefined();
  });
});

describe("langfuseSpanAdapter.convertRawSpanToTraceSpan", () => {
  it("gives a still-running observation (null endTime) zero duration", () => {
    const span = langfuseSpanAdapter.convertRawSpanToTraceSpan(
      observation({ startTime: "2024-01-01T00:00:00.000Z", endTime: null }),
    );

    expect(span.endTime).toEqual(new Date("2024-01-01T00:00:00.000Z"));
    expect(getDurationMs(span)).toBe(0);
  });
});

describe("langfuseSpanAdapter.getTraceReasoning", () => {
  it("reports reasoning tokens without text", () => {
    expect(
      langfuseSpanAdapter.getTraceReasoning(
        observation({
          usageDetails: { output: 100, output_reasoning_tokens: 64 },
        }),
      ),
    ).toEqual({ content: "", tokens: 64 });
  });

  it("is undefined when no reasoning tokens were spent", () => {
    expect(
      langfuseSpanAdapter.getTraceReasoning(
        observation({ usageDetails: { output: 100 } }),
      ),
    ).toBeUndefined();
  });
});
