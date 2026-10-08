import type { OpenTelemetryStandard } from "@evilmartians/agent-prism-types";

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

import { openTelemetrySpanAdapter } from "../adapter.js";
import { categorizeOpenInference } from "../utils/categorize-open-inference.js";
import { categorizeOpenTelemetryGenAI } from "../utils/categorize-open-telemetry-gen-ai.js";
import { categorizeStandardOpenTelemetry } from "../utils/categorize-standard-open-telemetry.js";
import { getOpenTelemetrySpanStandard } from "../utils/get-open-telemetry-span-standard.js";

const span = createMockOpenTelemetrySpan();

describe("openTelemetrySpanAdapter.getSpanCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe.each<
    [
      OpenTelemetryStandard,
      typeof categorizeOpenInference,
      typeof categorizeOpenInference,
    ]
  >([
    [
      "opentelemetry_genai",
      categorizeOpenTelemetryGenAI,
      categorizeOpenInference,
    ],
    ["openinference", categorizeOpenInference, categorizeOpenTelemetryGenAI],
  ])("when the standard is %s", (standard, primary, other) => {
    beforeEach(() => {
      vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue(standard);
    });

    it("returns the category of that standard's categorizer", () => {
      vi.mocked(primary).mockReturnValue("llm_call");

      expect(openTelemetrySpanAdapter.getSpanCategory(span)).toBe("llm_call");
      expect(getOpenTelemetrySpanStandard).toHaveBeenCalledWith(span);
      expect(primary).toHaveBeenCalledExactlyOnceWith(span);
      expect(other).not.toHaveBeenCalled();
      expect(categorizeStandardOpenTelemetry).not.toHaveBeenCalled();
    });

    it("falls back to the standard categorizer when it returns unknown", () => {
      vi.mocked(primary).mockReturnValue("unknown");
      vi.mocked(categorizeStandardOpenTelemetry).mockReturnValue(
        "tool_execution",
      );

      expect(openTelemetrySpanAdapter.getSpanCategory(span)).toBe(
        "tool_execution",
      );
      expect(primary).toHaveBeenCalledExactlyOnceWith(span);
      expect(categorizeStandardOpenTelemetry).toHaveBeenCalledExactlyOnceWith(
        span,
      );
      expect(other).not.toHaveBeenCalled();
    });

    it("returns unknown when the fallback knows no better", () => {
      vi.mocked(primary).mockReturnValue("unknown");
      vi.mocked(categorizeStandardOpenTelemetry).mockReturnValue("unknown");

      expect(openTelemetrySpanAdapter.getSpanCategory(span)).toBe("unknown");
    });

    it("lets a categorizer error propagate", () => {
      vi.mocked(primary).mockImplementation(() => {
        throw new Error("Categorization error");
      });

      expect(() => openTelemetrySpanAdapter.getSpanCategory(span)).toThrow(
        "Categorization error",
      );
    });
  });

  it("should use standard categorization when standard is detected", () => {
    vi.mocked(getOpenTelemetrySpanStandard).mockReturnValue("standard");
    vi.mocked(categorizeStandardOpenTelemetry).mockReturnValue(
      "tool_execution",
    );

    expect(openTelemetrySpanAdapter.getSpanCategory(span)).toBe(
      "tool_execution",
    );
    expect(categorizeStandardOpenTelemetry).toHaveBeenCalledWith(span);
    expect(categorizeOpenTelemetryGenAI).not.toHaveBeenCalled();
    expect(categorizeOpenInference).not.toHaveBeenCalled();
  });
});
