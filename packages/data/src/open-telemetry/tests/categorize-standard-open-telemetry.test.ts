import type { TraceSpanCategory } from "@evilmartians/agent-prism-types";

import { STANDARD_OPENTELEMETRY_ATTRIBUTES } from "@evilmartians/agent-prism-types";
import { describe, expect, it } from "vitest";

import { categorizeStandardOpenTelemetry } from "../utils/categorize-standard-open-telemetry.js";
import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span.js";

describe("categorizeStandardOpenTelemetry", () => {
  describe("priority order detection", () => {
    it("should prioritize LLM call detection over other types", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "function.name": "some_function",
        },
        name: "openai function call",
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("llm_call");
    });

    it("should prioritize agent operation over chain operation", () => {
      const span = createMockOpenTelemetrySpan({
        name: "agent chain workflow",
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("agent_invocation");
    });

    it("should prioritize chain operation over retrieval operation", () => {
      const span = createMockOpenTelemetrySpan({
        name: "langchain vector search",
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("chain_operation");
    });

    it("should prioritize retrieval over function calls", () => {
      const span = createMockOpenTelemetrySpan({
        name: "pinecone function call",
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("retrieval");
    });

    it("should prioritize function calls over HTTP calls", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "function.name": "http_request",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "GET",
        },
        name: "tool operation",
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("tool_execution");
    });

    it("should prioritize HTTP calls over database calls", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: "mysql",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "POST",
        },
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("tool_execution");
    });
  });

  it.each<[string, TraceSpanCategory]>([
    ["openai completion", "llm_call"],
    ["anthropic claude call", "llm_call"],
    ["gpt-4 generation", "llm_call"],
    ["claude-3 sonnet", "llm_call"],
    ["OpenAI Call", "llm_call"],
    ["ANTHROPIC Generation", "llm_call"],
    ["GPT-4 Response", "llm_call"],
    ["agent execution", "agent_invocation"],
    ["Agent Runner", "agent_invocation"],
    ["chain execution", "chain_operation"],
    ["workflow runner", "chain_operation"],
    ["langchain qa", "chain_operation"],
    ["Chain Operation", "chain_operation"],
    ["WORKFLOW Execution", "chain_operation"],
    ["LangChain QA", "chain_operation"],
    ["pinecone query", "retrieval"],
    ["chroma search", "retrieval"],
    ["retrieval operation", "retrieval"],
    ["vector database", "retrieval"],
    ["search documents", "retrieval"],
    ["PINECONE Query", "retrieval"],
    ["Chroma Search", "retrieval"],
    ["VECTOR Database", "retrieval"],
    ["tool execution", "tool_execution"],
    ["function call", "tool_execution"],
    ["TOOL Execution", "tool_execution"],
    ["Function Call", "tool_execution"],
  ])("categorizes a span named %j as %s", (name, category) => {
    expect(
      categorizeStandardOpenTelemetry(createMockOpenTelemetrySpan({ name })),
    ).toBe(category);
  });

  it("should detect spans with function.name attribute", () => {
    const span = createMockOpenTelemetrySpan({
      attributes: {
        [STANDARD_OPENTELEMETRY_ATTRIBUTES.FUNCTION_NAME]: "my_function",
      },
      name: "custom operation",
    });
    expect(categorizeStandardOpenTelemetry(span)).toBe("tool_execution");
  });

  describe("HTTP call detection", () => {
    it("should detect HTTP spans by method attribute", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "GET",
        },
        name: "http request",
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("tool_execution");
    });

    it("should detect different HTTP methods", () => {
      const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

      methods.forEach((method) => {
        const span = createMockOpenTelemetrySpan({
          attributes: {
            [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: method,
          },
        });
        expect(categorizeStandardOpenTelemetry(span)).toBe("tool_execution");
      });
    });
  });

  describe("database call detection", () => {
    it("should detect database spans by system attribute", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: "mysql",
        },
        name: "database query",
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("tool_execution");
    });

    it("should detect different database systems", () => {
      const systems = ["mysql", "postgresql", "mongodb", "redis", "cassandra"];

      systems.forEach((system) => {
        const span = createMockOpenTelemetrySpan({
          attributes: {
            [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: system,
          },
        });
        expect(categorizeStandardOpenTelemetry(span)).toBe("tool_execution");
      });
    });
  });

  describe("unknown category", () => {
    it("should return 'unknown' for spans with no recognizable patterns", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {},
        name: "generic operation",
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("unknown");
    });

    it("should return 'unknown' for empty span name", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {},
        name: "",
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("unknown");
    });

    it("should return 'unknown' for spans with unrelated attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "another.field": 123,
          "custom.attribute": "value",
        },
        name: "custom span",
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("unknown");
    });
  });

  describe("real-world scenarios", () => {
    it("should categorize typical web service spans", () => {
      const httpSpan = createMockOpenTelemetrySpan({
        attributes: {
          "http.url": "/api/users",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "GET",
        },
        name: "GET /api/users",
      });
      expect(categorizeStandardOpenTelemetry(httpSpan)).toBe("tool_execution");
    });

    it("should categorize database query spans", () => {
      const dbSpan = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_OPERATION]: "SELECT",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: "postgresql",
        },
        name: "SELECT users FROM database",
      });
      expect(categorizeStandardOpenTelemetry(dbSpan)).toBe("tool_execution");
    });

    it("should categorize LangChain application spans", () => {
      const langchainSpan = createMockOpenTelemetrySpan({
        name: "langchain.chain.RetrievalQA.invoke",
      });
      expect(categorizeStandardOpenTelemetry(langchainSpan)).toBe(
        "chain_operation",
      );
    });

    it("should categorize vector database operations", () => {
      const vectorSpan = createMockOpenTelemetrySpan({
        name: "pinecone.index.query",
      });
      expect(categorizeStandardOpenTelemetry(vectorSpan)).toBe("retrieval");
    });

    it("should categorize custom tool functions", () => {
      const toolSpan = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.FUNCTION_NAME]: "calculator.add",
        },
        name: "calculator.add",
      });
      expect(categorizeStandardOpenTelemetry(toolSpan)).toBe("tool_execution");
    });
  });

  describe("edge cases and complex scenarios", () => {
    it("should handle spans with mixed keywords correctly based on priority", () => {
      const mixedSpan = createMockOpenTelemetrySpan({
        name: "openai agent tool function",
      });
      expect(categorizeStandardOpenTelemetry(mixedSpan)).toBe("llm_call");
    });

    it("should handle spans with only lower priority keywords", () => {
      const toolSpan = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: "mysql",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "POST",
        },
        name: "tool http database",
      });
      expect(categorizeStandardOpenTelemetry(toolSpan)).toBe("tool_execution");
    });

    it("should handle partial keyword matches", () => {
      const partialSpan = createMockOpenTelemetrySpan({
        name: "openai-like-service",
      });
      expect(categorizeStandardOpenTelemetry(partialSpan)).toBe("llm_call");
    });
  });
});
