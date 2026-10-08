import { describe, expect, it } from "vitest";

import { isTraceSpanLike, reviveTraceSpan } from "./revive-trace-span.js";
import { createTestSpan } from "./test-utils/create-test-span.js";

type OverrideRow = readonly [string, Readonly<Record<string, unknown>>];

const baseJSON = {
  endTime: "2024-01-01T00:00:02.500Z",
  id: "span-1",
  raw: [],
  startTime: "2024-01-01T00:00:00.000Z",
  status: "success",
  title: "ChatCompletion",
  type: "llm_call",
};

describe("isTraceSpanLike", () => {
  it("accepts a plain payload without derived fields", () => {
    expect(isTraceSpanLike(baseJSON)).toBe(true);
  });

  it("rejects a payload missing a required field", () => {
    expect(isTraceSpanLike({ ...baseJSON, status: undefined })).toBe(false);
  });

  it.each<OverrideRow>([
    ["an unknown status", { status: "failed" }],
    ["an unknown type", { type: "llm" }],
    ["an unparseable startTime", { startTime: "yesterday" }],
    ["an unparseable endTime", { endTime: Number.NaN }],
    ["a non-timestamp endTime", { endTime: { at: 1 } }],
  ])("rejects %s", (_label, override) => {
    expect(isTraceSpanLike({ ...baseJSON, ...override })).toBe(false);
  });

  it("accepts epoch-millisecond timestamps", () => {
    expect(isTraceSpanLike({ ...baseJSON, endTime: 1_000, startTime: 0 })).toBe(
      true,
    );
  });

  it("rejects a raw that is not a list of strings", () => {
    expect(isTraceSpanLike({ ...baseJSON, raw: "{}" })).toBe(false);
    expect(isTraceSpanLike({ ...baseJSON, raw: ["{}", 42] })).toBe(false);
  });

  it("rejects non-objects", () => {
    expect(isTraceSpanLike(null)).toBe(false);
    expect(isTraceSpanLike("span")).toBe(false);
  });
});

