import { describe, expect, it } from "vitest";

import { getDurationMs } from "../../common/get-duration-ms.js";
import { openTelemetrySpanAdapter } from "../adapter.js";
import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span.js";

describe("openTelemetrySpanAdapter — span duration", () => {
  describe("basic duration calculations", () => {
    it("should convert seconds to milliseconds", () => {
      const span = createMockOpenTelemetrySpan({ duration: [2, 0] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(2000);
    });

    it("should convert nanoseconds to milliseconds", () => {
      const span = createMockOpenTelemetrySpan({ duration: [0, 500_000_000] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(500);
    });

    it("should combine seconds and nanoseconds", () => {
      const span = createMockOpenTelemetrySpan({ duration: [2, 500_000_000] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(2500);
    });

    it("should handle zero duration", () => {
      const span = createMockOpenTelemetrySpan({ duration: [0, 0] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(0);
    });
  });

  describe("large duration values", () => {
    it("should handle minutes", () => {
      const span = createMockOpenTelemetrySpan({ duration: [60, 0] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(60_000);
    });

    it("should handle hours", () => {
      const span = createMockOpenTelemetrySpan({ duration: [3600, 0] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(3_600_000);
    });

    it("should handle very large durations", () => {
      const span = createMockOpenTelemetrySpan({ duration: [86400, 0] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(86_400_000);
    });

    it("should handle mixed large values", () => {
      const span = createMockOpenTelemetrySpan({
        duration: [3661, 500_000_000],
      });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(3_661_500);
    });
  });

  describe("real-world LLM scenarios", () => {
    it("should handle typical OpenAI API call duration", () => {
      const span = createMockOpenTelemetrySpan({ duration: [2, 150_000_000] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(2150);
    });

    it("should handle fast local model inference", () => {
      const span = createMockOpenTelemetrySpan({ duration: [0, 50_000_000] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(50);
    });

    it("should handle slow complex reasoning", () => {
      const span = createMockOpenTelemetrySpan({ duration: [15, 750_000_000] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(15_750);
    });

    it("should handle vector database query", () => {
      const span = createMockOpenTelemetrySpan({ duration: [0, 125_000_000] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(125);
    });

    it("should handle agent workflow with multiple steps", () => {
      const span = createMockOpenTelemetrySpan({ duration: [8, 250_000_000] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(8250);
    });

    it("should handle very fast tool calls", () => {
      const span = createMockOpenTelemetrySpan({ duration: [0, 1_000_000] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(1);
    });

    it("should handle timeout scenarios", () => {
      const span = createMockOpenTelemetrySpan({ duration: [30, 0] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(30_000);
    });

    it("should handle streaming response duration", () => {
      const span = createMockOpenTelemetrySpan({ duration: [12, 500_000_000] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(12_500);
    });
  });

  describe("batch processing scenarios", () => {
    it("should handle batch LLM processing", () => {
      const span = createMockOpenTelemetrySpan({ duration: [45, 250_000_000] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(45_250);
    });

    it("should handle parallel processing completion", () => {
      const span = createMockOpenTelemetrySpan({ duration: [3, 800_000_000] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(3800);
    });

    it("should handle retry with backoff total duration", () => {
      const span = createMockOpenTelemetrySpan({ duration: [7, 125_000_000] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(7125);
    });
  });

  describe("mathematical correctness", () => {
    it("should correctly convert 1 second to 1000 milliseconds", () => {
      const span = createMockOpenTelemetrySpan({ duration: [1, 0] });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(1000);
    });

    it("should correctly convert 1 billion nanoseconds to 1000 milliseconds", () => {
      const span = createMockOpenTelemetrySpan({
        duration: [0, 1_000_000_000],
      });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );

      expect(result).toBe(1000);
    });

    it("should add seconds * 1000 and nanoseconds / 1_000_000", () => {
      const seconds = 5;
      const nanoseconds = 250_000_000;
      const span = createMockOpenTelemetrySpan({
        duration: [seconds, nanoseconds],
      });

      const result = getDurationMs(
        openTelemetrySpanAdapter.convertRawSpanToTraceSpan(span),
      );
      const expected = seconds * 1000 + nanoseconds / 1_000_000;

      expect(result).toBe(expected);
      expect(result).toBe(5250);
    });
  });
});
