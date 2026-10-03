import { describe, expect, it } from "vitest";

import { createMockPrompt } from "../utils/create-mock-claude-code-entry";
import { isClaudeCodeTranscript } from "../utils/is-claude-code-transcript";
import { parseClaudeCodeJSONL } from "../utils/parse-claude-code-jsonl";

describe("parseClaudeCodeJSONL", () => {
  it("reads one record per line", () => {
    expect(parseClaudeCodeJSONL('{"a":1}\n{"b":2}\n')).toEqual([
      { a: 1 },
      { b: 2 },
    ]);
  });

  it("skips blank lines and lines that are not JSON", () => {
    expect(
      parseClaudeCodeJSONL('{"a":1}\r\n\r\n{"b":2}\n{"cut off mid-wri'),
    ).toEqual([{ a: 1 }, { b: 2 }]);
  });

  it("reads a JSON document that holds the records as an array", () => {
    expect(
      parseClaudeCodeJSONL(JSON.stringify([{ a: 1 }, { b: 2 }], null, 2)),
    ).toEqual([{ a: 1 }, { b: 2 }]);
  });

  it("reads a single record, on one line or pretty-printed", () => {
    expect(parseClaudeCodeJSONL('{"a":1}')).toEqual([{ a: 1 }]);
    expect(parseClaudeCodeJSONL(JSON.stringify({ a: 1 }, null, 2))).toEqual([
      { a: 1 },
    ]);
  });

  it("returns nothing for text without JSON in it", () => {
    expect(parseClaudeCodeJSONL("")).toEqual([]);
    expect(parseClaudeCodeJSONL("not a transcript")).toEqual([]);
  });
});

describe("isClaudeCodeTranscript", () => {
  const entry = createMockPrompt({ uuid: "p1" });

  it("accepts a list with at least one record of the chain", () => {
    expect(
      isClaudeCodeTranscript([
        { type: "queue-operation", operation: "enqueue" },
        entry,
        { toolUseId: "toolu_1", agentType: "Explore" },
      ]),
    ).toBe(true);
  });

  it("accepts a single record", () => {
    expect(isClaudeCodeTranscript(entry)).toBe(true);
  });

  it.each([
    ["an empty list", []],
    ["records outside the chain only", [{ type: "last-prompt" }]],
    ["an OpenTelemetry document", { resourceSpans: [] }],
    ["a Langfuse document", { trace: {}, observations: [] }],
    [
      "a list of spans",
      [{ id: "s1", title: "Span", type: "llm_call", status: "success" }],
    ],
    ["something that is not an object", "transcript"],
  ])("rejects %s", (_label, data) => {
    expect(isClaudeCodeTranscript(data)).toBe(false);
  });
});
