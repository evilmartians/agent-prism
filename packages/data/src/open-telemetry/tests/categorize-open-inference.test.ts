import type { TraceSpanCategory } from "@evilmartians/agent-prism-types";

import { OPENINFERENCE_ATTRIBUTES } from "@evilmartians/agent-prism-types";
import { describe, expect, it } from "vitest";

import { categorizeOpenInference } from "../utils/categorize-open-inference.js";
import {
  createMockOpenTelemetrySpan,
  type MockAttributeValue,
} from "../utils/create-mock-open-telemetry-span.js";

describe("categorizeOpenInference", () => {
  it.each<[MockAttributeValue, TraceSpanCategory]>([
    ["LLM", "llm_call"],
    ["TOOL", "tool_execution"],
    ["CHAIN", "chain_operation"],
    ["AGENT", "agent_invocation"],
    ["RETRIEVER", "retrieval"],
    ["EMBEDDING", "embedding"],
    [123, "unknown"],
    [true, "unknown"],
    ["CUSTOM_TYPE", "unknown"],
    ["", "unknown"],
    [null, "unknown"],
    ["llm", "unknown"],
    ["Llm", "unknown"],
  ])("maps span kind %j to %s", (spanKind, category) => {
    const span = createMockOpenTelemetrySpan({
      attributes: { [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: spanKind },
    });
    expect(categorizeOpenInference(span)).toBe(category);
  });

  it("should return 'unknown' when span kind attribute is missing", () => {
    expect(categorizeOpenInference(createMockOpenTelemetrySpan())).toBe(
      "unknown",
    );
  });

  describe("real-world OpenInference scenarios", () => {
    it("should categorize LLM completion spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.INPUT_MESSAGES]: JSON.stringify([
            { content: "Hello", role: "user" },
          ]),
          [OPENINFERENCE_ATTRIBUTES.LLM_MODEL]: "gpt-4",
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "LLM",
        },
        name: "llm.completion",
      });
      expect(categorizeOpenInference(span)).toBe("llm_call");
    });

    it("should categorize retrieval spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.RETRIEVAL_DOCUMENTS]: JSON.stringify([
            { content: "document content" },
          ]),
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "RETRIEVER",
        },
        name: "vector.search",
      });
      expect(categorizeOpenInference(span)).toBe("retrieval");
    });

    it("should categorize embedding spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.EMBEDDING_MODEL]: "text-embedding-ada-002",
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "EMBEDDING",
        },
        name: "embedding.create",
      });
      expect(categorizeOpenInference(span)).toBe("embedding");
    });

    it("should categorize chain spans with complex workflows", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "CHAIN",
        },
        name: "question_answering_chain",
      });
      expect(categorizeOpenInference(span)).toBe("chain_operation");
    });

    it("should categorize tool execution spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "TOOL",
        },
        name: "calculator.add",
      });
      expect(categorizeOpenInference(span)).toBe("tool_execution");
    });

    it("should categorize agent spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "AGENT",
        },
        name: "react_agent.run",
      });
      expect(categorizeOpenInference(span)).toBe("agent_invocation");
    });
  });

  describe("spans with multiple attributes", () => {
    it("should prioritize span kind over other attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "another.attribute": 123,
          "custom.attribute": "some_value",
          [OPENINFERENCE_ATTRIBUTES.LLM_MODEL]: "gpt-4",
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "LLM",
        },
        name: "complex span",
      });
      expect(categorizeOpenInference(span)).toBe("llm_call");
    });

    it("should work with minimal attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENINFERENCE_ATTRIBUTES.SPAN_KIND]: "TOOL",
        },
        name: "minimal tool span",
      });
      expect(categorizeOpenInference(span)).toBe("tool_execution");
    });
  });
});
