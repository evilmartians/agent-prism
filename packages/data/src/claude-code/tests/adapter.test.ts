import { describe, expect, it } from "vitest";

import { claudeCodeSpanAdapter } from "../adapter";
import {
  createMockAssistant,
  createMockAttachment,
  createMockPrompt,
  createMockTextBlock,
  createMockThinkingBlock,
  createMockToolResult,
  createMockToolUseBlock,
  mockTimestamp,
} from "../utils/create-mock-claude-code-entry";

const prompt = createMockPrompt({ uuid: "p1", text: "Fix the bug" });
const answer = createMockAssistant({
  uuid: "a1",
  blocks: [createMockTextBlock("Fixed.")],
});
const result = createMockToolResult({
  uuid: "r1",
  toolUseId: "toolu_1",
  content: "3 files",
});
const failedResult = createMockToolResult({
  uuid: "r2",
  toolUseId: "toolu_1",
  isError: true,
  content: "Exit code 1",
  toolUseResult: "Error: Exit code 1",
});
const attachment = createMockAttachment({
  uuid: "c1",
  attachmentType: "skill_listing",
  payload: { content: "- review" },
});

describe("claudeCodeSpanAdapter.getSpanCategory", () => {
  it.each([
    ["a prompt", prompt, "agent_invocation"],
    ["a response", answer, "llm_call"],
    ["a tool result", result, "tool_execution"],
    ["an attachment", attachment, "event"],
  ] as const)("categorizes %s", (_label, entry, category) => {
    expect(claudeCodeSpanAdapter.getSpanCategory(entry)).toBe(category);
  });
});

describe("claudeCodeSpanAdapter.getSpanStatus", () => {
  it("treats a failed tool result and an API error record as errors", () => {
    expect(claudeCodeSpanAdapter.getSpanStatus(failedResult)).toBe("error");
    expect(
      claudeCodeSpanAdapter.getSpanStatus(
        createMockAssistant({
          uuid: "a2",
          extra: { isApiErrorMessage: true },
        }),
      ),
    ).toBe("error");
  });

  it("treats a blocking hook as a warning", () => {
    expect(
      claudeCodeSpanAdapter.getSpanStatus(
        createMockAttachment({
          uuid: "c2",
          attachmentType: "hook_blocking_error",
        }),
      ),
    ).toBe("warning");
  });

  it("treats everything else as a success", () => {
    [prompt, answer, result, attachment].forEach((entry) => {
      expect(claudeCodeSpanAdapter.getSpanStatus(entry)).toBe("success");
    });
  });

  it("does not take a response without a stop reason for a pending one", () => {
    expect(
      claudeCodeSpanAdapter.getSpanStatus(
        createMockAssistant({ uuid: "a3", stopReason: null }),
      ),
    ).toBe("success");
  });
});

describe("claudeCodeSpanAdapter.getSpanInputOutput", () => {
  it("reads a prompt as input, and a response or a tool result as output", () => {
    expect(claudeCodeSpanAdapter.getSpanInputOutput(prompt)).toEqual({
      input: "Fix the bug",
    });
    expect(claudeCodeSpanAdapter.getSpanInputOutput(answer)).toEqual({
      output: "Fixed.",
    });
    expect(claudeCodeSpanAdapter.getSpanInputOutput(result)).toEqual({
      output: "3 files",
    });
    expect(claudeCodeSpanAdapter.getSpanInputOutput(attachment)).toEqual({});
  });

  it("joins the text blocks of a tool result", () => {
    expect(
      claudeCodeSpanAdapter.getSpanInputOutput(
        createMockToolResult({
          uuid: "r3",
          toolUseId: "toolu_1",
          content: [
            { type: "text", text: "one" },
            { type: "text", text: "two" },
          ],
        }),
      ),
    ).toEqual({ output: "one\n\ntwo" });
  });
});

