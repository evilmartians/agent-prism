import { describe, it, expect } from "vitest";

import { openTelemetrySpanAdapter } from "../adapter";
import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span";

describe("openTelemetrySpanAdapter.getAttributeValue", () => {
  describe("string values", () => {
    it("should return string values directly", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "gpt-4",
          "http.method": "POST",
          "db.collection.name": "users",
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(
          span,
          "gen_ai.request.model",
        ),
      ).toBe("gpt-4");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "http.method"),
      ).toBe("POST");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "db.collection.name"),
      ).toBe("users");
    });

    it("should handle empty strings", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "empty.field": "",
        },
      });

      const result = openTelemetrySpanAdapter.getAttributeValue(
        span,
        "empty.field",
      );

      expect(result).toBe("");
    });

    it("should handle strings with special characters", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "query.text": "What is 2+2? Let me know ASAP!",
          "user.email": "test@example.com",
          "json.data": '{"key": "value", "nested": {"count": 42}}',
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "query.text"),
      ).toBe("What is 2+2? Let me know ASAP!");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "user.email"),
      ).toBe("test@example.com");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "json.data"),
      ).toBe('{"key": "value", "nested": {"count": 42}}');
    });
  });

  describe("number values", () => {
    it("should return number values directly", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.usage.total_tokens": 150,
          "http.status_code": 200,
          "vector.top_k": 5,
          "gen_ai.usage.cost": 0.0045,
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(
          span,
          "gen_ai.usage.total_tokens",
        ),
      ).toBe(150);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "http.status_code"),
      ).toBe(200);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "vector.top_k"),
      ).toBe(5);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "gen_ai.usage.cost"),
      ).toBe(0.0045);
    });

    it("should handle zero values", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "retry.attempt": 0,
          "gen_ai.usage.cost": 0,
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "retry.attempt"),
      ).toBe(0);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "gen_ai.usage.cost"),
      ).toBe(0);
    });

    it("should handle negative numbers", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          temperature: -5.5,
          offset: -100,
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "temperature"),
      ).toBe(-5.5);
      expect(openTelemetrySpanAdapter.getAttributeValue(span, "offset")).toBe(
        -100,
      );
    });

    it("should handle special number values", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "nan.value": NaN,
          "infinity.value": Infinity,
          "negative.infinity": -Infinity,
          "min.value": Number.MIN_VALUE,
          "max.value": Number.MAX_VALUE,
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "nan.value"),
      ).toBeNaN();
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "infinity.value"),
      ).toBe(Infinity);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "negative.infinity"),
      ).toBe(-Infinity);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "min.value"),
      ).toBe(Number.MIN_VALUE);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "max.value"),
      ).toBe(Number.MAX_VALUE);
    });
  });

  describe("boolean values", () => {
    it("should return boolean values directly", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.streaming": true,
          "retry.enabled": false,
          "cache.hit": true,
          "error.occurred": false,
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "gen_ai.streaming"),
      ).toBe(true);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "retry.enabled"),
      ).toBe(false);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "cache.hit"),
      ).toBe(true);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "error.occurred"),
      ).toBe(false);
    });
  });

  describe("array values", () => {
    it("should convert string arrays to comma-separated strings", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "agent.tools": ["calculator", "search", "wikipedia"],
          "supported.models": ["gpt-3.5-turbo", "gpt-4"],
          tags: ["ai", "ml", "nlp"],
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "agent.tools"),
      ).toBe("calculator, search, wikipedia");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "supported.models"),
      ).toBe("gpt-3.5-turbo, gpt-4");
      expect(openTelemetrySpanAdapter.getAttributeValue(span, "tags")).toBe(
        "ai, ml, nlp",
      );
    });

    it("should convert number arrays to comma-separated strings", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "port.numbers": [8080, 8081, 8082],
          scores: [95.5, 87.2, 92.1],
          indices: [0, 1, 2, 5, 10],
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "port.numbers"),
      ).toBe("8080, 8081, 8082");
      expect(openTelemetrySpanAdapter.getAttributeValue(span, "scores")).toBe(
        "95.5, 87.2, 92.1",
      );
      expect(openTelemetrySpanAdapter.getAttributeValue(span, "indices")).toBe(
        "0, 1, 2, 5, 10",
      );
    });

    it("should convert boolean arrays to comma-separated strings", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "feature.flags": [true, false, true],
          validations: [false, false, true, true],
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "feature.flags"),
      ).toBe("true, false, true");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "validations"),
      ).toBe("false, false, true, true");
    });

    it("should convert mixed arrays to comma-separated strings", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "mixed.values": ["text", 42, true, "another"],
          "config.values": [100, "auto", false],
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "mixed.values"),
      ).toBe("text, 42, true, another");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "config.values"),
      ).toBe("100, auto, false");
    });

    it("should handle empty arrays", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "empty.array": [],
        },
      });

      const result = openTelemetrySpanAdapter.getAttributeValue(
        span,
        "empty.array",
      );

      expect(result).toBe("");
    });

    it("should handle arrays with null and undefined values", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "sparse.array": ["value1", null, undefined, "value2"],
          "null.array": [null, null],
          "undefined.array": [undefined, undefined],
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "sparse.array"),
      ).toBe("value1, , , value2");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "null.array"),
      ).toBe(", ");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "undefined.array"),
      ).toBe(", ");
    });
  });

  describe("null and undefined values", () => {
    it("should return undefined for null values", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "null.field": null,
        },
      });

      const result = openTelemetrySpanAdapter.getAttributeValue(
        span,
        "null.field",
      );

      expect(result).toBeUndefined();
    });

    it("should return undefined for undefined values", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "undefined.field": undefined,
        },
      });

      const result = openTelemetrySpanAdapter.getAttributeValue(
        span,
        "undefined.field",
      );

      expect(result).toBeUndefined();
    });

    it("should return undefined for non-existent keys", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "existing.key": "value",
        },
      });

      const result = openTelemetrySpanAdapter.getAttributeValue(
        span,
        "non.existent.key",
      );

      expect(result).toBeUndefined();
    });
  });

  describe("real-world OpenTelemetry scenarios", () => {
    it("should handle typical LLM span attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "gen_ai.request.model": "gpt-4",
          "gen_ai.usage.input_tokens": 150,
          "gen_ai.usage.output_tokens": 75,
          "gen_ai.usage.total_tokens": 225,
          "gen_ai.usage.cost": 0.0045,
          "gen_ai.request.temperature": 0.7,
          "gen_ai.streaming": false,
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(
          span,
          "gen_ai.request.model",
        ),
      ).toBe("gpt-4");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(
          span,
          "gen_ai.usage.input_tokens",
        ),
      ).toBe(150);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(
          span,
          "gen_ai.usage.output_tokens",
        ),
      ).toBe(75);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(
          span,
          "gen_ai.usage.total_tokens",
        ),
      ).toBe(225);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "gen_ai.usage.cost"),
      ).toBe(0.0045);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(
          span,
          "gen_ai.request.temperature",
        ),
      ).toBe(0.7);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "gen_ai.streaming"),
      ).toBe(false);
    });

    it("should handle typical HTTP span attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "http.method": "POST",
          "http.url": "https://api.openai.com/v1/chat/completions",
          "http.status_code": 200,
          "http.request.header.content-type": "application/json",
          "http.response.header.x-ratelimit-remaining": "59",
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "http.method"),
      ).toBe("POST");
      expect(openTelemetrySpanAdapter.getAttributeValue(span, "http.url")).toBe(
        "https://api.openai.com/v1/chat/completions",
      );
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "http.status_code"),
      ).toBe(200);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(
          span,
          "http.request.header.content-type",
        ),
      ).toBe("application/json");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(
          span,
          "http.response.header.x-ratelimit-remaining",
        ),
      ).toBe("59");
    });

    it("should handle typical database span attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "db.system": "pinecone",
          "db.operation.name": "query",
          "db.collection.name": "embeddings",
          "db.query.text": "SELECT * FROM vectors WHERE similarity > 0.8",
          "vector.top_k": 10,
          "vector.include_metadata": true,
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "db.system"),
      ).toBe("pinecone");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "db.operation.name"),
      ).toBe("query");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "db.collection.name"),
      ).toBe("embeddings");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "db.query.text"),
      ).toBe("SELECT * FROM vectors WHERE similarity > 0.8");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "vector.top_k"),
      ).toBe(10);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(
          span,
          "vector.include_metadata",
        ),
      ).toBe(true);
    });

    it("should handle agent and tool attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "agent.name": "ReAct Agent",
          "agent.tools": ["calculator", "search", "wikipedia", "weather"],
          "function.name": "get_weather",
          "function.parameters": '{"location": "Paris", "units": "metric"}',
          "langchain.chain": "RetrievalQA",
          "langchain.chain.type": "stuff",
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "agent.name"),
      ).toBe("ReAct Agent");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "agent.tools"),
      ).toBe("calculator, search, wikipedia, weather");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "function.name"),
      ).toBe("get_weather");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "function.parameters"),
      ).toBe('{"location": "Paris", "units": "metric"}');
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "langchain.chain"),
      ).toBe("RetrievalQA");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(
          span,
          "langchain.chain.type",
        ),
      ).toBe("stuff");
    });

    it("should handle error and retry attributes", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "error.type": "rate_limit_exceeded",
          "error.message": "API rate limit exceeded",
          "retry.attempt": 3,
          "retry.max_attempts": 5,
          "retry.delay_ms": 1000,
          "retry.successful": true,
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "error.type"),
      ).toBe("rate_limit_exceeded");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "error.message"),
      ).toBe("API rate limit exceeded");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "retry.attempt"),
      ).toBe(3);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "retry.max_attempts"),
      ).toBe(5);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "retry.delay_ms"),
      ).toBe(1000);
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "retry.successful"),
      ).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle empty attribute key", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "": "empty-key-value",
          "normal.key": "normal-value",
        },
      });

      expect(openTelemetrySpanAdapter.getAttributeValue(span, "")).toBe(
        "empty-key-value",
      );
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "normal.key"),
      ).toBe("normal-value");
    });

    it("should handle keys with special characters", () => {
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "key.with-dashes": "dash-value",
          key_with_underscores: "underscore-value",
          "key with spaces": "space-value",
          "key@with#symbols%": "symbol-value",
        },
      });

      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "key.with-dashes"),
      ).toBe("dash-value");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(
          span,
          "key_with_underscores",
        ),
      ).toBe("underscore-value");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "key with spaces"),
      ).toBe("space-value");
      expect(
        openTelemetrySpanAdapter.getAttributeValue(span, "key@with#symbols%"),
      ).toBe("symbol-value");
    });

    it("should handle very long strings", () => {
      const longString = "a".repeat(10000);
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "long.string": longString,
        },
      });

      const result = openTelemetrySpanAdapter.getAttributeValue(
        span,
        "long.string",
      );

      expect(result).toBe(longString);
      expect(typeof result).toBe("string");
    });

    it("should handle arrays with very long strings", () => {
      const longString1 = "first-" + "a".repeat(1000);
      const longString2 = "second-" + "b".repeat(1000);
      const span = createMockOpenTelemetrySpan({
        attributes: {
          "long.array": [longString1, longString2],
        },
      });

      const result = openTelemetrySpanAdapter.getAttributeValue(
        span,
        "long.array",
      );

      expect(result).toBe(`${longString1}, ${longString2}`);
    });
  });
});
