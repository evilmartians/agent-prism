import { STANDARD_OPENTELEMETRY_ATTRIBUTES } from "@evilmartians/agent-prism-types";
import { describe, expect, it } from "vitest";

import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span";
import { openTelemetryCategoryMappers } from "../utils/open-telemetry-category-mappers";

describe("openTelemetryCategoryMappers", () => {
  describe("isHttpCall", () => {
    it("should detect HTTP calls by method attribute", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "GET",
        },
      });

      expect(openTelemetryCategoryMappers.isHttpCall(span)).toBe(true);
    });

    it("should detect different HTTP methods", () => {
      const methods = [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "HEAD",
        "OPTIONS",
      ];

      methods.forEach((method) => {
        const span = createMockOpenTelemetrySpan({
          attributes: {
            [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: method,
          },
        });
        expect(openTelemetryCategoryMappers.isHttpCall(span)).toBe(true);
      });
    });

    it("should not detect HTTP calls without method attribute", () => {
      const span = createMockOpenTelemetrySpan({
        name: "http request",
        attributes: {
          "http.url": "/api/users",
          "http.status_code": 200,
        },
      });

      expect(openTelemetryCategoryMappers.isHttpCall(span)).toBe(false);
    });

    it("should not detect HTTP calls with null method", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: null,
        },
      });

      expect(openTelemetryCategoryMappers.isHttpCall(span)).toBe(false);
    });

    it("should not detect HTTP calls with undefined method", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: undefined,
        },
      });

      expect(openTelemetryCategoryMappers.isHttpCall(span)).toBe(false);
    });

    it("should detect HTTP calls with empty string method", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "",
        },
      });

      expect(openTelemetryCategoryMappers.isHttpCall(span)).toBe(true);
    });
  });

  describe("isDatabaseCall", () => {
    it("should detect database calls by system attribute", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: "mysql",
        },
      });

      expect(openTelemetryCategoryMappers.isDatabaseCall(span)).toBe(true);
    });

    it("should detect different database systems", () => {
      const systems = [
        "mysql",
        "postgresql",
        "mongodb",
        "redis",
        "cassandra",
        "sqlite",
        "oracle",
      ];

      systems.forEach((system) => {
        const span = createMockOpenTelemetrySpan({
          attributes: {
            [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: system,
          },
        });
        expect(openTelemetryCategoryMappers.isDatabaseCall(span)).toBe(true);
      });
    });

    it("should not detect database calls without system attribute", () => {
      const span = createMockOpenTelemetrySpan({
        name: "database query",
        attributes: {
          "db.sql.table": "users",
          "db.operation.name": "SELECT",
        },
      });

      expect(openTelemetryCategoryMappers.isDatabaseCall(span)).toBe(false);
    });

    it("should not detect database calls with null system", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: null,
        },
      });

      expect(openTelemetryCategoryMappers.isDatabaseCall(span)).toBe(false);
    });

    it("should detect database calls with empty string system", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: "",
        },
      });

      expect(openTelemetryCategoryMappers.isDatabaseCall(span)).toBe(true);
    });
  });

  describe("isFunctionCall", () => {
    it("should detect function calls by name containing 'tool'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "tool execution",
      });

      expect(openTelemetryCategoryMappers.isFunctionCall(span)).toBe(true);
    });

    it("should detect function calls by name containing 'function'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "function call",
      });

      expect(openTelemetryCategoryMappers.isFunctionCall(span)).toBe(true);
    });

    it("should detect function calls by function.name attribute", () => {
      const span = createMockOpenTelemetrySpan({
        name: "custom operation",
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.FUNCTION_NAME]: "calculator.add",
        },
      });

      expect(openTelemetryCategoryMappers.isFunctionCall(span)).toBe(true);
    });

    it("should be case insensitive for name matching", () => {
      const spans = [
        createMockOpenTelemetrySpan({ name: "TOOL Execution" }),
        createMockOpenTelemetrySpan({ name: "Function Call" }),
        createMockOpenTelemetrySpan({ name: "My Tool" }),
        createMockOpenTelemetrySpan({ name: "Custom FUNCTION" }),
      ];

      spans.forEach((span) => {
        expect(openTelemetryCategoryMappers.isFunctionCall(span)).toBe(true);
      });
    });

    it("should detect function calls with both name and attribute", () => {
      const span = createMockOpenTelemetrySpan({
        name: "tool operation",
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.FUNCTION_NAME]: "my_function",
        },
      });

      expect(openTelemetryCategoryMappers.isFunctionCall(span)).toBe(true);
    });

    it("should not detect function calls without keywords or attributes", () => {
      const span = createMockOpenTelemetrySpan({
        name: "generic operation",
        attributes: {},
      });

      expect(openTelemetryCategoryMappers.isFunctionCall(span)).toBe(false);
    });

    it("should detect function calls with substring matches", () => {
      const spans = [
        createMockOpenTelemetrySpan({ name: "calculator-tool-execute" }),
        createMockOpenTelemetrySpan({ name: "my_function_call" }),
        createMockOpenTelemetrySpan({ name: "tooling-service" }),
        createMockOpenTelemetrySpan({ name: "functional-test" }),
      ];

      spans.forEach((span) => {
        expect(openTelemetryCategoryMappers.isFunctionCall(span)).toBe(true);
      });
    });
  });

  describe("isLLMCall", () => {
    it("should detect LLM calls by name containing 'openai'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "openai completion",
      });

      expect(openTelemetryCategoryMappers.isLLMCall(span)).toBe(true);
    });

    it("should detect LLM calls by name containing 'anthropic'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "anthropic claude call",
      });

      expect(openTelemetryCategoryMappers.isLLMCall(span)).toBe(true);
    });

    it("should detect LLM calls by name containing 'gpt'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "gpt-4 generation",
      });

      expect(openTelemetryCategoryMappers.isLLMCall(span)).toBe(true);
    });

    it("should detect LLM calls by name containing 'claude'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "claude-3 sonnet",
      });

      expect(openTelemetryCategoryMappers.isLLMCall(span)).toBe(true);
    });

    it("should be case insensitive for LLM detection", () => {
      const spans = [
        createMockOpenTelemetrySpan({ name: "OpenAI Call" }),
        createMockOpenTelemetrySpan({ name: "ANTHROPIC Generation" }),
        createMockOpenTelemetrySpan({ name: "GPT-4 Response" }),
        createMockOpenTelemetrySpan({ name: "Claude-3 SONNET" }),
      ];

      spans.forEach((span) => {
        expect(openTelemetryCategoryMappers.isLLMCall(span)).toBe(true);
      });
    });

    it("should detect LLM calls with substring matches", () => {
      const spans = [
        createMockOpenTelemetrySpan({ name: "call-openai-api" }),
        createMockOpenTelemetrySpan({ name: "anthropic-claude-request" }),
        createMockOpenTelemetrySpan({ name: "chatgpt-completion" }),
        createMockOpenTelemetrySpan({ name: "claude-response" }),
      ];

      spans.forEach((span) => {
        expect(openTelemetryCategoryMappers.isLLMCall(span)).toBe(true);
      });
    });

    it("should not detect LLM calls without keywords", () => {
      const span = createMockOpenTelemetrySpan({
        name: "generic llm call",
      });

      expect(openTelemetryCategoryMappers.isLLMCall(span)).toBe(false);
    });
  });

  describe("isChainOperation", () => {
    it("should detect chain operations by name containing 'chain'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "chain execution",
      });

      expect(openTelemetryCategoryMappers.isChainOperation(span)).toBe(true);
    });

    it("should detect chain operations by name containing 'workflow'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "workflow runner",
      });

      expect(openTelemetryCategoryMappers.isChainOperation(span)).toBe(true);
    });

    it("should detect chain operations by name containing 'langchain'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "langchain qa",
      });

      expect(openTelemetryCategoryMappers.isChainOperation(span)).toBe(true);
    });

    it("should be case insensitive for chain detection", () => {
      const spans = [
        createMockOpenTelemetrySpan({ name: "Chain Operation" }),
        createMockOpenTelemetrySpan({ name: "WORKFLOW Execution" }),
        createMockOpenTelemetrySpan({ name: "LangChain QA" }),
      ];

      spans.forEach((span) => {
        expect(openTelemetryCategoryMappers.isChainOperation(span)).toBe(true);
      });
    });

    it("should detect chain operations with substring matches", () => {
      const spans = [
        createMockOpenTelemetrySpan({ name: "service-chain-processor" }),
        createMockOpenTelemetrySpan({ name: "my-workflow-engine" }),
        createMockOpenTelemetrySpan({ name: "langchain-retrieval-qa" }),
      ];

      spans.forEach((span) => {
        expect(openTelemetryCategoryMappers.isChainOperation(span)).toBe(true);
      });
    });

    it("should not detect chain operations without keywords", () => {
      const span = createMockOpenTelemetrySpan({
        name: "generic operation",
      });

      expect(openTelemetryCategoryMappers.isChainOperation(span)).toBe(false);
    });
  });

  describe("isAgentOperation", () => {
    it("should detect agent operations by name containing 'agent'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "agent execution",
      });

      expect(openTelemetryCategoryMappers.isAgentOperation(span)).toBe(true);
    });

    it("should be case insensitive for agent detection", () => {
      const spans = [
        createMockOpenTelemetrySpan({ name: "Agent Runner" }),
        createMockOpenTelemetrySpan({ name: "AGENT Operation" }),
        createMockOpenTelemetrySpan({ name: "My Agent" }),
      ];

      spans.forEach((span) => {
        expect(openTelemetryCategoryMappers.isAgentOperation(span)).toBe(true);
      });
    });

    it("should detect agent operations with substring matches", () => {
      const spans = [
        createMockOpenTelemetrySpan({ name: "customer-agent-service" }),
        createMockOpenTelemetrySpan({ name: "ai-agent-workflow" }),
        createMockOpenTelemetrySpan({ name: "agent-based-system" }),
      ];

      spans.forEach((span) => {
        expect(openTelemetryCategoryMappers.isAgentOperation(span)).toBe(true);
      });
    });

    it("should not detect agent operations without keywords", () => {
      const span = createMockOpenTelemetrySpan({
        name: "generic operation",
      });

      expect(openTelemetryCategoryMappers.isAgentOperation(span)).toBe(false);
    });
  });

  describe("isRetrievalOperation", () => {
    it("should detect retrieval operations by name containing 'pinecone'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "pinecone query",
      });

      expect(openTelemetryCategoryMappers.isRetrievalOperation(span)).toBe(
        true,
      );
    });

    it("should detect retrieval operations by name containing 'chroma'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "chroma search",
      });

      expect(openTelemetryCategoryMappers.isRetrievalOperation(span)).toBe(
        true,
      );
    });

    it("should detect retrieval operations by name containing 'retrieval'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "retrieval operation",
      });

      expect(openTelemetryCategoryMappers.isRetrievalOperation(span)).toBe(
        true,
      );
    });

    it("should detect retrieval operations by name containing 'vector'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "vector database",
      });

      expect(openTelemetryCategoryMappers.isRetrievalOperation(span)).toBe(
        true,
      );
    });

    it("should detect retrieval operations by name containing 'search'", () => {
      const span = createMockOpenTelemetrySpan({
        name: "search documents",
      });

      expect(openTelemetryCategoryMappers.isRetrievalOperation(span)).toBe(
        true,
      );
    });

    it("should be case insensitive for retrieval detection", () => {
      const spans = [
        createMockOpenTelemetrySpan({ name: "PINECONE Query" }),
        createMockOpenTelemetrySpan({ name: "Chroma Search" }),
        createMockOpenTelemetrySpan({ name: "VECTOR Database" }),
        createMockOpenTelemetrySpan({ name: "Retrieval Operation" }),
        createMockOpenTelemetrySpan({ name: "SEARCH Documents" }),
      ];

      spans.forEach((span) => {
        expect(openTelemetryCategoryMappers.isRetrievalOperation(span)).toBe(
          true,
        );
      });
    });

    it("should detect retrieval operations with substring matches", () => {
      const spans = [
        createMockOpenTelemetrySpan({ name: "pinecone-index-query" }),
        createMockOpenTelemetrySpan({ name: "chroma-collection-search" }),
        createMockOpenTelemetrySpan({ name: "document-retrieval-service" }),
        createMockOpenTelemetrySpan({ name: "vector-similarity-search" }),
        createMockOpenTelemetrySpan({ name: "elasticsearch-search" }),
      ];

      spans.forEach((span) => {
        expect(openTelemetryCategoryMappers.isRetrievalOperation(span)).toBe(
          true,
        );
      });
    });

    it("should not detect retrieval operations without keywords", () => {
      const span = createMockOpenTelemetrySpan({
        name: "generic operation",
      });

      expect(openTelemetryCategoryMappers.isRetrievalOperation(span)).toBe(
        false,
      );
    });
  });

  describe("multiple detection methods", () => {
    it("should handle spans that match multiple detection methods", () => {
      const span = createMockOpenTelemetrySpan({
        name: "openai tool function", // Matches LLM + function + tool keywords
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.FUNCTION_NAME]: "openai_call",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "POST",
        },
      });

      expect(openTelemetryCategoryMappers.isLLMCall(span)).toBe(true);
      expect(openTelemetryCategoryMappers.isFunctionCall(span)).toBe(true);
      expect(openTelemetryCategoryMappers.isHttpCall(span)).toBe(true);
      expect(openTelemetryCategoryMappers.isAgentOperation(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isChainOperation(span)).toBe(false);
    });

    it("should handle spans that match no detection methods", () => {
      const span = createMockOpenTelemetrySpan({
        name: "generic operation",
        attributes: {
          "custom.field": "custom_value",
        },
      });

      expect(openTelemetryCategoryMappers.isLLMCall(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isFunctionCall(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isHttpCall(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isAgentOperation(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isChainOperation(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isDatabaseCall(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isRetrievalOperation(span)).toBe(
        false,
      );
    });
  });

  describe("real-world scenarios", () => {
    it("should detect typical web service HTTP spans", () => {
      const span = createMockOpenTelemetrySpan({
        name: "GET /api/users",
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: "GET",
          "http.url": "/api/users",
          "http.status_code": 200,
        },
      });

      expect(openTelemetryCategoryMappers.isHttpCall(span)).toBe(true);
    });

    it("should detect database query spans", () => {
      const span = createMockOpenTelemetrySpan({
        name: "SELECT users FROM database",
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: "postgresql",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_OPERATION]: "SELECT",
        },
      });

      expect(openTelemetryCategoryMappers.isDatabaseCall(span)).toBe(true);
    });

    it("should detect LangChain application spans", () => {
      const span = createMockOpenTelemetrySpan({
        name: "langchain.chain.RetrievalQA.invoke",
      });

      expect(openTelemetryCategoryMappers.isChainOperation(span)).toBe(true);
    });

    it("should detect vector database operations", () => {
      const span = createMockOpenTelemetrySpan({
        name: "pinecone.index.query",
      });

      expect(openTelemetryCategoryMappers.isRetrievalOperation(span)).toBe(
        true,
      );
    });

    it("should detect custom tool functions", () => {
      const span = createMockOpenTelemetrySpan({
        name: "calculator.add",
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.FUNCTION_NAME]: "calculator.add",
        },
      });

      expect(openTelemetryCategoryMappers.isFunctionCall(span)).toBe(true);
    });

    it("should detect OpenAI API calls as LLM operations", () => {
      const span = createMockOpenTelemetrySpan({
        name: "openai.chat.completions.create",
      });

      expect(openTelemetryCategoryMappers.isLLMCall(span)).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle empty span names", () => {
      const span = createMockOpenTelemetrySpan({
        name: "",
        attributes: {},
      });

      expect(openTelemetryCategoryMappers.isLLMCall(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isFunctionCall(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isChainOperation(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isAgentOperation(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isRetrievalOperation(span)).toBe(
        false,
      );
    });

    it("should handle spans with only whitespace in names", () => {
      const span = createMockOpenTelemetrySpan({
        name: "   ",
        attributes: {},
      });

      expect(openTelemetryCategoryMappers.isLLMCall(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isFunctionCall(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isChainOperation(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isAgentOperation(span)).toBe(false);
      expect(openTelemetryCategoryMappers.isRetrievalOperation(span)).toBe(
        false,
      );
    });

    it("should handle attribute values of different types", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD]: 200, // number instead of string
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM]: true, // boolean instead of string
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.FUNCTION_NAME]: [], // array instead of string
        },
      });

      expect(openTelemetryCategoryMappers.isHttpCall(span)).toBe(true); // 200 is truthy
      expect(openTelemetryCategoryMappers.isDatabaseCall(span)).toBe(true); // true is truthy
      expect(openTelemetryCategoryMappers.isFunctionCall(span)).toBe(true); // [] is truthy
    });
  });
});
