import type {
  ClaudeCodeLogEntry,
  ClaudeCodeUsage,
  TraceSpan,
} from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { extractSpanError } from "../../common/extract-span-error";
import { flattenSpans } from "../../common/flatten-spans";
import { getDurationMs } from "../../common/get-duration-ms";
import { reviveTraceSpan } from "../../common/revive-trace-span";
import { getTotalTokens } from "../../common/token-usage";
import { claudeCodeSpanAdapter } from "../adapter";
import {
  createMockAssistant,
  createMockAttachment,
  createMockPrompt,
  createMockSubagentMeta,
  createMockSystem,
  createMockTextBlock,
  createMockThinkingBlock,
  createMockToolResult,
  createMockToolUseBlock,
  mockTimestamp,
} from "../utils/create-mock-claude-code-entry";

const convert = (documents: unknown[]): TraceSpan[] =>
  claudeCodeSpanAdapter.convertRawDocumentsToSpans(
    documents as ClaudeCodeLogEntry[],
  );

const usage = (outputTokens: number): ClaudeCodeUsage => ({
  input_tokens: 2,
  output_tokens: outputTokens,
  cache_read_input_tokens: 600,
  cache_creation_input_tokens: 400,
  speed: "standard",
});

const attribute = (span: TraceSpan, key: string) =>
  span.attributes?.find((entry) => entry.key === key)?.value;

const titles = (spans: TraceSpan[] | undefined): string[] =>
  (spans ?? []).map((span) => span.title);

// One turn: a response of three records that calls a tool, the tool's result,
// and the answer.
const turn = (): ClaudeCodeLogEntry[] => [
  createMockPrompt({ uuid: "p1", text: "Fix the bug\nIt is in parse.ts" }),
  createMockAssistant({
    uuid: "a1",
    parentUuid: "p1",
    at: 5,
    messageId: "msg_1",
    blocks: [createMockThinkingBlock("Let me look.")],
    stopReason: "tool_use",
    usage: usage(50),
  }),
  createMockAssistant({
    uuid: "a2",
    parentUuid: "a1",
    at: 6,
    messageId: "msg_1",
    blocks: [createMockTextBlock("Looking at the file.")],
    stopReason: "tool_use",
    usage: usage(50),
  }),
  createMockAssistant({
    uuid: "a3",
    parentUuid: "a2",
    at: 7,
    messageId: "msg_1",
    blocks: [createMockToolUseBlock("toolu_1")],
    stopReason: "tool_use",
    usage: usage(50),
  }),
  createMockToolResult({
    uuid: "r1",
    parentUuid: "a3",
    at: 9,
    toolUseId: "toolu_1",
    content: "hi",
  }),
  createMockAssistant({
    uuid: "a4",
    parentUuid: "r1",
    at: 12,
    messageId: "msg_2",
    blocks: [createMockTextBlock("Done.")],
    usage: usage(20),
  }),
];