describe("claudeCodeSpanAdapter.getTokenUsage", () => {
  it("maps Anthropic's counts onto token types, without a cost", () => {
    expect(
      claudeCodeSpanAdapter.getTokenUsage(
        createMockAssistant({
          uuid: "a4",
          usage: {
            input_tokens: 3,
            output_tokens: 40,
            cache_read_input_tokens: 1000,
            cache_creation_input_tokens: 200,
          },
        }),
      ),
    ).toEqual({
      input: { tokens: 3 },
      output: { tokens: 40 },
      cache_read: { tokens: 1000 },
      cache_write: { tokens: 200 },
    });
  });

  it("reports nothing for other records, a missing usage or one of zeros", () => {
    expect(claudeCodeSpanAdapter.getTokenUsage(prompt)).toBeUndefined();
    expect(claudeCodeSpanAdapter.getTokenUsage(answer)).toBeUndefined();
    expect(
      claudeCodeSpanAdapter.getTokenUsage(
        createMockAssistant({
          uuid: "a5",
          usage: { input_tokens: 0, output_tokens: 0 },
        }),
      ),
    ).toBeUndefined();
  });
});

describe("claudeCodeSpanAdapter.getTraceReasoning", () => {
  it("reads the thinking text", () => {
    expect(
      claudeCodeSpanAdapter.getTraceReasoning(
        createMockAssistant({
          uuid: "a6",
          blocks: [
            createMockThinkingBlock("First."),
            createMockThinkingBlock("Then."),
          ],
        }),
      ),
    ).toEqual({ content: "First.\n\nThen." });
  });

  it("reports the thinking tokens when the text was not kept", () => {
    expect(
      claudeCodeSpanAdapter.getTraceReasoning(
        createMockAssistant({
          uuid: "a7",
          blocks: [createMockThinkingBlock("")],
          usage: {
            output_tokens: 500,
            output_tokens_details: { thinking_tokens: 380 },
          },
        }),
      ),
    ).toEqual({ content: "", tokens: 380 });
  });

  it("reports nothing without thinking text or tokens", () => {
    expect(
      claudeCodeSpanAdapter.getTraceReasoning(
        createMockAssistant({
          uuid: "a8",
          blocks: [createMockThinkingBlock("")],
        }),
      ),
    ).toBeUndefined();
    expect(claudeCodeSpanAdapter.getTraceReasoning(answer)).toBeUndefined();
    expect(claudeCodeSpanAdapter.getTraceReasoning(prompt)).toBeUndefined();
  });
});

describe("claudeCodeSpanAdapter.getTraceTodos", () => {
  it("reads the list of the last TodoWrite call", () => {
    expect(
      claudeCodeSpanAdapter.getTraceTodos(
        createMockAssistant({
          uuid: "a9",
          blocks: [
            createMockToolUseBlock("toolu_1", "TodoWrite", {
              todos: [{ content: "Old", status: "pending" }],
            }),
            createMockToolUseBlock("toolu_2", "TodoWrite", {
              todos: [{ content: "New", status: "completed" }],
            }),
          ],
        }),
      ),
    ).toEqual([{ title: "New", status: "completed" }]);
  });

  it("reports nothing for records without a TodoWrite call", () => {
    expect(claudeCodeSpanAdapter.getTraceTodos(answer)).toBeUndefined();
    expect(claudeCodeSpanAdapter.getTraceTodos(prompt)).toBeUndefined();
  });
});

describe("claudeCodeSpanAdapter.convertRawSpanToTraceSpan", () => {
  it("builds the span a record is on its own", () => {
    const span = claudeCodeSpanAdapter.convertRawSpanToTraceSpan(prompt);

    expect(span).toMatchObject({
      id: "p1",
      title: "Fix the bug",
      type: "agent_invocation",
      status: "success",
      input: "Fix the bug",
      startTime: new Date(mockTimestamp(0)),
      endTime: new Date(mockTimestamp(0)),
      raw: [JSON.stringify(prompt, null, 2)],
    });
  });

  it("gives a record that never becomes a span its context item", () => {
    const span = claudeCodeSpanAdapter.convertRawSpanToTraceSpan(attachment);

    expect(span.type).toBe("event");
    expect(span.title).toBe("Skill listing");
    expect(span.context).toEqual([
      {
        type: "skill_listing",
        title: "Skill listing",
        content: "- review",
        timestamp: new Date(mockTimestamp(0)),
        metadata: undefined,
      },
    ]);
  });

  it("reports a failed tool result with its error message", () => {
    const span = claudeCodeSpanAdapter.convertRawSpanToTraceSpan(failedResult);

    expect(span.status).toBe("error");
    expect(span.output).toBe("Exit code 1");
    expect(span.attributes).toContainEqual({
      key: "error.message",
      value: { stringValue: "Error: Exit code 1" },
    });
  });
});