describe("reviveTraceSpan", () => {
  it("survives a JSON round-trip", () => {
    const child = createTestSpan({ id: "child-1" });
    const span = createTestSpan({
      attributes: [
        { key: "llm.model", value: { stringValue: "gpt-4o" } },
        { key: "llm.tokens", value: { intValue: "12" } },
        { key: "llm.stream", value: { boolValue: false } },
      ],
      children: [child],
      input: "question",
      metadata: { tenant: "acme" },
      output: "answer",
      raw: ["{}", "[]"],
      reasoning: { content: "thinking", tokens: 10 },
      todos: [{ status: "in_progress", title: "Plan" }],
      tokenUsage: { input: { cost: 0.003, tokens: 300 } },
    });

    const revived = reviveTraceSpan(JSON.parse(JSON.stringify(span)));

    expect(revived).toStrictEqual({
      ...span,
      children: [
        {
          ...child,
          children: undefined,
          reasoning: undefined,
          todos: undefined,
          tokenUsage: undefined,
        },
      ],
      reasoning: {
        content: "thinking",
        level: undefined,
        tokens: 10,
        triggers: undefined,
      },
    });
    expect(revived.startTime).toBeInstanceOf(Date);
    expect(revived.children?.[0]?.endTime).toBeInstanceOf(Date);
  });

  it("throws on a value that is not span-shaped", () => {
    expect(() => reviveTraceSpan({ id: "1" })).toThrow(TypeError);
  });

  it("throws when a child is not span-shaped", () => {
    expect(() =>
      reviveTraceSpan({ ...baseJSON, children: [{ ...baseJSON, id: 7 }] }),
    ).toThrow(TypeError);
  });

  it("leaves out keys TraceSpan does not declare", () => {
    expect(
      reviveTraceSpan({ ...baseJSON, duration: 2500, extra: { a: 1 } }),
    ).toStrictEqual(reviveTraceSpan(baseJSON));
  });

  describe("malformed optional structures", () => {
    it.each<OverrideRow>([
      ["input", { input: 42 }],
      ["output", { output: { text: "answer" } }],
      ["metadata given as a string", { metadata: "tenant=acme" }],
      ["metadata given as a list", { metadata: ["acme"] }],
      ["metadata given as null", { metadata: null }],
      ["attributes that are not a list", { attributes: { key: "a" } }],
    ])("drops %s", (_label, override) => {
      expect(reviveTraceSpan({ ...baseJSON, ...override })).toStrictEqual(
        reviveTraceSpan(baseJSON),
      );
    });

    it("keeps only well-formed attributes", () => {
      const span = reviveTraceSpan({
        ...baseJSON,
        attributes: [
          { key: "kept", value: { stringValue: "yes" } },
          { key: 1, value: { stringValue: "numeric key" } },
          { key: "list value", value: ["yes"] },
          { key: "no value" },
          "not an attribute",
        ],
      });

      expect(span.attributes).toStrictEqual([
        { key: "kept", value: { stringValue: "yes" } },
      ]);
    });

    it("keeps only the well-typed parts of an attribute value", () => {
      const span = reviveTraceSpan({
        ...baseJSON,
        attributes: [
          {
            key: "mixed",
            value: {
              boolValue: "true",
              doubleValue: "abc",
              intValue: 3.5,
              stringValue: "kept",
            },
          },
          {
            key: "typed",
            value: { boolValue: true, intValue: "3", stringValue: 7 },
          },
          {
            key: "nested",
            value: {
              arrayValue: { values: [{ doubleValue: 0.5 }, "not a value"] },
              kvlistValue: {
                values: [
                  { key: "k", value: { intValue: 2 } },
                  { key: 1, value: {} },
                ],
              },
            },
          },
        ],
      });

      expect(span.attributes).toStrictEqual([
        { key: "mixed", value: { stringValue: "kept" } },
        { key: "typed", value: { boolValue: true, intValue: "3" } },
        {
          key: "nested",
          value: {
            arrayValue: { values: [{ doubleValue: 0.5 }] },
            kvlistValue: { values: [{ key: "k", value: { intValue: 2 } }] },
          },
        },
      ]);
    });

    it("keeps every OTLP/JSON attribute value form", () => {
      const attributes = [
        { key: "double", value: { doubleValue: 0.7 } },
        { key: "int", value: { intValue: 42 } },
        { key: "bytes", value: { bytesValue: "AAE=" } },
      ];

      expect(
        reviveTraceSpan({ ...baseJSON, attributes }).attributes,
      ).toStrictEqual(attributes);
    });

    it("keeps only well-formed todos", () => {
      const span = reviveTraceSpan({
        ...baseJSON,
        todos: [
          { status: "pending", title: "Plan" },
          { title: "No status" },
          { status: "completed", title: 42 },
          { status: "blocked", title: "Unknown status" },
          "not a todo",
        ],
      });

      expect(span.todos).toStrictEqual([{ status: "pending", title: "Plan" }]);
    });

    it("drops todos that are not a list", () => {
      expect(
        reviveTraceSpan({ ...baseJSON, todos: "bad" }).todos,
      ).toBeUndefined();
    });

    it("keeps only the well-formed parts of reasoning", () => {
      const span = reviveTraceSpan({
        ...baseJSON,
        reasoning: {
          content: "weighing options",
          level: "extreme",
          tokens: "many",
          triggers: ["think hard", 7],
        },
      });

      expect(span.reasoning).toStrictEqual({
        content: "weighing options",
        level: undefined,
        tokens: undefined,
        triggers: ["think hard"],
      });
    });

    it.each([
      ["a string", "thinking"],
      ["an empty object", {}],
    ])("drops reasoning given as %s", (_label, reasoning) => {
      expect(
        reviveTraceSpan({ ...baseJSON, reasoning }).reasoning,
      ).toBeUndefined();
    });

    it("keeps only token usage entries with a finite token count", () => {
      const span = reviveTraceSpan({
        ...baseJSON,
        tokenUsage: {
          cache_read: { tokens: "lots" },
          input: { cost: 0.001, tokens: 100 },
          output: { cost: "free", tokens: 50 },
          total: 7,
        },
      });

      expect(span.tokenUsage).toStrictEqual({
        input: { cost: 0.001, tokens: 100 },
        output: { tokens: 50 },
      });
    });

    it("drops token usage with no valid entries", () => {
      expect(
        reviveTraceSpan({ ...baseJSON, tokenUsage: "none" }).tokenUsage,
      ).toBeUndefined();
    });
  });
});
