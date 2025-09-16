import { OPENTELEMETRY_GENAI_ATTRIBUTES } from "@evilmartians/agent-prism-types";
import { describe, it, expect } from "vitest";

import { openTelemetrySpanAdapter } from "../adapter";
import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span";

describe("openTelemetrySpanAdapter.getSpanCost", () => {
  describe("valid number costs", () => {
    it("should return cost when available as positive number", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: 0.0045 },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0.0045);
    });

    it("should return zero cost when cost is 0", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: 0 },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0);
    });

    it("should handle small decimal costs", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: 0.000123 },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0.000123);
    });

    it("should handle large costs", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: 15.75 },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(15.75);
    });

    it("should handle negative costs", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: -5.0 }, // Credits or refunds?
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(-5.0);
    });
  });

  describe("invalid cost types", () => {
    it("should return 0 when cost is undefined", () => {
      const span = createMockOpenTelemetrySpan({
        // No cost attribute
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0);
    });

    it("should return 0 when cost is null", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: null },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0);
    });

    it("should return 0 when cost is a string", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: "0.0045" },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0);
    });

    it("should return 0 when cost is a boolean", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: true },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0);
    });

    it("should return 0 when cost is an array", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: [0.0045, 0.0023],
        },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0);
    });

    it("should return 0 when cost is an object", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: {
            amount: 0.0045,
            currency: "USD",
          },
        },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0);
    });
  });

  describe("edge cases with numbers", () => {
    it("should handle NaN", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: NaN },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBeNaN(); // NaN is typeof 'number'
    });

    it("should handle Infinity", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: Infinity },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(Infinity);
    });

    it("should handle -Infinity", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: -Infinity },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(-Infinity);
    });

    it("should handle very small numbers", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: Number.MIN_VALUE,
        },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(Number.MIN_VALUE);
    });

    it("should handle very large numbers", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_COST]: Number.MAX_VALUE,
        },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(Number.MAX_VALUE);
    });
  });

  describe("real-world scenarios", () => {
    it("should extract cost from GPT-4 API call", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "gpt-4",
          "gen_ai.usage.input_tokens": 150,
          "gen_ai.usage.output_tokens": 75,
          "gen_ai.usage.total_tokens": 225,
          "gen_ai.usage.cost": 0.0045,
        },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0.0045);
    });

    it("should extract cost from Claude API call", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "claude-3-sonnet",
          "gen_ai.usage.input_tokens": 1250,
          "gen_ai.usage.output_tokens": 380,
          "gen_ai.usage.total_tokens": 1630,
          "gen_ai.usage.cost": 0.0245,
        },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0.0245);
    });

    it("should handle span without cost information", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "gpt-3.5-turbo",
          "gen_ai.usage.input_tokens": 120,
          "gen_ai.usage.output_tokens": 80,
          // No cost provided - maybe free tier or cost calculation failed
        },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0);
    });

    it("should handle local model with no cost", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "llama-2-7b",
          "gen_ai.usage.input_tokens": 200,
          "gen_ai.usage.output_tokens": 150,
          "gen_ai.usage.cost": 0, // Local models have no API cost
        },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0);
    });

    it("should handle failed API call with partial data", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "gpt-4",
          "error.type": "rate_limit_exceeded",
          "http.status_code": 429,
          // No cost for failed requests
        },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0);
    });

    it("should handle streaming response with incremental costs", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "gpt-4",
          "gen_ai.streaming": true,
          "gen_ai.usage.input_tokens": 100,
          "gen_ai.usage.output_tokens": 250, // Longer streaming response
          "gen_ai.usage.cost": 0.007,
        },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0.007);
    });
  });

  describe("cost calculation scenarios", () => {
    it("should handle high-cost operations", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "gpt-4",
          "gen_ai.usage.input_tokens": 8000, // Near max context
          "gen_ai.usage.output_tokens": 4000,
          "gen_ai.usage.cost": 0.36, // Expensive request
        },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0.36);
    });

    it("should handle micro-costs", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "gpt-3.5-turbo",
          "gen_ai.usage.input_tokens": 10,
          "gen_ai.usage.output_tokens": 5,
          "gen_ai.usage.cost": 0.000015, // Very small cost
        },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0.000015);
    });

    it("should handle batch processing costs", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "gpt-3.5-turbo",
          "gen_ai.batch_size": 10,
          "gen_ai.usage.total_tokens": 5000,
          "gen_ai.usage.cost": 0.025, // Batch discount applied
        },
      });

      const result = openTelemetrySpanAdapter.getSpanCost(span);

      expect(result).toBe(0.025);
    });
  });
});
