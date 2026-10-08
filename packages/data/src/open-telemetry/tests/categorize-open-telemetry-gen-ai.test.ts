import type { TraceSpanCategory } from "@evilmartians/agent-prism-types";

import { OPENTELEMETRY_GENAI_ATTRIBUTES } from "@evilmartians/agent-prism-types";
import { describe, expect, it } from "vitest";

import { categorizeOpenTelemetryGenAI } from "../utils/categorize-open-telemetry-gen-ai.js";
import {
  createMockOpenTelemetrySpan,
  type MockAttributeValue,
} from "../utils/create-mock-open-telemetry-span.js";

describe("categorizeOpenTelemetryGenAI", () => {
  it.each<[MockAttributeValue, TraceSpanCategory]>([
    ["chat", "llm_call"],
    ["generate_content", "llm_call"],
    ["text_completion", "llm_call"],
    ["execute_tool", "tool_execution"],
    ["invoke_agent", "agent_invocation"],
    ["create_agent", "create_agent"],
    ["embeddings", "embedding"],
    [123, "unknown"],
    [true, "unknown"],
    ["custom_operation", "unknown"],
    ["", "unknown"],
    [null, "unknown"],
    ["CHAT", "unknown"],
    ["Chat", "unknown"],
  ])("maps operation name %j to %s", (operationName, category) => {
    const span = createMockOpenTelemetrySpan({
      attributes: {
        [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: operationName,
      },
    });
    expect(categorizeOpenTelemetryGenAI(span)).toBe(category);
  });

  it("should return 'unknown' when operation name attribute is missing", () => {
    expect(categorizeOpenTelemetryGenAI(createMockOpenTelemetrySpan())).toBe(
      "unknown",
    );
  });

  describe("real-world OpenTelemetry GenAI scenarios", () => {
    it("should categorize OpenAI chat completion spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "gpt-4",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "chat",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "openai",
        },
        name: "openai.chat.completions.create",
      });
      expect(categorizeOpenTelemetryGenAI(span)).toBe("llm_call");
    });

    it("should categorize Anthropic text generation spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "claude-3-sonnet",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "generate_content",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "anthropic",
        },
        name: "anthropic.messages.create",
      });
      expect(categorizeOpenTelemetryGenAI(span)).toBe("llm_call");
    });

    it("should categorize tool execution spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "execute_tool",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.TOOL_NAME]: "calculator",
        },
        name: "tool.calculator.execute",
      });
      expect(categorizeOpenTelemetryGenAI(span)).toBe("tool_execution");
    });

    it("should categorize agent invocation spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.AGENT_NAME]: "customer-support-agent",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "invoke_agent",
        },
        name: "agent.invoke",
      });
      expect(categorizeOpenTelemetryGenAI(span)).toBe("agent_invocation");
    });

    it("should categorize agent creation spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.AGENT_NAME]: "new-agent",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "create_agent",
        },
        name: "agent.create",
      });
      expect(categorizeOpenTelemetryGenAI(span)).toBe("create_agent");
    });

    it("should categorize embedding spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "text-embedding-ada-002",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "embeddings",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "openai",
        },
        name: "embeddings.create",
      });
      expect(categorizeOpenTelemetryGenAI(span)).toBe("embedding");
    });

    it("should categorize legacy text completion spans", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "gpt-3.5-turbo-instruct",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "text_completion",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "openai",
        },
        name: "completions.create",
      });
      expect(categorizeOpenTelemetryGenAI(span)).toBe("llm_call");
    });
  });

  describe("spans with multiple attributes", () => {
    it("should prioritize operation name over other attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "another.attribute": 123,
          "custom.attribute": "some_value",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.AGENT_NAME]: "some-agent",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "gpt-4",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "chat",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM]: "openai",
        },
        name: "complex span",
      });
      expect(categorizeOpenTelemetryGenAI(span)).toBe("llm_call");
    });

    it("should work with minimal attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME]: "execute_tool",
        },
        name: "minimal tool span",
      });
      expect(categorizeOpenTelemetryGenAI(span)).toBe("tool_execution");
    });
  });

  describe("spans from real trace examples", () => {
    it("should categorize spans from the provided trace examples", () => {
      const llmSpan = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.operation.name": "chat",
          "gen_ai.request.model": "gpt-4.1-mini",
          "gen_ai.usage.input_tokens": 200,
          "gen_ai.usage.output_tokens": 18,
        },
        name: "call_llm gpt-4.1-mini",
      });
      expect(categorizeOpenTelemetryGenAI(llmSpan)).toBe("llm_call");

      const toolSpan = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.operation.name": "execute_tool",
          "gen_ai.tool.name": "get_current_time",
        },
        name: "execute_tool get_current_time",
      });
      expect(categorizeOpenTelemetryGenAI(toolSpan)).toBe("tool_execution");
    });
  });
});
