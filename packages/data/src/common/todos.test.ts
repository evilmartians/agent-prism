import type { TraceSpanAttribute } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { hasTodos, parseTodos } from "./todos";

const span = (attributes: TraceSpanAttribute[]) => ({ attributes });

describe("agent-prism / todos", () => {
  it("parseTodos reads claude_code.todos JSON; hasTodos is true when non-empty", () => {
    const todos = [
      { content: "ship it", status: "pending", activeForm: "shipping it" },
    ];
    const s = span([
      {
        key: "claude_code.todos",
        value: { stringValue: JSON.stringify(todos) },
      },
    ]);

    expect(parseTodos(s)).toEqual(todos);
    expect(hasTodos(s)).toBe(true);
  });

  it("parseTodos drops items with non-string fields or an unknown status", () => {
    const s = span([
      {
        key: "claude_code.todos",
        value: {
          stringValue: JSON.stringify([
            { content: "ok", status: "pending", activeForm: "doing ok" },
            { content: { text: "bad" }, status: "pending", activeForm: "x" },
            { content: "no-active-form", status: "in_progress" },
            { content: "bad-status", status: "blocked", activeForm: "y" },
          ]),
        },
      },
    ]);

    expect(parseTodos(s)).toEqual([
      { content: "ok", status: "pending", activeForm: "doing ok" },
    ]);
  });

  it("cross-vendor / malformed: no attr or invalid JSON yields null / false", () => {
    expect(parseTodos(span([]))).toBe(null);
    expect(hasTodos(span([]))).toBe(false);
    expect(
      parseTodos(
        span([
          { key: "claude_code.todos", value: { stringValue: "not json" } },
        ]),
      ),
    ).toBe(null);
  });
});
