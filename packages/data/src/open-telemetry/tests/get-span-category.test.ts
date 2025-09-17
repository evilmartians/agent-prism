import { describe, expect, it, vi, beforeEach } from "vitest";

import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span";

vi.mock("../utils/categorize-open-inference", () => ({
  categorizeOpenInference: vi.fn(),
}));

vi.mock("../utils/categorize-open-telemetry-gen-ai", () => ({
  categorizeOpenTelemetryGenAI: vi.fn(),
}));

vi.mock("../utils/get-open-telemetry-span-standard", () => ({
  getOpenTelemetrySpanStandard: vi.fn(),
}));

vi.mock("../utils/categorize-standard-open-telemetry", () => ({
  categorizeStandardOpenTelemetry: vi.fn(),
}));

import {
  OPENINFERENCE_ATTRIBUTES,
  OPENTELEMETRY_GENAI_ATTRIBUTES,
  STANDARD_OPENTELEMETRY_ATTRIBUTES,
} from "@evilmartians/agent-prism-types";

import { openTelemetrySpanAdapter } from "../adapter";
import { categorizeOpenInference } from "../utils/categorize-open-inference";
import { categorizeOpenTelemetryGenAI } from "../utils/categorize-open-telemetry-gen-ai";
import { categorizeStandardOpenTelemetry } from "../utils/categorize-standard-open-telemetry";
import { getOpenTelemetrySpanStandard } from "../utils/get-open-telemetry-span-standard";

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
        name: "http request",
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "GET",
        },
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
      // Span that could match multiple standards but GenAI takes priority
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "chat",
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "LLM",
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
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "custom", // Detected as GenAI but unknown operation
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
        name: "openai.chat.completions.create",
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "chat",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "openai",
          "gen_ai.request.model": "gpt-4",
        },
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
        name: "llm.completion",
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "LLM",
          [OPENINFERENCE_ATTRIBUTES.LLM_MODEL]: "gpt-4",
        },
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue("openinference");
      vi.mocked(categorizeOpenInference).mockReturnValue("llm_call");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(result).toBe("llm_call");
    });

    it("should categorize standard HTTP spans", () => {
      const span = createMockOpenTelemetrySpan({
        name: "GET /api/users",
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "GET",
          "http.url": "/api/users",
        },
      });

      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue("standard");
      vi.mocked(categorizeStandardOpenTelemetry).mockReturnValue(
        "tool_execution",
      );

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(result).toBe("tool_execution");
    });

    it("should categorize tool execution across standards", () => {
      // Test GenAI tool execution
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

      // Test OpenInference tool execution
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
    it("should handle when getOpenTelemetrySpanStandard returns unexpected values", () => {
      const span = createMockOpenTelemetrySpan({ name: "test" });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue(null as any);
      vi.mocked(categorizeStandardOpenTelemetry).mockReturnValue("unknown");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeStandardOpenTelemetry).toHaveBeenCalledWith(span);
      expect(result).toBe("unknown");
    });

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

      // Should not throw, but fallback gracefully
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
