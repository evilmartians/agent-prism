import { STANDARD_OPENTELEMETRY_ATTRIBUTES } from "@evilmartians/agent-prism-types";
import { describe, expect, it } from "vitest";

import { categorizeStandardOpenTelemetry } from "../utils/categorize-standard-open-telemetry";
import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span";

describe("categorizeStandardOpenTelemetry", () => {
  describe("priority order detection", () => {
    it("should prioritize LLM call detection over other types", () => {
      const span = createMockOpenTelemetrySpan({
        name: "openai function call", // Contains both 'openai' and 'function'
        attributes: {
          "function.name": "some_function",
        },
      });
      // Should return llm_call due to 'openai' in name, not tool_execution for function
      expect(categorizeStandardOpenTelemetry(span)).toBe("llm_call");
    });

    it("should prioritize agent operation over chain operation", () => {
      const span = createMockOpenTelemetrySpan({
        name: "agent chain workflow", // Contains 'agent', 'chain', and 'workflow'
      });
      // Should return agent_invocation due to priority order
      expect(categorizeStandardOpenTelemetry(span)).toBe("agent_invocation");
    });

    it("should prioritize chain operation over retrieval operation", () => {
      const span = createMockOpenTelemetrySpan({
        name: "langchain vector search", // Contains 'langchain' and 'search'
      });
      // Should return chain_operation due to priority order
      expect(categorizeStandardOpenTelemetry(span)).toBe("chain_operation");
    });

    it("should prioritize retrieval over function calls", () => {
      const span = createMockOpenTelemetrySpan({
        name: "pinecone function call", // Contains 'pinecone' and 'function'
      });
      // Should return retrieval due to priority order
      expect(categorizeStandardOpenTelemetry(span)).toBe("retrieval");
    });

    it("should prioritize function calls over HTTP calls", () => {
      const span = createMockOpenTelemetrySpan({
        name: "tool operation",
        attributes: {
          "function.name": "http_request",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "GET",
        },
      });
      // Should return tool_execution due to function call priority
      expect(categorizeStandardOpenTelemetry(span)).toBe("tool_execution");
    });

    it("should prioritize HTTP calls over database calls", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "POST",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: "mysql",
        },
      });
      // Should return tool_execution due to HTTP priority
      expect(categorizeStandardOpenTelemetry(span)).toBe("tool_execution");
    });
  });

  describe("LLM call detection", () => {
    it("should detect OpenAI spans", () => {
      const span = createMockOpenTelemetrySpan({ name: "openai completion" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("llm_call");
    });

    it("should detect Anthropic spans", () => {
      const span = createMockOpenTelemetrySpan({
        name: "anthropic claude call",
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("llm_call");
    });

    it("should detect GPT spans", () => {
      const span = createMockOpenTelemetrySpan({ name: "gpt-4 generation" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("llm_call");
    });

    it("should detect Claude spans", () => {
      const span = createMockOpenTelemetrySpan({ name: "claude-3 sonnet" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("llm_call");
    });

    it("should be case insensitive for LLM detection", () => {
      const spans = [
        createMockOpenTelemetrySpan({ name: "OpenAI Call" }),
        createMockOpenTelemetrySpan({ name: "ANTHROPIC Generation" }),
        createMockOpenTelemetrySpan({ name: "GPT-4 Response" }),
      ];

      spans.forEach((span) => {
        expect(categorizeStandardOpenTelemetry(span)).toBe("llm_call");
      });
    });
  });

  describe("agent operation detection", () => {
    it("should detect agent spans by name", () => {
      const span = createMockOpenTelemetrySpan({ name: "agent execution" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("agent_invocation");
    });

    it("should be case insensitive for agent detection", () => {
      const span = createMockOpenTelemetrySpan({ name: "Agent Runner" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("agent_invocation");
    });
  });

  describe("chain operation detection", () => {
    it("should detect chain spans by name", () => {
      const span = createMockOpenTelemetrySpan({ name: "chain execution" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("chain_operation");
    });

    it("should detect workflow spans", () => {
      const span = createMockOpenTelemetrySpan({ name: "workflow runner" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("chain_operation");
    });

    it("should detect langchain spans", () => {
      const span = createMockOpenTelemetrySpan({ name: "langchain qa" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("chain_operation");
    });

    it("should be case insensitive for chain detection", () => {
      const spans = [
        createMockOpenTelemetrySpan({ name: "Chain Operation" }),
        createMockOpenTelemetrySpan({ name: "WORKFLOW Execution" }),
        createMockOpenTelemetrySpan({ name: "LangChain QA" }),
      ];

      spans.forEach((span) => {
        expect(categorizeStandardOpenTelemetry(span)).toBe("chain_operation");
      });
    });
  });

  describe("retrieval operation detection", () => {
    it("should detect pinecone spans", () => {
      const span = createMockOpenTelemetrySpan({ name: "pinecone query" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("retrieval");
    });

    it("should detect chroma spans", () => {
      const span = createMockOpenTelemetrySpan({ name: "chroma search" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("retrieval");
    });

    it("should detect retrieval spans", () => {
      const span = createMockOpenTelemetrySpan({ name: "retrieval operation" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("retrieval");
    });

    it("should detect vector spans", () => {
      const span = createMockOpenTelemetrySpan({ name: "vector database" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("retrieval");
    });

    it("should detect search spans", () => {
      const span = createMockOpenTelemetrySpan({ name: "search documents" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("retrieval");
    });

    it("should be case insensitive for retrieval detection", () => {
      const spans = [
        createMockOpenTelemetrySpan({ name: "PINECONE Query" }),
        createMockOpenTelemetrySpan({ name: "Chroma Search" }),
        createMockOpenTelemetrySpan({ name: "VECTOR Database" }),
      ];

      spans.forEach((span) => {
        expect(categorizeStandardOpenTelemetry(span)).toBe("retrieval");
      });
    });
  });

  describe("function call detection", () => {
    it("should detect spans with tool in name", () => {
      const span = createMockOpenTelemetrySpan({ name: "tool execution" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("tool_execution");
    });

    it("should detect spans with function in name", () => {
      const span = createMockOpenTelemetrySpan({ name: "function call" });
      expect(categorizeStandardOpenTelemetry(span)).toBe("tool_execution");
    });

    it("should detect spans with function.name attribute", () => {
      const span = createMockOpenTelemetrySpan({
        name: "custom operation",
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.FUNCTION_NAME]: "my_function",
        },
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("tool_execution");
    });

    it("should be case insensitive for function detection", () => {
      const spans = [
        createMockOpenTelemetrySpan({ name: "TOOL Execution" }),
        createMockOpenTelemetrySpan({ name: "Function Call" }),
      ];

      spans.forEach((span) => {
        expect(categorizeStandardOpenTelemetry(span)).toBe("tool_execution");
      });
    });
  });

  describe("HTTP call detection", () => {
    it("should detect HTTP spans by method attribute", () => {
      const span = createMockOpenTelemetrySpan({
        name: "http request",
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "GET",
        },
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
        name: "database query",
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: "mysql",
        },
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
        name: "generic operation",
        attributes: {},
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("unknown");
    });

    it("should return 'unknown' for empty span name", () => {
      const span = createMockOpenTelemetrySpan({
        name: "",
        attributes: {},
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("unknown");
    });

    it("should return 'unknown' for spans with unrelated attributes", () => {
      const span = createMockOpenTelemetrySpan({
        name: "custom span",
        attributes: {
          "custom.attribute": "value",
          "another.field": 123,
        },
      });
      expect(categorizeStandardOpenTelemetry(span)).toBe("unknown");
    });
  });

  describe("real-world scenarios", () => {
    it("should categorize typical web service spans", () => {
      const httpSpan = createMockOpenTelemetrySpan({
        name: "GET /api/users",
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "GET",
          "http.url": "/api/users",
        },
      });
      expect(categorizeStandardOpenTelemetry(httpSpan)).toBe("tool_execution");
    });

    it("should categorize database query spans", () => {
      const dbSpan = createMockOpenTelemetrySpan({
        name: "SELECT users FROM database",
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: "postgresql",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_OPERATION]: "SELECT",
        },
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
        name: "calculator.add",
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.FUNCTION_NAME]: "calculator.add",
        },
      });
      expect(categorizeStandardOpenTelemetry(toolSpan)).toBe("tool_execution");
    });
  });

  describe("edge cases and complex scenarios", () => {
    it("should handle spans with mixed keywords correctly based on priority", () => {
      // This span contains keywords for multiple categories
      const mixedSpan = createMockOpenTelemetrySpan({
        name: "openai agent tool function", // openai (llm) + agent + tool + function
      });
      // Should prioritize llm_call (highest priority)
      expect(categorizeStandardOpenTelemetry(mixedSpan)).toBe("llm_call");
    });

    it("should handle spans with only lower priority keywords", () => {
      const toolSpan = createMockOpenTelemetrySpan({
        name: "tool http database", // tool + http + database (all tool_execution)
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "POST",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: "mysql",
        },
      });
      // Should return tool_execution (function call has higher priority than http/db)
      expect(categorizeStandardOpenTelemetry(toolSpan)).toBe("tool_execution");
    });

    it("should handle partial keyword matches", () => {
      const partialSpan = createMockOpenTelemetrySpan({
        name: "openai-like-service", // Contains 'openai' substring
      });
      expect(categorizeStandardOpenTelemetry(partialSpan)).toBe("llm_call");
    });
  });
});
