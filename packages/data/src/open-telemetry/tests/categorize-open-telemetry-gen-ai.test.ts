import { OPENTELEMETRY_GENAI_ATTRIBUTES } from "@evilmartians/agent-prism-types";
import { describe, expect, it } from "vitest";

import { openTelemetrySpanAdapter } from "../adapter.ts";
import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span.ts";

describe("openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI", () => {
  describe("OpenTelemetry GenAI operation name mappings", () => {
    it("should return 'llm_call' for chat operation", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "chat" },
        name: "chat.completions.create",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "llm_call",
      );
    });

    it("should return 'llm_call' for generate_content operation", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "generate_content",
        },
        name: "generate.content",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "llm_call",
      );
    });

    it("should return 'llm_call' for text_completion operation", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "text_completion",
        },
        name: "text.completion",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "llm_call",
      );
    });

    it("should return 'tool_execution' for execute_tool operation", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "execute_tool",
        },
        name: "execute.tool",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "tool_execution",
      );
    });

    it("should return 'agent_invocation' for invoke_agent operation", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "invoke_agent",
        },
        name: "invoke.agent",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "agent_invocation",
      );
    });

    it("should return 'create_agent' for create_agent operation", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "create_agent",
        },
        name: "create.agent",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "create_agent",
      );
    });

    it("should return 'embedding' for embeddings operation", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "embeddings",
        },
        name: "embeddings.create",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "embedding",
      );
    });
  });

  describe("edge cases", () => {
    it("should return 'unknown' when operation name is not a string", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: 123 },
        name: "numeric operation name",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "unknown",
      );
    });

    it("should return 'unknown' when operation name is a boolean", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: true },
        name: "boolean operation name",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "unknown",
      );
    });

    it("should return 'unknown' when operation name attribute is missing", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {},
        name: "missing operation name",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "unknown",
      );
    });

    it("should return 'unknown' for unrecognized operation name values", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "custom_operation",
        },
        name: "custom operation",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "unknown",
      );
    });

    it("should return 'unknown' for empty string operation name", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "" },
        name: "empty operation name",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "unknown",
      );
    });

    it("should return 'unknown' for null operation name", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: null },
        name: "null operation name",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "unknown",
      );
    });
  });

  describe("case sensitivity", () => {
    it("should handle exact case matches", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "chat" },
        name: "lowercase chat",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "llm_call",
      );
    });

    it("should not match uppercase operation names (case sensitive)", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "CHAT" },
        name: "uppercase chat",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "unknown",
      );
    });

    it("should not match mixed case operation names", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: { [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "Chat" },
        name: "mixed case chat",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "unknown",
      );
    });
  });

  describe("real-world OpenTelemetry GenAI scenarios", () => {
    it("should categorize OpenAI chat completion spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "chat",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "openai",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "gpt-4",
        },
        name: "openai.chat.completions.create",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "llm_call",
      );
    });

    it("should categorize Anthropic text generation spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "generate_content",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "anthropic",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "claude-3-sonnet",
        },
        name: "anthropic.messages.create",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "llm_call",
      );
    });

    it("should categorize tool execution spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "execute_tool",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.TOOL_NAME]: "calculator",
        },
        name: "tool.calculator.execute",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "tool_execution",
      );
    });

    it("should categorize agent invocation spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "invoke_agent",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.AGENT_NAME]: "customer-support-agent",
        },
        name: "agent.invoke",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "agent_invocation",
      );
    });

    it("should categorize agent creation spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "create_agent",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.AGENT_NAME]: "new-agent",
        },
        name: "agent.create",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "create_agent",
      );
    });

    it("should categorize embedding spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "embeddings",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "openai",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "text-embedding-ada-002",
        },
        name: "embeddings.create",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "embedding",
      );
    });

    it("should categorize legacy text completion spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "text_completion",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "openai",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "gpt-3.5-turbo-instruct",
        },
        name: "completions.create",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "llm_call",
      );
    });
  });

  describe("spans with multiple attributes", () => {
    it("should prioritize operation name over other attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "chat",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "openai",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "gpt-4",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.AGENT_NAME]: "some-agent",
          "custom.attribute": "some_value",
          "another.attribute": 123,
        },
        name: "complex span",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "llm_call",
      );
    });

    it("should work with minimal attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "execute_tool",
        },
        name: "minimal tool span",
      });
      expect(openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(span)).toBe(
        "tool_execution",
      );
    });
  });

  describe("spans from real trace examples", () => {
    it("should categorize spans from the provided trace examples", () => {
      // Based on the real trace data you showed earlier
      const llmSpan = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.operation.name": "chat",
          "gen_ai.request.model": "gpt-4.1-mini",
          "gen_ai.usage.input_tokens": 200,
          "gen_ai.usage.output_tokens": 18,
        },
        name: "call_llm gpt-4.1-mini",
      });
      expect(
        openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(llmSpan),
      ).toBe("llm_call");

      const toolSpan = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.operation.name": "execute_tool",
          "gen_ai.tool.name": "get_current_time",
        },
        name: "execute_tool get_current_time",
      });
      expect(
        openTelemetrySpanAdapter.categorizeOpenTelemetryGenAI(toolSpan),
      ).toBe("tool_execution");
    });
  });
});
