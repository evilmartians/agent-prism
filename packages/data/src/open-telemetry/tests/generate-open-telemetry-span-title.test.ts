import {
  OPENTELEMETRY_GENAI_ATTRIBUTES,
  STANDARD_OPENTELEMETRY_ATTRIBUTES,
} from "@evilmartians/agent-prism-types";
import { describe, expect, it } from "vitest";

import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span.js";
import { generateOpenTelemetrySpanTitle } from "../utils/generate-open-telemetry-span-title.js";

describe("generateOpenTelemetrySpanTitle", () => {
  describe("LLM operations", () => {
    it("should use model name for LLM operations", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "gpt-4",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_TOTAL_TOKENS]: 150,
        },
        name: "chat.completions.create",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("gpt-4 - chat.completions.create");
    });

    it("should handle different LLM models", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "claude-3-sonnet",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.USAGE_TOTAL_TOKENS]: 0.0245,
        },
        name: "messages.create",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("claude-3-sonnet - messages.create");
    });

    it("should handle model as different data types", () => {
      const spanWithStringModel = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "gpt-3.5-turbo",
        },
        name: "completion",
      });

      const spanWithNumberModel = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: 123,
        },
        name: "completion",
      });

      expect(generateOpenTelemetrySpanTitle(spanWithStringModel)).toBe(
        "gpt-3.5-turbo - completion",
      );
      expect(generateOpenTelemetrySpanTitle(spanWithNumberModel)).toBe(
        "123 - completion",
      );
    });
  });

  describe("Vector DB operations", () => {
    it("should use collection and operation for vector DB operations", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_COLLECTION]: "embeddings",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_OPERATION]: "query",
        },
        name: "vector_search",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("embeddings - query");
    });

    it("should handle different vector DB operations", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_COLLECTION]: "documents",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_OPERATION]: "upsert",
        },
        name: "pinecone_upsert",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("documents - upsert");
    });

    it("should fall back to span name when collection is missing", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_OPERATION]: "query",
        },
        name: "vector_search",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("vector_search");
    });

    it("should fall back to span name when operation is missing", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_COLLECTION]: "embeddings",
        },
        name: "vector_search",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("vector_search");
    });

    it("should fall back to span name when both collection and operation are missing", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {},
        name: "vector_search",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("vector_search");
    });
  });

  describe("HTTP operations", () => {
    it("should use method and URL for HTTP operations", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "http.method": "POST",
          "http.url": "https://api.example.com/users",
        },
        name: "http_request",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("POST https://api.example.com/users");
    });

    it("should handle different HTTP methods", () => {
      const getSpan = createMockOpenTelemetrySpan({
        attributes: {
          "http.method": "GET",
          "http.url": "https://api.weather.com/v1/current",
        },
        name: "fetch",
      });

      const putSpan = createMockOpenTelemetrySpan({
        attributes: {
          "http.method": "PUT",
          "http.url": "https://api.example.com/users/123",
        },
        name: "update_user",
      });

      expect(generateOpenTelemetrySpanTitle(getSpan)).toBe(
        "GET https://api.weather.com/v1/current",
      );
      expect(generateOpenTelemetrySpanTitle(putSpan)).toBe(
        "PUT https://api.example.com/users/123",
      );
    });

    it("should fall back to span name when method is missing", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "http.url": "https://api.example.com/users",
        },
        name: "http_request",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("http_request");
    });

    it("should fall back to span name when URL is missing", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "http.method": "POST",
        },
        name: "http_request",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("http_request");
    });
  });

  describe("priority order", () => {
    it("should prioritize LLM model over vector DB attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "gpt-4",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_COLLECTION]: "embeddings",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_OPERATION]: "query",
        },
        name: "mixed_operation",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("gpt-4 - mixed_operation");
    });

    it("should prioritize LLM model over HTTP attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "http.method": "POST",
          "http.url": "https://api.anthropic.com/v1/messages",
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: "claude-3-sonnet",
        },
        name: "mixed_operation",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("claude-3-sonnet - mixed_operation");
    });

    it("should prioritize vector DB over HTTP attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "http.method": "POST",
          "http.url": "https://api.pinecone.io/vectors/query",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_COLLECTION]: "documents",
          [STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_OPERATION]: "search",
        },
        name: "mixed_operation",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("documents - search");
    });
  });

  describe("fallback behavior", () => {
    it("should return span name when no special attributes are present", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "custom.metric": 42,
          "some.other.attribute": "value",
        },
        name: "generic_operation",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("generic_operation");
    });

    it("should handle empty span name", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {},
        name: "",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("");
    });
  });

  describe("real-world scenarios", () => {
    it("should handle OpenAI API call", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "gpt-4",
          "gen_ai.request.temperature": 0.7,
          "gen_ai.usage.input_tokens": 150,
          "gen_ai.usage.output_tokens": 75,
        },
        name: "openai.chat.completions.create",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("gpt-4 - openai.chat.completions.create");
    });

    it("should handle Anthropic API call", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "claude-3-sonnet",
          "gen_ai.usage.input_tokens": 1250,
          "gen_ai.usage.output_tokens": 380,
        },
        name: "anthropic.messages.create",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("claude-3-sonnet - anthropic.messages.create");
    });

    it("should handle Pinecone vector search", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "db.collection.name": "research_papers",
          "db.operation.name": "similarity_search",
          "vector.top_k": 5,
        },
        name: "pinecone.query",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("research_papers - similarity_search");
    });

    it("should handle Chroma vector operations", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "db.collection.name": "document_embeddings",
          "db.operation.name": "query",
          "db.query.text": "quantum computing",
        },
        name: "chroma.collection.query",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("document_embeddings - query");
    });

    it("should handle REST API calls", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "http.method": "GET",
          "http.status_code": 200,
          "http.url": "https://api.openweathermap.org/data/2.5/weather",
        },
        name: "fetch_weather_data",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe(
        "GET https://api.openweathermap.org/data/2.5/weather",
      );
    });

    it("should handle tool function calls without special attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "function.name": "calculate_tip",
          "function.parameters": '{"bill_amount": 50, "tip_percentage": 20}',
        },
        name: "calculate_tip",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("calculate_tip");
    });

    it("should handle LangChain operations without special title attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "langchain.chain": "RetrievalQA",
          "langchain.chain.type": "stuff",
        },
        name: "langchain.chain.invoke",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("langchain.chain.invoke");
    });
  });

  describe("edge cases with attribute types", () => {
    it("should handle boolean values", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          [OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL]: true,
        },
        name: "test",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("true - test");
    });

    it("should handle numeric values for string fields", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "http.method": 404,
          "http.url": "https://api.example.com/not-found",
        },
        name: "http_request",
      });

      const result = generateOpenTelemetrySpanTitle(span);

      expect(result).toBe("404 https://api.example.com/not-found");
    });
  });
});
