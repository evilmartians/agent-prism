import { OPENTELEMETRY_GENAI_ATTRIBUTES as GENAI } from "@evilmartians/agent-prism-types";
import { describe, expect, it } from "vitest";

import { getDurationMs } from "../../common/get-duration-ms";
import {
  getTokenUsageEntries,
  getTotalCost,
  getTotalTokens,
  hasReportedCost,
} from "../../common/token-usage";
import { openTelemetrySpanAdapter } from "../adapter";
import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span";

const usageOf = (attributes: Record<string, unknown>) =>
  openTelemetrySpanAdapter.getTokenUsage(
    createMockOpenTelemetrySpan({ attributes }),
  );

describe("openTelemetrySpanAdapter.getTokenUsage", () => {
  describe("token types", () => {
    it("records input and output separately", () => {
      const usage = usageOf({
        [GENAI.USAGE_INPUT_TOKENS]: 80,
        [GENAI.USAGE_OUTPUT_TOKENS]: 40,
      });

      expect(usage?.input?.tokens).toBe(80);
      expect(usage?.output?.tokens).toBe(40);
      expect(getTotalTokens(usage)).toBe(120);
    });

    it("takes semantic-convention cache counts out of input_tokens", () => {
      const usage = usageOf({
        [GENAI.USAGE_INPUT_TOKENS]: 1000,
        [GENAI.USAGE_OUTPUT_TOKENS]: 50,
        [GENAI.USAGE_CACHE_READ_INPUT_TOKENS]: 600,
        [GENAI.USAGE_CACHE_CREATION_INPUT_TOKENS]: 100,
      });

      expect(usage?.input?.tokens).toBe(300);
      expect(usage?.cache_read?.tokens).toBe(600);
      expect(usage?.cache_write?.tokens).toBe(100);
      expect(getTotalTokens(usage)).toBe(1050);
    });

    it("keeps reasoning tokens inside output", () => {
      const usage = usageOf({
        [GENAI.USAGE_INPUT_TOKENS]: 100,
        [GENAI.USAGE_OUTPUT_TOKENS]: 700,
        [GENAI.USAGE_REASONING_OUTPUT_TOKENS]: 512,
      });

      expect(usage?.output?.tokens).toBe(700);
      expect(getTotalTokens(usage)).toBe(800);
    });

    it("keeps a zero count that was explicitly reported", () => {
      const usage = usageOf({
        [GENAI.USAGE_INPUT_TOKENS]: 0,
        [GENAI.USAGE_OUTPUT_TOKENS]: 0,
      });

      expect(usage).toBeDefined();
      expect(usage?.input?.tokens).toBe(0);
      expect(getTotalTokens(usage)).toBe(0);
    });

    it("records only the side that was reported", () => {
      const usage = usageOf({
        "gen_ai.request.model": "gpt-3.5-turbo",
        [GENAI.USAGE_INPUT_TOKENS]: 120,
        "error.type": "timeout",
      });

      expect(getTotalTokens(usage)).toBe(120);
      expect(usage?.output).toBeUndefined();
    });
  });

  describe("reported totals", () => {
    it("records total_tokens as `total` when nothing is broken down", () => {
      const usage = usageOf({ [GENAI.USAGE_TOTAL_TOKENS]: 5000 });

      expect(getTokenUsageEntries(usage)).toEqual([
        { type: "total", tokens: 5000, cost: 0 },
      ]);
    });

    it("adds nothing when total_tokens matches the typed counts", () => {
      const usage = usageOf({
        [GENAI.USAGE_TOTAL_TOKENS]: 150,
        [GENAI.USAGE_INPUT_TOKENS]: 100,
        [GENAI.USAGE_OUTPUT_TOKENS]: 50,
      });

      expect(usage?.total).toBeUndefined();
      expect(getTotalTokens(usage)).toBe(150);
    });

    it("keeps the part of total_tokens the typed counts don't cover", () => {
      const usage = usageOf({
        [GENAI.USAGE_TOTAL_TOKENS]: 200,
        [GENAI.USAGE_INPUT_TOKENS]: 100,
        [GENAI.USAGE_OUTPUT_TOKENS]: 50,
      });

      expect(usage?.total?.tokens).toBe(50);
      expect(getTotalTokens(usage)).toBe(200);
    });

    it("is undefined when the span carries no usage at all", () => {
      const usage = usageOf({});

      expect(usage).toBeUndefined();
      expect(getTotalTokens(usage)).toBe(0);
      expect(getTotalCost(usage)).toBe(0);
    });

    it("is undefined for a failed call with no usage attributes", () => {
      const usage = usageOf({
        "gen_ai.request.model": "gpt-4",
        "error.type": "rate_limit_exceeded",
        "http.status_code": 429,
      });

      expect(usage).toBeUndefined();
    });
  });

  describe("cost", () => {
    it("attaches per-side costs to the matching token types", () => {
      const usage = usageOf({
        [GENAI.USAGE_INPUT_TOKENS]: 150,
        [GENAI.USAGE_OUTPUT_TOKENS]: 75,
        [GENAI.USAGE_INPUT_COST]: 0.003,
        [GENAI.USAGE_OUTPUT_COST]: 0.0015,
      });

      expect(usage?.input?.cost).toBe(0.003);
      expect(usage?.output?.cost).toBe(0.0015);
      expect(getTotalCost(usage)).toBe(0.0045);
    });

    it("records a flat usage cost when no side costs are given", () => {
      const usage = usageOf({
        [GENAI.USAGE_INPUT_TOKENS]: 1250,
        [GENAI.USAGE_OUTPUT_TOKENS]: 380,
        [GENAI.USAGE_COST]: 0.0245,
      });

      expect(usage?.total).toEqual({ tokens: 0, cost: 0.0245 });
      expect(getTotalTokens(usage)).toBe(1630);
      expect(getTotalCost(usage)).toBe(0.0245);
    });

    it("adds nothing when the flat cost matches the side costs", () => {
      const usage = usageOf({
        [GENAI.USAGE_INPUT_COST]: 0.003,
        [GENAI.USAGE_OUTPUT_COST]: 0.0015,
        [GENAI.USAGE_COST]: 0.0045,
      });

      expect(usage?.total).toBeUndefined();
      expect(getTotalCost(usage)).toBe(0.0045);
    });

    it("reports no cost for a local model that sends none", () => {
      const usage = usageOf({
        "gen_ai.request.model": "llama-2-7b",
        [GENAI.USAGE_INPUT_TOKENS]: 200,
        [GENAI.USAGE_OUTPUT_TOKENS]: 150,
      });

      expect(getTotalCost(usage)).toBe(0);
      expect(hasReportedCost(usage)).toBe(false);
      expect(getTotalTokens(usage)).toBe(350);
    });

    it("keeps a negative cost (a credit or refund)", () => {
      const usage = usageOf({
        [GENAI.USAGE_TOTAL_TOKENS]: 100,
        [GENAI.USAGE_COST]: -5,
      });

      expect(getTotalCost(usage)).toBe(-5);
    });

    it.each([
      [0.000015, 0.000015],
      [15.75, 15.75],
      [0, 0],
    ])("keeps a flat cost of %s as is", (cost, expected) => {
      expect(getTotalCost(usageOf({ [GENAI.USAGE_COST]: cost }))).toBe(
        expected,
      );
    });
  });

  describe("malformed attribute values", () => {
    it.each([
      ["a string", "150"],
      ["a boolean", true],
      ["an array", ["150", "200"]],
      ["null", null],
    ])("ignores %s where a token count is expected", (_label, value) => {
      const usage = usageOf({
        [GENAI.USAGE_TOTAL_TOKENS]: value,
        [GENAI.USAGE_INPUT_TOKENS]: 80,
        [GENAI.USAGE_OUTPUT_TOKENS]: 70,
      });

      expect(usage?.total).toBeUndefined();
      expect(getTotalTokens(usage)).toBe(150);
    });

    it.each([
      ["NaN", Number.NaN],
      ["Infinity", Number.POSITIVE_INFINITY],
      ["-Infinity", Number.NEGATIVE_INFINITY],
      ["a string", "0.0045"],
      ["a boolean", true],
    ])("does not let %s poison the cost", (_label, value) => {
      const usage = usageOf({
        [GENAI.USAGE_TOTAL_TOKENS]: 100,
        [GENAI.USAGE_COST]: value,
      });

      expect(getTotalCost(usage)).toBe(0);
    });
  });
});

