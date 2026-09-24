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

  it("rejects a raw that is not a list", () => {
    expect(isTraceSpanLike({ ...baseJSON, raw: "{}" })).toBe(false);
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
});
