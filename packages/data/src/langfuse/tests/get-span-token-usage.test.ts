import type {
  DeepReadonly,
  LangfuseObservation,
} from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { getDurationMs } from "../../common/get-duration-ms.js";
import { isLangfuseDocument } from "../../common/is-trace-document.js";
import {
  getTokenUsageEntries,
  getTotalCost,
  getTotalTokens,
} from "../../common/token-usage.js";
import { langfuseSpanAdapter } from "../adapter.js";
import { createMockLangfuseObservation } from "../utils/create-mock-langfuse-observation.js";

const observation = (
  overrides: DeepReadonly<Partial<LangfuseObservation>>,
): DeepReadonly<LangfuseObservation> => ({
  ...createMockLangfuseObservation(),
  ...overrides,
});

describe("langfuseSpanAdapter.getTokenUsage", () => {
  it("records each usage type with its cost", () => {
    const usage = langfuseSpanAdapter.getTokenUsage(
      observation({
        costDetails: { input: 0.00139375, output: 0.00101, total: 0.00240375 },
        usageDetails: { input: 1115, output: 101, total: 1216 },
      }),
    );

    expect(getTokenUsageEntries(usage)).toStrictEqual([
      { cost: 0.00139375, tokens: 1115, type: "input" },
      { cost: 0.00101, tokens: 101, type: "output" },
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
        costDetails: { total: 0.01 },
        usageDetails: { total: 300 },
      }),
    );

    expect(getTokenUsageEntries(usage)).toStrictEqual([
      { cost: 0.01, tokens: 300, type: "total" },
    ]);
  });

  it("reads the flat usage and cost fields when the details are missing", () => {
    const usage = langfuseSpanAdapter.getTokenUsage(
      observation({
        inputCost: 0.001,
        inputUsage: 100,
        outputCost: 0.002,
        outputUsage: 20,
        totalCost: 0.003,
        totalUsage: 120,
        usageDetails: null,
      }),
    );

    expect(getTokenUsageEntries(usage)).toStrictEqual([
      { cost: 0.001, tokens: 100, type: "input" },
      { cost: 0.002, tokens: 20, type: "output" },
    ]);
  });

  it("uses a flat total when that is all there is", () => {
    const usage = langfuseSpanAdapter.getTokenUsage(
      observation({ costDetails: null, totalCost: 0.05 }),
    );

    expect(getTokenUsageEntries(usage)).toStrictEqual([
      { cost: 0.05, tokens: 0, type: "total" },
    ]);
  });

  it("ignores the flat fields when the details are present", () => {
    const usage = langfuseSpanAdapter.getTokenUsage(
      observation({
        costDetails: { input: 0.00139375, output: 0.00101, total: 0.00240375 },
        inputCost: 0.00139375,
        inputUsage: 1115,
        outputCost: 0.00101,
        outputUsage: 101,
        totalCost: 0.00240375,
        totalUsage: 1216,
        usageDetails: { input: 1115, output: 101, total: 1216 },
      }),
    );

    expect(getTotalTokens(usage)).toBe(1216);
    expect(getTotalCost(usage)).toBe(0.00240375);
  });

  it("is undefined when Langfuse fills the flat fields with 0 or null", () => {
    expect(
      langfuseSpanAdapter.getTokenUsage(
        observation({
          costDetails: {},
          inputCost: null,
          inputUsage: 0,
          outputCost: null,
          outputUsage: 0,
          totalCost: 0,
          totalUsage: 0,
          usageDetails: {},
        }),
      ),
    ).toBeUndefined();
  });
});

describe("langfuseSpanAdapter.convertRawSpanToTraceSpan", () => {
  it("gives a still-running observation (null endTime) zero duration", () => {
    const span = langfuseSpanAdapter.convertRawSpanToTraceSpan(
      observation({ endTime: null, startTime: "2024-01-01T00:00:00.000Z" }),
    );

    expect(span.endTime).toStrictEqual(new Date("2024-01-01T00:00:00.000Z"));
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
    ).toStrictEqual({ content: "", tokens: 64 });
  });

  it("is undefined when no reasoning tokens were spent", () => {
    expect(
      langfuseSpanAdapter.getTraceReasoning(
        observation({ usageDetails: { output: 100 } }),
      ),
    ).toBeUndefined();
  });

  it("is undefined when an uploaded export has null reasoning tokens", () => {
    const upload: unknown = {
      observations: [
        {
          ...observation({}),
          usageDetails: { output: 100, output_reasoning_tokens: null },
        },
      ],
    };

    if (!isLangfuseDocument(upload)) throw new TypeError("not Langfuse");

    expect(
      langfuseSpanAdapter.convertRawDocumentsToSpans(upload)[0]?.reasoning,
    ).toBeUndefined();
  });
});