describe("openTelemetrySpanAdapter.getTraceReasoning", () => {
  const reasoningOf = (attributes: Record<string, unknown>) =>
    openTelemetrySpanAdapter.getTraceReasoning(
      createMockOpenTelemetrySpan({ attributes }),
    );

  it("is undefined when the span reports no reasoning tokens", () => {
    expect(reasoningOf({ "gen_ai.request.model": "gpt-4" })).toBeUndefined();
    expect(
      reasoningOf({ [GENAI.USAGE_REASONING_OUTPUT_TOKENS]: 0 }),
    ).toBeUndefined();
  });

  it("reads reasoning tokens reported without the text", () => {
    expect(reasoningOf({ [GENAI.USAGE_REASONING_OUTPUT_TOKENS]: 512 })).toEqual(
      { content: "", tokens: 512 },
    );
  });
});

describe("openTelemetrySpanAdapter.convertRawSpanToTraceSpan", () => {
  it("builds a span whose derived values come from the source", () => {
    const source = createMockOpenTelemetrySpan({
      duration: [2, 500_000_000],
      attributes: {
        [GENAI.USAGE_INPUT_TOKENS]: 100,
        [GENAI.USAGE_OUTPUT_TOKENS]: 40,
        [GENAI.USAGE_COST]: 0.002,
        [GENAI.USAGE_REASONING_OUTPUT_TOKENS]: 30,
      },
    });

    const span = openTelemetrySpanAdapter.convertRawSpanToTraceSpan(source);

    expect(getDurationMs(span)).toBe(2500);
    expect(getTotalTokens(span.tokenUsage)).toBe(140);
    expect(getTotalCost(span.tokenUsage)).toBe(0.002);
    expect(span.reasoning).toEqual({ content: "", tokens: 30 });
    expect(span.todos).toBeUndefined();
    expect(span.raw).toEqual([JSON.stringify(source, null, 2)]);
  });
});
