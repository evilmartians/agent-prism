import { describe, it, expect } from "vitest";

import { openTelemetrySpanAdapter } from "../adapter";
import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span";

describe("openTelemetrySpanAdapter.getSpanDuration", () => {
  describe("basic duration calculations", () => {
    it("should convert seconds to milliseconds", () => {
      const span = createMockOpenTelemetrySpan({ duration: [2, 0] }); // 2 seconds, 0 nanoseconds

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(2000); // 2000 milliseconds
    });

    it("should convert nanoseconds to milliseconds", () => {
      const span = createMockOpenTelemetrySpan({ duration: [0, 500_000_000] }); // 0 seconds, 500 million nanoseconds (0.5 seconds)

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(500); // 500 milliseconds
    });

    it("should combine seconds and nanoseconds", () => {
      const span = createMockOpenTelemetrySpan({ duration: [2, 500_000_000] }); // 2.5 seconds total

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(2500); // 2500 milliseconds
    });

    it("should handle zero duration", () => {
      const span = createMockOpenTelemetrySpan({ duration: [0, 0] }); // No duration

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(0);
    });
  });

  describe("large duration values", () => {
    it("should handle minutes", () => {
      const span = createMockOpenTelemetrySpan({ duration: [60, 0] }); // 1 minute

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(60_000); // 60,000 milliseconds
    });

    it("should handle hours", () => {
      const span = createMockOpenTelemetrySpan({ duration: [3600, 0] }); // 1 hour

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(3_600_000); // 3.6 million milliseconds
    });

    it("should handle very large durations", () => {
      const span = createMockOpenTelemetrySpan({ duration: [86400, 0] }); // 24 hours (1 day)

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(86_400_000);
    });

    it("should handle mixed large values", () => {
      const span = createMockOpenTelemetrySpan({
        duration: [3661, 500_000_000],
      }); // 1 hour, 1 minute, 1.5 seconds

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(3_661_500); // Total in milliseconds
    });
  });

  describe("real-world LLM scenarios", () => {
    it("should handle typical OpenAI API call duration", () => {
      const span = createMockOpenTelemetrySpan({ duration: [2, 150_000_000] }); // 2.15 seconds

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(2150);
    });

    it("should handle fast local model inference", () => {
      const span = createMockOpenTelemetrySpan({ duration: [0, 50_000_000] }); // 50 milliseconds

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(50);
    });

    it("should handle slow complex reasoning", () => {
      const span = createMockOpenTelemetrySpan({ duration: [15, 750_000_000] }); // 15.75 seconds

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(15_750);
    });

    it("should handle vector database query", () => {
      const span = createMockOpenTelemetrySpan({ duration: [0, 125_000_000] }); // 125 milliseconds

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(125);
    });

    it("should handle agent workflow with multiple steps", () => {
      const span = createMockOpenTelemetrySpan({ duration: [8, 250_000_000] }); // 8.25 seconds

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(8250);
    });

    it("should handle very fast tool calls", () => {
      const span = createMockOpenTelemetrySpan({ duration: [0, 1_000_000] }); // 1 millisecond

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(1);
    });

    it("should handle timeout scenarios", () => {
      const span = createMockOpenTelemetrySpan({ duration: [30, 0] }); // 30 second timeout

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(30_000);
    });

    it("should handle streaming response duration", () => {
      const span = createMockOpenTelemetrySpan({ duration: [12, 500_000_000] }); // 12.5 seconds streaming

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(12_500);
    });
  });

  describe("batch processing scenarios", () => {
    it("should handle batch LLM processing", () => {
      const span = createMockOpenTelemetrySpan({ duration: [45, 250_000_000] }); // 45.25 seconds for batch

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(45_250);
    });

    it("should handle parallel processing completion", () => {
      const span = createMockOpenTelemetrySpan({ duration: [3, 800_000_000] }); // 3.8 seconds parallel execution

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(3800);
    });

    it("should handle retry with backoff total duration", () => {
      const span = createMockOpenTelemetrySpan({ duration: [7, 125_000_000] }); // 7.125 seconds with retries

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(7125);
    });
  });

  describe("mathematical correctness", () => {
    it("should correctly convert 1 second to 1000 milliseconds", () => {
      const span = createMockOpenTelemetrySpan({ duration: [1, 0] });

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(1000);
    });

    it("should correctly convert 1 billion nanoseconds to 1000 milliseconds", () => {
      const span = createMockOpenTelemetrySpan({
        duration: [0, 1_000_000_000],
      });

      const result = openTelemetrySpanAdapter.getSpanDuration(span);

      expect(result).toBe(1000);
    });

    it("should handle the conversion formula correctly", () => {
      // Test the formula: seconds * 1000 + nanoseconds / 1_000_000
      const seconds = 5;
      const nanoseconds = 250_000_000; // 250 million nanoseconds = 250 milliseconds
      const span = createMockOpenTelemetrySpan({
        duration: [seconds, nanoseconds],
      });

      const result = openTelemetrySpanAdapter.getSpanDuration(span);
      const expected = seconds * 1000 + nanoseconds / 1_000_000;

      expect(result).toBe(expected);
      expect(result).toBe(5250); // 5000 + 250
    });
  });
});
