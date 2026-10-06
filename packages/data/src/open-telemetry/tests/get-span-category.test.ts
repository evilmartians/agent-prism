import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span.js";

vi.mock("../utils/categorize-open-inference.js", () => ({
  categorizeOpenInference: vi.fn(),
}));

vi.mock("../utils/categorize-open-telemetry-gen-ai.js", () => ({
  categorizeOpenTelemetryGenAI: vi.fn(),
}));

vi.mock("../utils/get-open-telemetry-span-standard.js", () => ({
  getOpenTelemetrySpanStandard: vi.fn(),
}));

vi.mock("../utils/categorize-standard-open-telemetry.js", () => ({
  categorizeStandardOpenTelemetry: vi.fn(),
}));

import {
  OPENINFERENCE_ATTRIBUTES,
  OPENTELEMETRY_GENAI_ATTRIBUTES,
  STANDARD_OPENTELEMETRY_ATTRIBUTES,
} from "@evilmartians/agent-prism-types";

import { openTelemetrySpanAdapter } from "../adapter.js";
import { categorizeOpenInference } from "../utils/categorize-open-inference.js";
import { categorizeOpenTelemetryGenAI } from "../utils/categorize-open-telemetry-gen-ai.js";
import { categorizeStandardOpenTelemetry } from "../utils/categorize-standard-open-telemetry.js";
import { getOpenTelemetrySpanStandard } from "../utils/get-open-telemetry-span-standard.js";

