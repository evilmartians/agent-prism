import { OPENTELEMETRY_GENAI_ATTRIBUTES } from "@evilmartians/agent-prism-types";
import { describe, it, expect } from "vitest";

import { openTelemetrySpanAdapter } from "../adapter";
import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span";

describe("openTelemetrySpanAdapter.getSpanTokensCount", () => {
  it("should return total tokens when available as number", () => {
    const span = createMockOpenTelemetrySpan({
      attributes: {
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_TOTAL_TOKENS]: 150,
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_TOKENS]: 100,
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_OUTPUT_TOKENS]: 50,
      },
    });

    const result = openTelemetrySpanAdapter.getSpanTokensCount(span);

    expect(result).toBe(150);
  });

  it("should sum input and output tokens when total is not available", () => {
    const span = createMockOpenTelemetrySpan({
      attributes: {
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_TOKENS]: 80,
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_OUTPUT_TOKENS]: 40,
      },
    });

    const result = openTelemetrySpanAdapter.getSpanTokensCount(span);

    expect(result).toBe(120);
  });

  it("should return 0 when no token attributes are available", () => {
    const span = createMockOpenTelemetrySpan({});

    const result = openTelemetrySpanAdapter.getSpanTokensCount(span);

    expect(result).toBe(0);
  });

  it("should handle mixed token types correctly", () => {
    const span = createMockOpenTelemetrySpan({
      attributes: {
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_TOTAL_TOKENS]: "not-a-number", // string value
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_TOKENS]: 60,
        // TOKENS_OUTPUT is missing (undefined)
      },
    });

    const result = openTelemetrySpanAdapter.getSpanTokensCount(span);

    expect(result).toBe(60); // 60 + 0 (undefined becomes 0)
  });

  it("should handle partial token information", () => {
    const span = createMockOpenTelemetrySpan({
      attributes: {
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_TOTAL_TOKENS]: null,
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_TOKENS]: 90,
        // TOKENS_OUTPUT is missing
      },
    });

    const result = openTelemetrySpanAdapter.getSpanTokensCount(span);

    expect(result).toBe(90); // 90 + 0
  });

  it("should handle zero token values correctly", () => {
    const span = createMockOpenTelemetrySpan({
      attributes: {
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_TOKENS]: 0,
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_OUTPUT_TOKENS]: 0,
      },
    });

    const result = openTelemetrySpanAdapter.getSpanTokensCount(span);

    expect(result).toBe(0);
  });

  it("should prioritize total tokens over individual counts", () => {
    const span = createMockOpenTelemetrySpan({
      attributes: {
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_TOTAL_TOKENS]: 200,
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_TOKENS]: 999, // Should be ignored
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_OUTPUT_TOKENS]: 999, // Should be ignored
      },
    });

    const result = openTelemetrySpanAdapter.getSpanTokensCount(span);

    expect(result).toBe(200);
  });

  it("should handle string numbers correctly by treating them as non-numbers", () => {
    const span = createMockOpenTelemetrySpan({
      attributes: {
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_TOTAL_TOKENS]: "150", // string number
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_TOKENS]: 80,
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_OUTPUT_TOKENS]: 70,
      },
    });

    const result = openTelemetrySpanAdapter.getSpanTokensCount(span);

    // Since '150' is not typeof 'number', it should fall back to input + output
    expect(result).toBe(150); // 80 + 70
  });

  it("should handle boolean values correctly", () => {
    const span = createMockOpenTelemetrySpan({
      attributes: {
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_TOTAL_TOKENS]: true, // boolean
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_TOKENS]: false, // boolean
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_OUTPUT_TOKENS]: 25,
      },
    });

    const result = openTelemetrySpanAdapter.getSpanTokensCount(span);

    // Booleans are not numbers, so should fall back to input + output
    // false is not a number, so it becomes 0
    expect(result).toBe(25); // 0 + 25
  });

  it("should handle array values correctly", () => {
    const span = createMockOpenTelemetrySpan({
      attributes: {
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_TOTAL_TOKENS]: ["150", "200"], // array
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_INPUT_TOKENS]: 30,
        [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_OUTPUT_TOKENS]: 20,
      },
    });

    const result = openTelemetrySpanAdapter.getSpanTokensCount(span);

    // Arrays are not numbers, so should fall back to input + output
    expect(result).toBe(50); // 30 + 20
  });

  describe("real-world scenarios", () => {
    it("should handle GPT-4 response attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "gpt-4",
          "gen_ai.usage.input_tokens": 150,
          "gen_ai.usage.output_tokens": 75,
          "gen_ai.usage.total_tokens": 225,
          "gen_ai.usage.cost": 0.0045,
        },
      });

      const result = openTelemetrySpanAdapter.getSpanTokensCount(span);

      expect(result).toBe(225);
    });

    it("should handle Claude response attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "claude-3-sonnet",
          "gen_ai.usage.input_tokens": 1250,
          "gen_ai.usage.output_tokens": 380,
          // No total tokens provided
          "gen_ai.usage.cost": 0.0245,
        },
      });

      const result = openTelemetrySpanAdapter.getSpanTokensCount(span);

      expect(result).toBe(1630); // 1250 + 380
    });

    it("should handle incomplete LLM response", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "gpt-3.5-turbo",
          "gen_ai.usage.input_tokens": 120,
          // Missing output tokens (streaming response interrupted?)
          "error.type": "timeout",
        },
      });

      const result = openTelemetrySpanAdapter.getSpanTokensCount(span);

      expect(result).toBe(120); // 120 + 0
    });
  });
});
