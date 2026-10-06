import type { LangfuseObservation } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { createMockLangfuseObservation } from "../utils/create-mock-langfuse-observation.js";
import { getLangfuseAttributes } from "../utils/get-langfuse-attributes.js";

function createObservation(metadata?: unknown): LangfuseObservation {
  return createMockLangfuseObservation({ metadata });
}

describe("getLangfuseAttributes", () => {
  describe("metadata guards", () => {
    it("returns empty array when metadata is missing", () => {
      const span = createObservation();
      expect(getLangfuseAttributes(span)).toStrictEqual([]);
    });

    it("returns empty array when metadata is null", () => {
      const span = createObservation(null);
      expect(getLangfuseAttributes(span)).toStrictEqual([]);
    });

    it("returns empty array when metadata is not a string", () => {
      const span = createObservation({ some: "object" });
      expect(getLangfuseAttributes(span)).toStrictEqual([]);
    });

    it("returns empty array when metadata is invalid JSON", () => {
      const span = createObservation("{ invalid json");
      expect(getLangfuseAttributes(span)).toStrictEqual([]);
    });
  });

  describe("attributes extraction", () => {
    it("extracts primitive attributes from attributes field", () => {
      const metadata = JSON.stringify({
        attributes: {
          "gen_ai.request.model": "gpt-4",
          "http.status_code": 200,
          "retry.enabled": true,
        },
      });

      const span = createObservation(metadata);
      const result = getLangfuseAttributes(span);

      expect(result).toContainEqual({
        key: "gen_ai.request.model",
        value: { stringValue: "gpt-4" },
      });
      expect(result).toContainEqual({
        key: "http.status_code",
        value: { intValue: "200" },
      });
      expect(result).toContainEqual({
        key: "retry.enabled",
        value: { boolValue: true },
      });
      expect(result).toHaveLength(3);
    });

    it("extracts primitive attributes from resourceAttributes field", () => {
      const metadata = JSON.stringify({
        resourceAttributes: {
          "service.debug": false,
          "service.instance.id": 42,
          "service.name": "api",
        },
      });

      const span = createObservation(metadata);
      const result = getLangfuseAttributes(span);

      expect(result).toContainEqual({
        key: "service.name",
        value: { stringValue: "api" },
      });
      expect(result).toContainEqual({
        key: "service.instance.id",
        value: { intValue: "42" },
      });
      expect(result).toContainEqual({
        key: "service.debug",
        value: { boolValue: false },
      });
      expect(result).toHaveLength(3);
    });

    it("merges attributes from both attributes and resourceAttributes", () => {
      const metadata = JSON.stringify({
        attributes: {
          a: "x",
        },
        resourceAttributes: {
          b: 1,
        },
      });

      const span = createObservation(metadata);
      const result = getLangfuseAttributes(span);

      expect(result).toContainEqual({ key: "a", value: { stringValue: "x" } });
      expect(result).toContainEqual({ key: "b", value: { intValue: "1" } });
      expect(result).toHaveLength(2);
    });

    it("ignores non-primitive attribute values", () => {
      const metadata = JSON.stringify({
        attributes: {
          arr: [1, 2, 3],
          bool: true,
          nil: null,
          num: 10,
          obj: { nested: true },
          ok: "yes",
          undef: undefined,
        },
      });

      const span = createObservation(metadata);
      const result = getLangfuseAttributes(span);

      expect(result).toContainEqual({
        key: "ok",
        value: { stringValue: "yes" },
      });
      expect(result).toContainEqual({ key: "num", value: { intValue: "10" } });
      expect(result).toContainEqual({
        key: "bool",
        value: { boolValue: true },
      });

      expect(result.find((r) => r.key === "obj")).toBeUndefined();
      expect(result.find((r) => r.key === "arr")).toBeUndefined();
      expect(result.find((r) => r.key === "nil")).toBeUndefined();
      expect(result.find((r) => r.key === "undef")).toBeUndefined();
      expect(result).toHaveLength(3);
    });
  });
});