describe("openTelemetrySpanAdapter.getSpanCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("OpenTelemetry GenAI standard priority", () => {
    it("should use OpenTelemetry GenAI when detected and return its category", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "chat",
        },
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue(
        "opentelemetry_genai",
      );
      vi.mocked(categorizeOpenTelemetryGenAI).mockReturnValue("llm_call");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(getOpenTelemetrySpanStandard).toHaveBeenCalledWith(span);
      expect(categorizeOpenTelemetryGenAI).toHaveBeenCalledWith(span);
      expect(categorizeOpenInference).not.toHaveBeenCalled();
      expect(result).toBe("llm_call");
    });

    it("should fallback to standard when OpenTelemetry GenAI returns unknown", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "openai",
        },
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue(
        "opentelemetry_genai",
      );
      vi.mocked(categorizeOpenTelemetryGenAI).mockReturnValue("unknown");
      vi.mocked(categorizeStandardOpenTelemetry).mockReturnValue(
        "tool_execution",
      );

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeOpenTelemetryGenAI).toHaveBeenCalledWith(span);
      expect(categorizeStandardOpenTelemetry).toHaveBeenCalledWith(span);
      expect(result).toBe("tool_execution");
    });

    it("should not call OpenInference when GenAI is detected", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "execute_tool",
        },
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue(
        "opentelemetry_genai",
      );
      vi.mocked(categorizeOpenTelemetryGenAI).mockReturnValue("tool_execution");

      openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeOpenInference).not.toHaveBeenCalled();
    });
  });

  describe("OpenInference standard priority", () => {
    it("should use OpenInference when detected and return its category", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "LLM",
        },
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue("openinference");
      vi.mocked(categorizeOpenInference).mockReturnValue("llm_call");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(getOpenTelemetrySpanStandard).toHaveBeenCalledWith(span);
      expect(categorizeOpenInference).toHaveBeenCalledWith(span);
      expect(categorizeOpenTelemetryGenAI).not.toHaveBeenCalled();
      expect(result).toBe("llm_call");
    });

    it("should fallback to standard when OpenInference returns unknown", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.LLM_MODEL]: "gpt-4",
        },
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue("openinference");
      vi.mocked(categorizeOpenInference).mockReturnValue("unknown");
      vi.mocked(categorizeStandardOpenTelemetry).mockReturnValue(
        "chain_operation",
      );

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeOpenInference).toHaveBeenCalledWith(span);
      expect(categorizeStandardOpenTelemetry).toHaveBeenCalledWith(span);
      expect(result).toBe("chain_operation");
    });
  });

  describe("Standard OpenTelemetry fallback", () => {
    it("should use standard categorization when standard is detected", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "GET",
        },
        name: "http request",
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue("standard");
      vi.mocked(categorizeStandardOpenTelemetry).mockReturnValue(
        "tool_execution",
      );

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(getOpenTelemetrySpanStandard).toHaveBeenCalledWith(span);
      expect(categorizeStandardOpenTelemetry).toHaveBeenCalledWith(span);
      expect(categorizeOpenTelemetryGenAI).not.toHaveBeenCalled();
      expect(categorizeOpenInference).not.toHaveBeenCalled();
      expect(result).toBe("tool_execution");
    });

    it("should use standard categorization for default case", () => {
      const span = createMockOpenTelemetrySpan({
        name: "unknown operation",
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue(
        // @ts-expect-error - Return an unexpected value to test default case
        "unexpected",
      );
      vi.mocked(categorizeStandardOpenTelemetry).mockReturnValue("unknown");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeStandardOpenTelemetry).toHaveBeenCalledWith(span);
      expect(result).toBe("unknown");
    });
  });

  describe("integration scenarios", () => {
    it("should handle spans with mixed standard indicators correctly", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "LLM",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "chat",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "POST",
        },
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue(
        "opentelemetry_genai",
      );
      vi.mocked(categorizeOpenTelemetryGenAI).mockReturnValue("llm_call");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(result).toBe("llm_call");
      expect(categorizeOpenInference).not.toHaveBeenCalled();
    });

    it("should properly cascade through standards when primary returns unknown", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "custom",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "GET",
        },
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue(
        "opentelemetry_genai",
      );
      vi.mocked(categorizeOpenTelemetryGenAI).mockReturnValue("unknown");
      vi.mocked(categorizeStandardOpenTelemetry).mockReturnValue(
        "tool_execution",
      );

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeOpenTelemetryGenAI).toHaveBeenCalledWith(span);
      expect(categorizeStandardOpenTelemetry).toHaveBeenCalledWith(span);
      expect(result).toBe("tool_execution");
    });
  });

  describe("real-world span examples", () => {
    it("should categorize OpenAI chat completion spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "gpt-4",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "chat",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "openai",
        },
        name: "openai.chat.completions.create",
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue(
        "opentelemetry_genai",
      );
      vi.mocked(categorizeOpenTelemetryGenAI).mockReturnValue("llm_call");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(result).toBe("llm_call");
    });

    it("should categorize OpenInference LLM spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.LLM_MODEL]: "gpt-4",
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "LLM",
        },
        name: "llm.completion",
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue("openinference");
      vi.mocked(categorizeOpenInference).mockReturnValue("llm_call");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(result).toBe("llm_call");
    });

    it("should categorize standard HTTP spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "http.url": "/api/users",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "GET",
        },
        name: "GET /api/users",
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue("standard");
      vi.mocked(categorizeStandardOpenTelemetry).mockReturnValue(
        "tool_execution",
      );

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(result).toBe("tool_execution");
    });

    it("should categorize tool execution across standards", () => {
      const genaiSpan = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "execute_tool",
        },
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue(
        "opentelemetry_genai",
      );
      vi.mocked(categorizeOpenTelemetryGenAI).mockReturnValue("tool_execution");

      expect(openTelemetrySpanAdapter.getSpanCategory(genaiSpan)).toBe(
        "tool_execution",
      );

      const openinfSpan = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "TOOL",
        },
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue("openinference");
      vi.mocked(categorizeOpenInference).mockReturnValue("tool_execution");

      expect(openTelemetrySpanAdapter.getSpanCategory(openinfSpan)).toBe(
        "tool_execution",
      );
    });
  });

  describe("error handling and edge cases", () => {
    it("should handle when categorization functions throw errors", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "chat",
        },
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue(
        "opentelemetry_genai",
      );
      vi.mocked(categorizeOpenTelemetryGenAI).mockImplementation(() => {
        throw new Error("Categorization error");
      });
      vi.mocked(categorizeStandardOpenTelemetry).mockReturnValue("unknown");

      expect(() => openTelemetrySpanAdapter.getSpanCategory(span)).toThrow(
        "Categorization error",
      );
    });

    it("should handle all categorization functions returning unknown", () => {
      const span = createMockOpenTelemetrySpan({ name: "mysterious span" });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue(
        "opentelemetry_genai",
      );
      vi.mocked(categorizeOpenTelemetryGenAI).mockReturnValue("unknown");
      vi.mocked(categorizeStandardOpenTelemetry).mockReturnValue("unknown");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(result).toBe("unknown");
    });
  });

  describe("function call order and optimization", () => {
    it("should not call unnecessary categorization functions when primary succeeds", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "chat",
        },
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue(
        "opentelemetry_genai",
      );
      vi.mocked(categorizeOpenTelemetryGenAI).mockReturnValue("llm_call");

      openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeOpenTelemetryGenAI).toHaveBeenCalledTimes(1);
      expect(categorizeStandardOpenTelemetry).not.toHaveBeenCalled();
      expect(categorizeOpenInference).not.toHaveBeenCalled();
    });

    it("should call fallback only when needed", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "UNKNOWN_KIND",
        },
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue("openinference");
      vi.mocked(categorizeOpenInference).mockReturnValue("unknown");
      vi.mocked(categorizeStandardOpenTelemetry).mockReturnValue(
        "tool_execution",
      );

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeOpenInference).toHaveBeenCalledTimes(1);
      expect(categorizeStandardOpenTelemetry).toHaveBeenCalledTimes(1);
      expect(result).toBe("tool_execution");
    });
  });
});
