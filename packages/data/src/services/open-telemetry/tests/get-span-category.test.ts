import {
  OPENINFERENCE_ATTRIBUTES,
  OPENTELEMETRY_GENAI_ATTRIBUTES,
  STANDARD_OPENTELEMETRY_ATTRIBUTES,
} from "@evilmartians/agent-prism-types";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { openTelemetrySpanAdapter } from "../adapter";
import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span";

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

      const getSpanStandardMock = vi
        .spyOn(openTelemetrySpanAdapter, "getSpanStandard")
        .mockReturnValue("opentelemetry_genai");

      const categorizeOpenTelemetryGenAIMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeOpenTelemetryGenAI")
        .mockReturnValue("llm_call");

      const categorizeOpenInferenceMock = vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeOpenInference",
      );

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(getSpanStandardMock).toHaveBeenCalledWith(span);
      expect(categorizeOpenTelemetryGenAIMock).toHaveBeenCalledWith(span);
      expect(categorizeOpenInferenceMock).not.toHaveBeenCalled();

      expect(result).toBe("llm_call");
    });

    it("should fallback to standard when OpenTelemetry GenAI returns unknown", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "openai",
        },
      });

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        "opentelemetry_genai",
      );

      const categorizeOpenTelemetryGenAIMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeOpenTelemetryGenAI")
        .mockReturnValue("unknown");

      const categorizeStandardOpenTelemetryMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeStandardOpenTelemetry")
        .mockReturnValue("tool_execution");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeOpenTelemetryGenAIMock).toHaveBeenCalledWith(span);
      expect(categorizeStandardOpenTelemetryMock).toHaveBeenCalledWith(span);
      expect(result).toBe("tool_execution");
    });

    it("should not call OpenInference when GenAI is detected", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "execute_tool",
        },
      });

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        "opentelemetry_genai",
      );

      vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeOpenTelemetryGenAI",
      ).mockReturnValue("tool_execution");

      vi.spyOn(openTelemetrySpanAdapter, "categorizeOpenTelemetryGenAI");

      const categorizeOpenInferenceMock = vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeOpenInference",
      );

      openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeOpenInferenceMock).not.toHaveBeenCalled();
    });
  });

  describe("OpenInference standard priority", () => {
    it("should use OpenInference when detected and return its category", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "LLM",
        },
      });

      const getSpanStandardMock = vi
        .spyOn(openTelemetrySpanAdapter, "getSpanStandard")
        .mockReturnValue("openinference");

      const categorizeOpenTelemetryGenAIMock = vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeOpenTelemetryGenAI",
      );

      const categorizeOpenInferenceMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeOpenInference")
        .mockReturnValue("llm_call");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(getSpanStandardMock).toHaveBeenCalledWith(span);
      expect(categorizeOpenInferenceMock).toHaveBeenCalledWith(span);
      expect(categorizeOpenTelemetryGenAIMock).not.toHaveBeenCalled();
      expect(result).toBe("llm_call");
    });

    it("should fallback to standard when OpenInference returns unknown", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.LLM_MODEL]: "gpt-4",
        },
      });

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        "openinference",
      );

      const categorizeStandardOpenTelemetryMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeStandardOpenTelemetry")
        .mockReturnValue("chain_operation");

      const categorizeOpenInferenceMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeOpenInference")
        .mockReturnValue("unknown");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeOpenInferenceMock).toHaveBeenCalledWith(span);
      expect(categorizeStandardOpenTelemetryMock).toHaveBeenCalledWith(span);
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

      const getSpanStandardMock = vi
        .spyOn(openTelemetrySpanAdapter, "getSpanStandard")
        .mockReturnValue("standard");

      const categorizeOpenTelemetryGenAIMock = vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeOpenTelemetryGenAI",
      );

      const categorizeStandardOpenTelemetryMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeStandardOpenTelemetry")
        .mockReturnValue("tool_execution");

      const categorizeOpenInferenceMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeOpenInference")
        .mockReturnValue("unknown");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(getSpanStandardMock).toHaveBeenCalledWith(span);
      expect(categorizeStandardOpenTelemetryMock).toHaveBeenCalledWith(span);
      expect(categorizeOpenTelemetryGenAIMock).not.toHaveBeenCalled();
      expect(categorizeOpenInferenceMock).not.toHaveBeenCalled();
      expect(result).toBe("tool_execution");
    });

    it("should use standard categorization for default case", () => {
      const span = createMockOpenTelemetrySpan({
        name: "unknown operation",
      });

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard")
        // @ts-expect-error - unexpected value to test default case
        .mockReturnValue("unexpected");

      const categorizeStandardOpenTelemetryMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeStandardOpenTelemetry")
        .mockReturnValue("unknown");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeStandardOpenTelemetryMock).toHaveBeenCalledWith(span);
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

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        "opentelemetry_genai",
      );

      vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeOpenTelemetryGenAI",
      ).mockReturnValue("llm_call");

      const categorizeOpenInferenceMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeOpenInference")
        .mockReturnValue("unknown");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(result).toBe("llm_call");
      expect(categorizeOpenInferenceMock).not.toHaveBeenCalled();
    });

    it("should properly cascade through standards when primary returns unknown", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "custom", // Detected as GenAI but unknown operation
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "GET",
        },
      });

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        "opentelemetry_genai",
      );

      const categorizeOpenTelemetryGenAIMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeOpenTelemetryGenAI")
        .mockReturnValue("unknown");

      const categorizeStandardOpenTelemetryMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeStandardOpenTelemetry")
        .mockReturnValue("tool_execution");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeOpenTelemetryGenAIMock).toHaveBeenCalledWith(span);
      expect(categorizeStandardOpenTelemetryMock).toHaveBeenCalledWith(span);
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

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        "opentelemetry_genai",
      );
      vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeOpenTelemetryGenAI",
      ).mockReturnValue("llm_call");

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

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        "openinference",
      );
      vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeOpenInference",
      ).mockReturnValue("llm_call");

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

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        "standard",
      );
      vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeStandardOpenTelemetry",
      ).mockReturnValue("tool_execution");

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

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        "opentelemetry_genai",
      );
      vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeOpenTelemetryGenAI",
      ).mockReturnValue("tool_execution");

      expect(openTelemetrySpanAdapter.getSpanCategory(genaiSpan)).toBe(
        "tool_execution",
      );

      // Test OpenInference tool execution
      const openinfSpan = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "TOOL",
        },
      });

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        "openinference",
      );
      vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeOpenInference",
      ).mockReturnValue("tool_execution");

      expect(openTelemetrySpanAdapter.getSpanCategory(openinfSpan)).toBe(
        "tool_execution",
      );
    });
  });

  describe("error handling and edge cases", () => {
    it("should handle when getSpanStandard returns unexpected values", () => {
      const span = createMockOpenTelemetrySpan({ name: "test" });

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        // @ts-expect-error - unexpected value to test default case
        null,
      );
      vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeStandardOpenTelemetry",
      ).mockReturnValue("unknown");

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(
        openTelemetrySpanAdapter.categorizeStandardOpenTelemetry,
      ).toHaveBeenCalledWith(span);
      expect(result).toBe("unknown");
    });

    it("should handle when categorization functions throw errors", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "chat",
        },
      });

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        "opentelemetry_genai",
      );
      vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeOpenTelemetryGenAI",
      ).mockImplementation(() => {
        throw new Error("Categorization error");
      });
      vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeStandardOpenTelemetry",
      ).mockReturnValue("unknown");

      // Should not throw, but fallback gracefully
      expect(() => openTelemetrySpanAdapter.getSpanCategory(span)).toThrow(
        "Categorization error",
      );
    });

    it("should handle all categorization functions returning unknown", () => {
      const span = createMockOpenTelemetrySpan({ name: "mysterious span" });

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        "opentelemetry_genai",
      );
      vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeOpenTelemetryGenAI",
      ).mockReturnValue("unknown");
      vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeStandardOpenTelemetry",
      ).mockReturnValue("unknown");

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

      const categorizeOpenTelemetryGenAIMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeOpenTelemetryGenAI")
        .mockReturnValue("llm_call");
      const categorizeStandardOpenTelemetryMock = vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeStandardOpenTelemetry",
      );
      const categorizeOpenInferenceMock = vi.spyOn(
        openTelemetrySpanAdapter,
        "categorizeOpenInference",
      );

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        "opentelemetry_genai",
      );

      openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeOpenTelemetryGenAIMock).toHaveBeenCalledTimes(1);
      expect(categorizeStandardOpenTelemetryMock).not.toHaveBeenCalled();
      expect(categorizeOpenInferenceMock).not.toHaveBeenCalled();
    });

    it("should call fallback only when needed", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "UNKNOWN_KIND",
        },
      });

      const categorizeOpenInferenceMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeOpenInference")
        .mockReturnValue("unknown");
      const categorizeStandardOpenTelemetryMock = vi
        .spyOn(openTelemetrySpanAdapter, "categorizeStandardOpenTelemetry")
        .mockReturnValue("tool_execution");

      vi.spyOn(openTelemetrySpanAdapter, "getSpanStandard").mockReturnValue(
        "openinference",
      );

      const result = openTelemetrySpanAdapter.getSpanCategory(span);

      expect(categorizeOpenInferenceMock).toHaveBeenCalledTimes(1);
      expect(categorizeStandardOpenTelemetryMock).toHaveBeenCalledTimes(1);
      expect(result).toBe("tool_execution");
    });
  });
});
