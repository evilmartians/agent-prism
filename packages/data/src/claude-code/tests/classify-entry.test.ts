import type { ClaudeCodeLogEntry } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { classifyEntry } from "../utils/classify-entry";
import {
  createMockAssistant,
  createMockAttachment,
  createMockPrompt,
  createMockSystem,
  createMockTextBlock,
  createMockToolResult,
} from "../utils/create-mock-claude-code-entry";

const withBlocks = (text: string): ClaudeCodeLogEntry => ({
  ...createMockPrompt({ uuid: "u1" }),
  message: { role: "user", content: [{ type: "text", text }] },
});

describe("classifyEntry", () => {
  it("takes a user record with text for a prompt", () => {
    expect(
      classifyEntry(createMockPrompt({ uuid: "u1", text: "Hi" })),
    ).toMatchObject({ kind: "prompt", text: "Hi" });
    expect(classifyEntry(withBlocks("Hi"))).toMatchObject({
      kind: "prompt",
      text: "Hi",
    });
  });

  it.each([
    ["a task notification", "<task-notification>\n<summary>Done</summary>"],
    ["a slash command", "<command-name>/review</command-name>"],
  ])("takes %s for a prompt", (_label, text) => {
    expect(classifyEntry(createMockPrompt({ uuid: "u1", text })).kind).toBe(
      "prompt",
    );
  });

  it("takes a user record with tool results for the results", () => {
    const classified = classifyEntry(
      createMockToolResult({ uuid: "u1", toolUseId: "toolu_1" }),
    );

    expect(classified).toMatchObject({
      kind: "tool_result",
      results: [{ tool_use_id: "toolu_1" }],
    });
  });

  it.each([
    [
      "an interrupt marker",
      withBlocks("[Request interrupted by user]"),
      "interrupt",
    ],
    [
      "an interrupted tool use",
      withBlocks("[Request interrupted by user for tool use]"),
      "interrupt",
    ],
    [
      "a meta message",
      createMockPrompt({ uuid: "u1", extra: { isMeta: true } }),
      "meta",
    ],
    [
      "a compaction summary",
      createMockPrompt({ uuid: "u1", extra: { isCompactSummary: true } }),
      "compact_summary",
    ],
    [
      "local command output",
      createMockPrompt({
        uuid: "u1",
        text: "<local-command-stdout>ok</local-command-stdout>",
      }),
      "local_command",
    ],
    [
      "an attachment",
      createMockAttachment({ uuid: "c1", attachmentType: "skill_listing" }),
      "attachment",
    ],
    [
      "a system record",
      createMockSystem({ uuid: "s1", subtype: "stop_hook_summary" }),
      "system",
    ],
    [
      "a record of a type it does not know",
      { uuid: "x1", parentUuid: null, type: "brand-new" },
      "unknown",
    ],
  ])("takes %s for context", (_label, entry, contextKind) => {
    expect(classifyEntry(entry)).toMatchObject({
      kind: "context",
      contextKind,
    });
  });

  it("tells a synthetic filler from a record of a failed request", () => {
    const filler = createMockAssistant({
      uuid: "a1",
      model: "<synthetic>",
      blocks: [createMockTextBlock("No response requested.")],
    });

    expect(classifyEntry(filler)).toMatchObject({
      kind: "context",
      contextKind: "synthetic",
      text: "No response requested.",
    });
    expect(classifyEntry({ ...filler, isApiErrorMessage: true }).kind).toBe(
      "assistant",
    );
    expect(classifyEntry(createMockAssistant({ uuid: "a2" })).kind).toBe(
      "assistant",
    );
  });

  it("keeps progress records as links in the chain", () => {
    expect(
      classifyEntry({ uuid: "g1", parentUuid: "a1", type: "progress" }).kind,
    ).toBe("link");
  });

  it("does not trip over a record without a message", () => {
    expect(
      classifyEntry({ uuid: "u1", parentUuid: null, type: "user" }),
    ).toMatchObject({ kind: "context", contextKind: "unknown" });
  });
});
