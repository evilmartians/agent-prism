import type {
  ClaudeCodeAssistantEntry,
  ClaudeCodeAttachmentEntry,
  ClaudeCodeContentBlock,
  ClaudeCodeSubagentMeta,
  ClaudeCodeSystemEntry,
  ClaudeCodeToolUseBlock,
  ClaudeCodeUsage,
  ClaudeCodeUserEntry,
} from "@evilmartians/agent-prism-types";

// Builders for made-up transcript records. Real transcripts hold a session's
// content and whatever secrets passed through it, so they are never used as
// fixtures.

type EnvelopeOptions = {
  uuid: string;
  parentUuid?: string | null;
  /** Seconds after the start of the mock session. */
  at?: number;
  /** Puts the record in a subagent's transcript. */
  agentId?: string;
  extra?: Record<string, unknown>;
};

export const mockTimestamp = (seconds = 0): string =>
  new Date(Date.UTC(2026, 0, 1, 10, 0, 0) + seconds * 1000).toISOString();

const envelope = (options: EnvelopeOptions) => ({
  sessionId: "session-1",
  version: "2.1.235",
  gitBranch: "main",
  cwd: "/repo",
  userType: "external",
  ...options.extra,
  uuid: options.uuid,
  parentUuid: options.parentUuid ?? null,
  timestamp: mockTimestamp(options.at),
  isSidechain: options.agentId !== undefined,
  ...(options.agentId === undefined ? {} : { agentId: options.agentId }),
});

export const createMockTextBlock = (text: string): ClaudeCodeContentBlock => ({
  type: "text",
  text,
});

export const createMockThinkingBlock = (
  thinking: string,
): ClaudeCodeContentBlock => ({
  type: "thinking",
  thinking,
  signature: "signature",
});

export const createMockToolUseBlock = (
  id: string,
  name = "Bash",
  input: unknown = { command: "echo hi", description: "Say hi" },
): ClaudeCodeToolUseBlock => ({ type: "tool_use", id, name, input });

export const createMockPrompt = (
  options: EnvelopeOptions & { text?: string },
): ClaudeCodeUserEntry => ({
  ...envelope(options),
  type: "user",
  message: { role: "user", content: options.text ?? "Hello" },
});

export const createMockAssistant = (
  options: EnvelopeOptions & {
    blocks?: ClaudeCodeContentBlock[];
    messageId?: string;
    model?: string;
    stopReason?: string | null;
    usage?: ClaudeCodeUsage;
  },
): ClaudeCodeAssistantEntry => ({
  ...envelope(options),
  type: "assistant",
  message: {
    id: options.messageId ?? `msg_${options.uuid}`,
    model: options.model ?? "claude-sonnet-5",
    role: "assistant",
    content: options.blocks ?? [createMockTextBlock("Sure.")],
    stop_reason:
      options.stopReason === undefined ? "end_turn" : options.stopReason,
    ...(options.usage === undefined ? {} : { usage: options.usage }),
  },
});

export const createMockToolResult = (
  options: EnvelopeOptions & {
    toolUseId: string;
    content?: unknown;
    isError?: boolean;
    toolUseResult?: unknown;
  },
): ClaudeCodeUserEntry => ({
  ...envelope(options),
  type: "user",
  ...(options.toolUseResult === undefined
    ? {}
    : { toolUseResult: options.toolUseResult }),
  message: {
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: options.toolUseId,
        content: options.content ?? "ok",
        ...(options.isError === undefined ? {} : { is_error: options.isError }),
      },
    ],
  },
});

export const createMockAttachment = (
  options: EnvelopeOptions & {
    attachmentType: string;
    payload?: Record<string, unknown>;
  },
): ClaudeCodeAttachmentEntry => ({
  ...envelope(options),
  type: "attachment",
  attachment: { ...options.payload, type: options.attachmentType },
});

export const createMockSystem = (
  options: EnvelopeOptions & { subtype: string },
): ClaudeCodeSystemEntry => ({
  ...envelope(options),
  type: "system",
  subtype: options.subtype,
});

export const createMockSubagentMeta = (
  toolUseId: string,
): ClaudeCodeSubagentMeta => ({
  toolUseId,
  agentType: "Explore",
  description: "Look around",
  spawnDepth: 1,
});