describe("claudeCodeSpanAdapter.convertRawDocumentsToSpans", () => {
  describe("a turn", () => {
    it("puts responses and tool calls side by side under the prompt", () => {
      const [main, ...rest] = convert(turn());

      expect(rest).toEqual([]);
      expect(main.type).toBe("agent_invocation");
      expect(main.title).toBe("Fix the bug");
      expect(main.input).toBe("Fix the bug\nIt is in parse.ts");
      expect(titles(main.children)).toEqual([
        "Looking at the file.",
        "Say hi",
        "Done.",
      ]);
      expect(main.children?.map((span) => span.type)).toEqual([
        "llm_call",
        "tool_execution",
        "llm_call",
      ]);
      expect(main.children?.every((span) => span.children?.length === 0)).toBe(
        true,
      );
    });

    it("folds the records of one response into one span", () => {
      const [main] = convert(turn());
      const [response] = main.children ?? [];

      expect(response.id).toBe("a1");
      expect(response.output).toBe("Looking at the file.");
      expect(response.reasoning).toEqual({ content: "Let me look." });
      expect(response.raw).toHaveLength(3);
      expect(response.raw.map((record) => JSON.parse(record).uuid)).toEqual([
        "a1",
        "a2",
        "a3",
      ]);
      expect(response.metadata).toEqual({ brand: { type: "anthropic" } });
    });

    it("counts the usage its records repeat once", () => {
      const [main] = convert(turn());
      const [response] = main.children ?? [];

      expect(response.tokenUsage).toEqual({
        input: { tokens: 2 },
        output: { tokens: 50 },
        cache_read: { tokens: 600 },
        cache_write: { tokens: 400 },
      });
      expect(
        flattenSpans([main]).reduce(
          (total, span) => total + getTotalTokens(span.tokenUsage),
          0,
        ),
      ).toBe(1052 + 1022);
    });

    it("feeds the Context tab from the usage", () => {
      const [main] = convert(turn());
      const [response] = main.children ?? [];

      expect(attribute(response, "gen_ai.request.model")).toEqual({
        stringValue: "claude-sonnet-5",
      });
      expect(attribute(response, "claude_code.cumulative_tokens")).toEqual({
        intValue: "1002",
      });
      expect(attribute(response, "claude_code.cache_hit_ratio")).toEqual({
        stringValue: "0.5988",
      });
      expect(attribute(response, "claude_code.usage.speed")).toEqual({
        stringValue: "standard",
      });
      expect(attribute(response, "gen_ai.usage.input_tokens")).toEqual({
        intValue: "1002",
      });
    });

    it("makes a tool span of the call and its result", () => {
      const [main] = convert(turn());
      const tool = main.children?.[1] as TraceSpan;

      expect(tool.id).toBe("toolu_1");
      expect(tool.input).toBe("echo hi");
      expect(tool.output).toBe("hi");
      expect(tool.status).toBe("success");
      expect(tool.raw.map((record) => JSON.parse(record).uuid)).toEqual([
        "a3",
        "r1",
      ]);
      expect(getDurationMs(tool)).toBe(2000);
      expect(tool.tokenUsage).toBeUndefined();
    });

    it("starts a response when the step before it ended", () => {
      const [main] = convert(turn());
      const [first, , second] = main.children ?? [];

      // Prompt at 0s, last record of the response at 7s.
      expect(getDurationMs(first)).toBe(7000);
      // Tool result at 9s, answer at 12s.
      expect(getDurationMs(second)).toBe(3000);
    });

    it("spans the turn and takes its answer as the output", () => {
      const [main] = convert(turn());

      expect(main.startTime).toEqual(new Date(mockTimestamp(0)));
      expect(getDurationMs(main)).toBe(12000);
      expect(main.output).toBe("Done.");
    });

    it("has no answer when the last response went on to call a tool", () => {
      const [main] = convert(turn().slice(0, 5));

      expect(main.output).toBeUndefined();
    });

    it("titles a response without text by the tools it called", () => {
      const [main] = convert([
        createMockPrompt({ uuid: "p1" }),
        createMockAssistant({
          uuid: "a1",
          parentUuid: "p1",
          messageId: "msg_1",
          blocks: [createMockToolUseBlock("toolu_1")],
        }),
        createMockAssistant({
          uuid: "a2",
          parentUuid: "a1",
          messageId: "msg_1",
          blocks: [
            createMockToolUseBlock("toolu_2", "Read", { file_path: "/a/b.ts" }),
          ],
        }),
      ]);

      expect(titles(main.children)).toEqual([
        "Tool calls: Bash, Read",
        "Say hi",
        "Read b.ts",
      ]);
    });

    it("passes unhandled fields through as claude_code attributes", () => {
      const [main] = convert(turn());
      const [response, tool] = main.children ?? [];

      expect(attribute(main, "claude_code.gitBranch")).toEqual({
        stringValue: "main",
      });
      expect(attribute(main, "claude_code.uuid")).toEqual({
        stringValue: "p1",
      });
      expect(attribute(response, "claude_code.uuid")).toEqual({
        stringValue: "a1",
      });
      expect(attribute(response, "claude_code.parentUuid")).toEqual({
        stringValue: "p1",
      });
      expect(attribute(tool, "claude_code.uuid")).toEqual({
        stringValue: "a3",
      });
      expect(attribute(tool, "gen_ai.tool.name")).toEqual({
        stringValue: "Bash",
      });
    });
  });

  describe("usage snapshots", () => {
    it("keeps the latest snapshot of a response, not the sum", () => {
      const [main] = convert([
        createMockPrompt({ uuid: "p1" }),
        createMockAssistant({
          uuid: "a1",
          parentUuid: "p1",
          messageId: "msg_1",
          blocks: [createMockThinkingBlock("")],
          stopReason: null,
          usage: { input_tokens: 2, output_tokens: 7 },
        }),
        createMockAssistant({
          uuid: "a2",
          parentUuid: "a1",
          messageId: "msg_1",
          blocks: [createMockTextBlock("Here.")],
          stopReason: "end_turn",
          usage: {
            input_tokens: 2,
            output_tokens: 660,
            output_tokens_details: { thinking_tokens: 380 },
            speed: "standard",
          },
        }),
      ]);
      const [response] = main.children ?? [];

      expect(response.tokenUsage).toEqual({
        input: { tokens: 2 },
        output: { tokens: 660 },
      });
      expect(response.reasoning).toEqual({ content: "", tokens: 380 });
      expect(attribute(response, "claude_code.usage.output_tokens")).toEqual({
        intValue: "660",
      });
      expect(attribute(response, "claude_code.usage.speed")).toEqual({
        stringValue: "standard",
      });
      expect(attribute(response, "gen_ai.response.finish_reasons")).toEqual({
        stringValue: "end_turn",
      });
      expect(response.status).toBe("success");
    });

    it("reports no usage and no thinking for a record of zeros", () => {
      const [main] = convert([
        createMockPrompt({ uuid: "p1" }),
        createMockAssistant({
          uuid: "a1",
          parentUuid: "p1",
          blocks: [createMockThinkingBlock(""), createMockTextBlock("Hm.")],
          usage: { input_tokens: 0, output_tokens: 0 },
        }),
      ]);
      const [response] = main.children ?? [];

      expect(response.tokenUsage).toBeUndefined();
      expect(response.reasoning).toBeUndefined();
      expect(
        attribute(response, "claude_code.cumulative_tokens"),
      ).toBeUndefined();
    });
  });

  describe("tool calls", () => {
    it("matches parallel calls with their own results", () => {
      const [main] = convert([
        createMockPrompt({ uuid: "p1" }),
        createMockAssistant({
          uuid: "a1",
          parentUuid: "p1",
          at: 1,
          messageId: "msg_1",
          blocks: [createMockToolUseBlock("toolu_1")],
        }),
        createMockAssistant({
          uuid: "a2",
          parentUuid: "a1",
          at: 2,
          messageId: "msg_1",
          blocks: [createMockToolUseBlock("toolu_2")],
        }),
        createMockToolResult({
          uuid: "r1",
          parentUuid: "a1",
          at: 5,
          toolUseId: "toolu_1",
          content: "first",
        }),
        createMockToolResult({
          uuid: "r2",
          parentUuid: "a2",
          at: 6,
          toolUseId: "toolu_2",
          content: "second",
        }),
        createMockAssistant({
          uuid: "a3",
          parentUuid: "r2",
          at: 8,
          messageId: "msg_2",
        }),
      ]);

      expect(main.children?.map((span) => span.output)).toEqual([
        undefined,
        "first",
        "second",
        "Sure.",
      ]);
      expect(main.children?.map(getDurationMs)).toEqual([
        2000, 4000, 4000, 2000,
      ]);
    });

    it("reports a failed call through its error lines", () => {
      const [main] = convert([
        createMockPrompt({ uuid: "p1" }),
        createMockAssistant({
          uuid: "a1",
          parentUuid: "p1",
          blocks: [createMockToolUseBlock("toolu_1")],
        }),
        createMockToolResult({
          uuid: "r1",
          parentUuid: "a1",
          toolUseId: "toolu_1",
          isError: true,
          content: "Exit code 1\nfatal: not a git repository",
          toolUseResult: "Error: Exit code 1\nfatal: not a git repository",
        }),
      ]);
      const tool = main.children?.[1] as TraceSpan;

      expect(tool.status).toBe("error");
      expect(tool.output).toBe("Exit code 1\nfatal: not a git repository");
      expect(extractSpanError(tool)).toEqual({
        message: "Error: Exit code 1",
        stack: undefined,
        nodeName: "Say hi",
      });
    });

    it("leaves a call without a result pending", () => {
      const [main] = convert(turn().slice(0, 4));
      const tool = main.children?.[1] as TraceSpan;

      expect(tool.status).toBe("pending");
      expect(tool.output).toBeUndefined();
      expect(getDurationMs(tool)).toBe(0);
    });

    it("keeps a result whose call is missing as a span of its own", () => {
      const [main] = convert([
        createMockPrompt({ uuid: "p1" }),
        createMockToolResult({
          uuid: "r1",
          parentUuid: "p1",
          toolUseId: "toolu_gone",
          content: "late",
        }),
      ]);

      expect(main.children).toHaveLength(1);
      expect(main.children?.[0]).toMatchObject({
        id: "toolu_gone",
        type: "tool_execution",
        title: "Tool result",
        output: "late",
        status: "success",
      });
    });

    it("handles a record with several calls and one with several results", () => {
      const [main] = convert([
        createMockPrompt({ uuid: "p1" }),
        createMockAssistant({
          uuid: "a1",
          parentUuid: "p1",
          blocks: [
            createMockTextBlock("Two things."),
            createMockToolUseBlock("toolu_1"),
            createMockToolUseBlock("toolu_2"),
          ],
        }),
        {
          ...createMockToolResult({
            uuid: "r1",
            parentUuid: "a1",
            toolUseId: "toolu_1",
          }),
          message: {
            role: "user",
            content: [
              { type: "tool_result", tool_use_id: "toolu_1", content: "one" },
              { type: "tool_result", tool_use_id: "toolu_2", content: "two" },
            ],
          },
        },
        createMockAssistant({ uuid: "a2", parentUuid: "r1" }),
      ]);

      expect(titles(main.children)).toEqual([
        "Two things.",
        "Say hi",
        "Say hi",
        "Sure.",
      ]);
      expect(main.children?.map((span) => span.output)).toEqual([
        "Two things.",
        "one",
        "two",
        "Sure.",
      ]);
    });

    it("takes todos from a TodoWrite call", () => {
      const [main] = convert([
        createMockPrompt({ uuid: "p1" }),
        createMockAssistant({
          uuid: "a1",
          parentUuid: "p1",
          blocks: [
            createMockToolUseBlock("toolu_1", "TodoWrite", {
              todos: [
                { content: "Read", status: "completed", activeForm: "Reading" },
                { content: "Fix", status: "in_progress", activeForm: "Fixing" },
                { content: "Broken", status: "someday" },
              ],
            }),
          ],
        }),
      ]);
      const todos = [
        { title: "Read", status: "completed" },
        { title: "Fix", status: "in_progress" },
      ];

      expect(main.children?.map((span) => span.todos)).toEqual([todos, todos]);
    });
  });

  describe("context", () => {
    const withContext = (): ClaudeCodeLogEntry[] => [
      createMockPrompt({ uuid: "p1" }),
      createMockAttachment({
        uuid: "c1",
        parentUuid: "p1",
        attachmentType: "skill_listing",
        payload: { content: "- review", skillCount: 1 },
      }),
      createMockAssistant({
        uuid: "a1",
        parentUuid: "c1",
        at: 2,
        blocks: [createMockToolUseBlock("toolu_1", "Edit", { file_path: "a" })],
      }),
      createMockToolResult({
        uuid: "r1",
        parentUuid: "a1",
        at: 3,
        toolUseId: "toolu_1",
      }),
      createMockAttachment({
        uuid: "c2",
        parentUuid: "r1",
        at: 3,
        attachmentType: "hook_blocking_error",
        payload: {
          hookName: "PostToolUse:Edit",
          blockingError: { blockingError: "typecheck failed", command: "gate" },
        },
      }),
      createMockAssistant({ uuid: "a2", parentUuid: "c2", at: 5 }),
      createMockSystem({
        uuid: "s1",
        parentUuid: "a2",
        at: 6,
        subtype: "stop_hook_summary",
        extra: { hookCount: 2 },
      }),
    ];

    it("adds an attachment to the span it follows, never as a span", () => {
      const [main] = convert(withContext());
      const [, tool, answer] = main.children ?? [];

      expect(main.children).toHaveLength(3);
      expect(main.context).toEqual([
        {
          type: "skill_listing",
          title: "Skill listing",
          content: "- review",
          timestamp: new Date(mockTimestamp(0)),
          metadata: { skillCount: 1 },
        },
      ]);
      expect(tool.context?.map((item) => item.title)).toEqual([
        "Hook blocked: PostToolUse:Edit",
      ]);
      expect(answer.context?.map((item) => item.type)).toEqual([
        "system.stop_hook_summary",
      ]);
    });

    it("lists every record a span was built from in its raw", () => {
      const [main] = convert(withContext());
      const [, tool, answer] = main.children ?? [];
      const uuids = (span: TraceSpan) =>
        span.raw.map((record) => JSON.parse(record).uuid);

      expect(uuids(main)).toEqual(["p1", "c1"]);
      expect(uuids(tool)).toEqual(["a1", "r1", "c2"]);
      expect(uuids(answer)).toEqual(["a2", "s1"]);
    });

    it("keeps the fields of a context record out of the span's attributes", () => {
      const [main] = convert(withContext());
      const answer = main.children?.[2] as TraceSpan;

      expect(attribute(answer, "claude_code.hookCount")).toBeUndefined();
      expect(answer.context?.[0].metadata).toEqual({ hookCount: 2 });
    });

    it("marks a span a blocking hook complained about as a warning", () => {
      const [main] = convert(withContext());

      expect(main.children?.map((span) => span.status)).toEqual([
        "success",
        "warning",
        "success",
      ]);
      expect(main.status).toBe("success");
    });

    it("lets the span of a prompt take over the context that preceded it", () => {
      const [main, ...rest] = convert([
        createMockAttachment({
          uuid: "c1",
          attachmentType: "hook_success",
          payload: { hookName: "SessionStart:startup", content: "ready" },
        }),
        createMockAttachment({
          uuid: "c2",
          parentUuid: "c1",
          attachmentType: "hook_additional_context",
          payload: { hookName: "SessionStart", content: ["be", "nice"] },
        }),
        createMockPrompt({ uuid: "p1", parentUuid: "c2", at: 3 }),
        createMockAssistant({ uuid: "a1", parentUuid: "p1", at: 4 }),
      ]);

      expect(rest).toEqual([]);
      expect(main.title).toBe("Hello");
      expect(main.input).toBe("Hello");
      expect(main.startTime).toEqual(new Date(mockTimestamp(3)));
      expect(main.context?.map((item) => item.title)).toEqual([
        "Hook succeeded: SessionStart:startup",
        "Hook context: SessionStart",
      ]);
      expect(main.context?.[1].content).toBe("be\nnice");
      expect(main.raw).toHaveLength(3);
      expect(attribute(main, "claude_code.uuid")).toEqual({
        stringValue: "p1",
      });
      expect(titles(main.children)).toEqual(["Sure."]);
    });

    it("opens a session span for records whose parent is not there", () => {
      const [main] = convert([
        createMockAssistant({ uuid: "a1", parentUuid: "gone" }),
        createMockAssistant({ uuid: "a2", parentUuid: "a1", at: 2 }),
      ]);

      expect(main.title).toBe("Session");
      expect(main.type).toBe("agent_invocation");
      expect(titles(main.children)).toEqual(["Sure.", "Sure."]);
    });
  });

  describe("turn boundaries", () => {
    it("starts a main span for every prompt, whatever it chains off", () => {
      const spans = convert([
        ...turn(),
        createMockSystem({
          uuid: "s1",
          parentUuid: "a4",
          at: 13,
          subtype: "stop_hook_summary",
        }),
        createMockPrompt({
          uuid: "p2",
          parentUuid: "s1",
          at: 60,
          text: "<task-notification>\n<task-id>a1</task-id>\n<summary>Agent finished</summary>\n</task-notification>",
        }),
        createMockAssistant({ uuid: "a5", parentUuid: "p2", at: 62 }),
      ]);

      expect(titles(spans)).toEqual(["Fix the bug", "Agent finished"]);
      expect(titles(spans[1].children)).toEqual(["Sure."]);
    });

    it("ends an interrupted turn at the interrupt, with a warning", () => {
      const [main] = convert([
        createMockPrompt({ uuid: "p1" }),
        {
          ...createMockPrompt({ uuid: "i1", parentUuid: "p1", at: 40 }),
          message: {
            role: "user",
            content: [{ type: "text", text: "[Request interrupted by user]" }],
          },
        },
        // Written when the session resumes; no model was called for it.
        createMockAssistant({
          uuid: "a1",
          parentUuid: "i1",
          at: 900,
          model: "<synthetic>",
          blocks: [createMockTextBlock("No response requested.")],
        }),
      ]);

      expect(main.status).toBe("warning");
      expect(getDurationMs(main)).toBe(40000);
      expect(main.children).toEqual([]);
      expect(main.context?.map((item) => item.type)).toEqual([
        "interrupt",
        "synthetic",
      ]);
      expect(main.raw).toHaveLength(3);
    });

    it("reports an API error record as a failed response", () => {
      const [main] = convert([
        createMockPrompt({ uuid: "p1" }),
        createMockAssistant({
          uuid: "a1",
          parentUuid: "p1",
          at: 30,
          model: "<synthetic>",
          blocks: [createMockTextBlock("API Error: overloaded")],
          usage: { input_tokens: 0, output_tokens: 0 },
          extra: { isApiErrorMessage: true },
        }),
      ]);
      const [response] = main.children ?? [];

      expect(response.status).toBe("error");
      expect(extractSpanError(response)?.message).toBe("API Error: overloaded");
      expect(response.tokenUsage).toBeUndefined();
      expect(getDurationMs(response)).toBe(0);
    });

    it("titles a slash command by the command and keeps its output as context", () => {
      const [main] = convert([
        createMockPrompt({
          uuid: "p1",
          text: "<command-name>/model</command-name>\n<command-message>model</command-message>\n<command-args>opus</command-args>",
        }),
        createMockPrompt({
          uuid: "p2",
          parentUuid: "p1",
          text: "<local-command-stdout>Set model to opus</local-command-stdout>",
        }),
      ]);

      expect(main.title).toBe("/model opus");
      expect(main.context?.map((item) => item.type)).toEqual(["local_command"]);
    });
  });

  describe("subagents", () => {
    const mainThread = (): ClaudeCodeLogEntry[] => [
      createMockPrompt({ uuid: "p1" }),
      createMockAssistant({
        uuid: "a1",
        parentUuid: "p1",
        at: 1,
        blocks: [
          createMockToolUseBlock("toolu_agent", "Agent", {
            description: "Explore the repo",
            prompt: "Look around",
            subagent_type: "Explore",
          }),
        ],
      }),
      createMockToolResult({
        uuid: "r1",
        parentUuid: "a1",
        at: 2,
        toolUseId: "toolu_agent",
        content: "Async agent launched successfully.",
        toolUseResult: { status: "async_launched", agentId: "agent1" },
      }),
      createMockAssistant({ uuid: "a2", parentUuid: "r1", at: 4 }),
    ];

    const subagent = (): unknown[] => [
      createMockPrompt({
        uuid: "sp1",
        at: 1,
        agentId: "agent1",
        text: "Look around",
      }),
      createMockAssistant({
        uuid: "sa1",
        parentUuid: "sp1",
        at: 50,
        agentId: "agent1",
        blocks: [createMockTextBlock("Found it.")],
        stopReason: null,
      }),
      createMockSubagentMeta("toolu_agent"),
    ];

    it.each<[string, () => unknown[]]>([
      ["after", () => [...mainThread(), ...subagent()]],
      ["before", () => [...subagent(), ...mainThread()]],
    ])(
      "nests a subagent under the tool call that ran it when its file comes %s the main one",
      (_order, documents) => {
        const [main, ...rest] = convert(documents());
        const host = main.children?.[1] as TraceSpan;
        const [root] = host.children ?? [];

        expect(rest).toEqual([]);
        expect(titles(main.children)).toEqual([
          "Tool call: Agent",
          "Explore the repo",
          "Sure.",
        ]);
        expect(root.type).toBe("agent_invocation");
        expect(root.title).toBe("Look around");
        expect(root.output).toBe("Found it.");
        expect(titles(root.children)).toEqual(["Found it."]);
        // The call returned at once; the span covers the subagent's run.
        expect(getDurationMs(host)).toBe(49000);
        expect(getDurationMs(main)).toBe(50000);
        expect(attribute(host, "claude_code.subagent.agentType")).toEqual({
          stringValue: "Explore",
        });
        expect(host.raw).toHaveLength(3);
      },
    );

    it("finds the subagent in the result text when toolUseResult is absent", () => {
      const documents = mainThread();

      documents[2] = createMockToolResult({
        uuid: "r1",
        parentUuid: "a1",
        at: 2,
        toolUseId: "toolu_agent",
        content: "Launched.\nagentId: a6e89568323eb469f (internal ID)",
      });

      const [main] = convert([
        ...documents,
        createMockPrompt({ uuid: "sp1", agentId: "a6e89568323eb469f" }),
      ]);

      expect(titles(main.children?.[1].children)).toEqual(["Hello"]);
    });

    it("keeps a subagent whose tool call is not there as a main span", () => {
      const spans = convert([...subagent(), createMockPrompt({ uuid: "p9" })]);

      expect(titles(spans)).toEqual(["Hello", "Look around"]);
    });
  });

  describe("input", () => {
    it("reads JSONL text, a JSON array and parsed records alike", () => {
      const records = turn();
      const jsonl = records.map((record) => JSON.stringify(record)).join("\n");
      const expected = convert(records);

      expect(claudeCodeSpanAdapter.convertRawDocumentsToSpans(jsonl)).toEqual(
        expected,
      );
      expect(
        claudeCodeSpanAdapter.convertRawDocumentsToSpans(
          JSON.stringify(records, null, 2),
        ),
      ).toEqual(expected);
      expect(claudeCodeSpanAdapter.convertRawSpansToSpanTree(records)).toEqual(
        expected,
      );
    });

    it("skips records outside the chain and repeated ones", () => {
      const records = turn();
      const [main] = convert([
        { type: "queue-operation", operation: "enqueue" },
        ...records,
        { type: "last-prompt", lastPrompt: "Fix the bug", leafUuid: "a4" },
        records[5],
        "not json",
        null,
      ]);

      expect(titles(main.children)).toEqual([
        "Looking at the file.",
        "Say hi",
        "Done.",
      ]);
      expect(main.children?.[2].raw).toHaveLength(1);
    });

    it("follows the chain through progress records without keeping them", () => {
      const [main] = convert([
        createMockPrompt({ uuid: "p1" }),
        { uuid: "g1", parentUuid: "p1", type: "progress", data: {} },
        createMockAssistant({ uuid: "a1", parentUuid: "g1" }),
      ]);

      expect(titles(main.children)).toEqual(["Sure."]);
      expect(main.raw).toHaveLength(1);
      expect(main.context).toBeUndefined();
    });

    it("places a record without a timestamp after the one before it", () => {
      const [main] = convert([
        createMockPrompt({ uuid: "p1", at: 7 }),
        {
          ...createMockAssistant({ uuid: "a1", parentUuid: "p1" }),
          timestamp: undefined,
        },
      ]);

      expect(main.children?.[0].endTime).toEqual(new Date(mockTimestamp(7)));
    });

    it("gives every span its own id", () => {
      const spans = flattenSpans(
        convert([
          createMockAttachment({ uuid: "c1", attachmentType: "hook_success" }),
          createMockPrompt({ uuid: "p1", parentUuid: "c1" }),
          ...turn().slice(1),
        ]),
      );

      expect(new Set(spans.map((span) => span.id)).size).toBe(spans.length);
    });

    it("survives a JSON round trip", () => {
      const spans = convert([
        ...turn(),
        createMockAttachment({
          uuid: "c1",
          parentUuid: "a4",
          at: 13,
          attachmentType: "total_tokens_reminder",
          payload: { text: "plenty" },
        }),
      ]);

      expect(JSON.parse(JSON.stringify(spans)).map(reviveTraceSpan)).toEqual(
        spans,
      );
    });
  });
});
