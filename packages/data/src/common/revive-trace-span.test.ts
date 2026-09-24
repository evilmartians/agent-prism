import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { isTraceSpanLike, reviveTraceSpan } from "./revive-trace-span";
import { createTestSpan } from "./test-utils/create-test-span";

const baseJSON = {
  id: "span-1",
  title: "ChatCompletion",
  startTime: "2024-01-01T00:00:00.000Z",
  endTime: "2024-01-01T00:00:02.500Z",
  type: "llm_call",
  status: "success",
  raw: [],
};

describe("isTraceSpanLike", () => {
  it("accepts a plain payload without derived fields", () => {
    expect(isTraceSpanLike(baseJSON)).toBe(true);
  });

  it("rejects a payload missing a required field", () => {
    expect(isTraceSpanLike({ ...baseJSON, status: undefined })).toBe(false);
  });

  it.each([
    ["an unknown status", { status: "failed" }],
    ["an unknown type", { type: "llm" }],
    ["an unparseable startTime", { startTime: "yesterday" }],
    ["an unparseable endTime", { endTime: Number.NaN }],
    ["a non-timestamp endTime", { endTime: { at: 1 } }],
  ])("rejects %s", (_label, override) => {
    expect(isTraceSpanLike({ ...baseJSON, ...override })).toBe(false);
  });

  it("accepts epoch-millisecond timestamps", () => {
    expect(isTraceSpanLike({ ...baseJSON, startTime: 0, endTime: 1_000 })).toBe(
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
    const span: TraceSpan = createTestSpan({
      raw: ["{}", "[]"],
      tokenUsage: { input: { tokens: 300, cost: 0.003 } },
      reasoning: { content: "thinking", tokens: 10 },
      todos: [{ title: "Plan", status: "in_progress" }],
      children: [createTestSpan({ id: "child-1" })],
    });

    const revived = reviveTraceSpan(JSON.parse(JSON.stringify(span)));

    expect(revived).toEqual(span);
    expect(revived.startTime).toBeInstanceOf(Date);
    expect(revived.children?.[0].endTime).toBeInstanceOf(Date);
  });

  it("throws on a value that is not span-shaped", () => {
    expect(() => reviveTraceSpan({ id: "1" })).toThrow(TypeError);
  });

  describe("malformed optional structures", () => {
    it("keeps only well-formed todos", () => {
      const span = reviveTraceSpan({
        ...baseJSON,
        todos: [
          { title: "Plan", status: "pending" },
          { title: "No status" },
          { title: 42, status: "completed" },
          { title: "Unknown status", status: "blocked" },
          "not a todo",
        ],
      });

      expect(span.todos).toEqual([{ title: "Plan", status: "pending" }]);
    });

    it("drops todos that are not a list", () => {
      expect(reviveTraceSpan({ ...baseJSON, todos: "bad" }).todos).toBe(
        undefined,
      );
    });

    it("keeps only the well-formed parts of reasoning", () => {
      const span = reviveTraceSpan({
        ...baseJSON,
        reasoning: {
          content: "weighing options",
          tokens: "many",
          level: "extreme",
          triggers: ["think hard", 7],
        },
      });

      expect(span.reasoning).toEqual({
        content: "weighing options",
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
          input: { tokens: 100, cost: 0.001 },
          output: { tokens: 50, cost: "free" },
          cache_read: { tokens: "lots" },
          total: 7,
        },
      });

      expect(span.tokenUsage).toEqual({
        input: { tokens: 100, cost: 0.001 },
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
