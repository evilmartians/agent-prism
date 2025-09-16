import { OPENINFERENCE_ATTRIBUTES } from "@evilmartians/agent-prism-types";
import { describe, expect, it } from "vitest";

import { openTelemetrySpanAdapter } from "../adapter";
import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span";

describe("openTelemetrySpanAdapter.categorizeOpenInference", () => {
  describe("OpenInference span kind mappings", () => {
    it("should return 'llm_call' for LLM span kind", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "LLM" },
        name: "llm operation",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "llm_call",
      );
    });

    it("should return 'tool_execution' for TOOL span kind", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "TOOL" },
        name: "tool operation",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "tool_execution",
      );
    });

    it("should return 'chain_operation' for CHAIN span kind", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "CHAIN" },
        name: "chain operation",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "chain_operation",
      );
    });

    it("should return 'agent_invocation' for AGENT span kind", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "AGENT" },
        name: "agent operation",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "agent_invocation",
      );
    });

    it("should return 'retrieval' for RETRIEVER span kind", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "RETRIEVER" },
        name: "retriever operation",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "retrieval",
      );
    });

    it("should return 'embedding' for EMBEDDING span kind", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "EMBEDDING" },
        name: "embedding operation",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "embedding",
      );
    });
  });

  describe("edge cases", () => {
    it("should return 'unknown' when span kind is not a string", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: 123 },
        name: "numeric span kind",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "unknown",
      );
    });

    it("should return 'unknown' when span kind is a boolean", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: true },
        name: "boolean span kind",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "unknown",
      );
    });

    it("should return 'unknown' when span kind attribute is missing", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {},
        name: "missing span kind",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "unknown",
      );
    });

    it("should return 'unknown' for unrecognized span kind values", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "CUSTOM_TYPE" },
        name: "custom span kind",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "unknown",
      );
    });

    it("should return 'unknown' for empty string span kind", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "" },
        name: "empty span kind",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "unknown",
      );
    });

    it("should return 'unknown' for null span kind", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: null },
        name: "null span kind",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "unknown",
      );
    });
  });

  describe("case sensitivity", () => {
    it("should handle exact case matches", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "LLM" },
        name: "uppercase llm",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "llm_call",
      );
    });

    it("should not match lowercase span kinds (case sensitive)", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "llm" },
        name: "lowercase llm",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "unknown",
      );
    });

    it("should not match mixed case span kinds", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "Llm" },
        name: "mixed case llm",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "unknown",
      );
    });
  });

  describe("real-world OpenInference scenarios", () => {
    it("should categorize LLM completion spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "LLM",
          [OPENINFERENCE_ATTRIBUTES.LLM_MODEL]: "gpt-4",
          [OPENINFERENCE_ATTRIBUTES.INPUT_MESSAGES]: JSON.stringify([
            { role: "user", content: "Hello" },
          ]),
        },
        name: "llm.completion",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "llm_call",
      );
    });

    it("should categorize retrieval spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "RETRIEVER",
          [OPENINFERENCE_ATTRIBUTES.RETRIEVAL_DOCUMENTS]: JSON.stringify([
            { content: "document content" },
          ]),
        },
        name: "vector.search",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "retrieval",
      );
    });

    it("should categorize embedding spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "EMBEDDING",
          [OPENINFERENCE_ATTRIBUTES.EMBEDDING_MODEL]: "text-embedding-ada-002",
        },
        name: "embedding.create",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "embedding",
      );
    });

    it("should categorize chain spans with complex workflows", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "CHAIN",
        },
        name: "question_answering_chain",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "chain_operation",
      );
    });

    it("should categorize tool execution spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "TOOL",
        },
        name: "calculator.add",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "tool_execution",
      );
    });

    it("should categorize agent spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "AGENT",
        },
        name: "react_agent.run",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "agent_invocation",
      );
    });
  });

  describe("spans with multiple attributes", () => {
    it("should prioritize span kind over other attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "LLM",
          [OPENINFERENCE_ATTRIBUTES.LLM_MODEL]: "gpt-4",
          "custom.attribute": "some_value",
          "another.attribute": 123,
        },
        name: "complex span",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "llm_call",
      );
    });

    it("should work with minimal attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "TOOL",
        },
        name: "minimal tool span",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenInference(span)).toBe(
        "tool_execution",
      );
    });
  });
});
