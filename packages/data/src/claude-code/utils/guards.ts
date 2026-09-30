import type {
  ClaudeCodeAssistantEntry,
  ClaudeCodeAttachmentEntry,
  ClaudeCodeContentBlock,
  ClaudeCodeLogEntry,
  ClaudeCodeSubagentMeta,
  ClaudeCodeTextBlock,
  ClaudeCodeThinkingBlock,
  ClaudeCodeToolResultBlock,
  ClaudeCodeToolUseBlock,
  ClaudeCodeUserEntry,
} from "@evilmartians/agent-prism-types";

// A transcript is read from disk and its format is not versioned, so records
// are narrowed from what they actually hold. Nothing here throws.

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** A record of the conversation chain, as opposed to transcript metadata. */
export const isLogEntry = (value: unknown): value is ClaudeCodeLogEntry =>
  isRecord(value) &&
  typeof value.uuid === "string" &&
  typeof value.type === "string";

export const isAssistantEntry = (
  entry: ClaudeCodeLogEntry,
): entry is ClaudeCodeAssistantEntry =>
  entry.type === "assistant" && isRecord(entry.message);

export const isUserEntry = (
  entry: ClaudeCodeLogEntry,
): entry is ClaudeCodeUserEntry =>
  entry.type === "user" && isRecord(entry.message);

export const isAttachmentEntry = (
  entry: ClaudeCodeLogEntry,
): entry is ClaudeCodeAttachmentEntry =>
  entry.type === "attachment" &&
  isRecord(entry.attachment) &&
  typeof entry.attachment.type === "string";

export const isSubagentMeta = (
  value: unknown,
): value is ClaudeCodeSubagentMeta =>
  isRecord(value) &&
  typeof value.toolUseId === "string" &&
  typeof value.agentType === "string" &&
  !("uuid" in value);

const isContentBlock = (value: unknown): value is ClaudeCodeContentBlock =>
  isRecord(value) && typeof value.type === "string";

export const isTextBlock = (value: unknown): value is ClaudeCodeTextBlock =>
  isContentBlock(value) &&
  value.type === "text" &&
  typeof value.text === "string";

export const isThinkingBlock = (
  value: unknown,
): value is ClaudeCodeThinkingBlock =>
  isContentBlock(value) &&
  value.type === "thinking" &&
  typeof value.thinking === "string";

export const isToolUseBlock = (
  value: unknown,
): value is ClaudeCodeToolUseBlock =>
  isContentBlock(value) &&
  (value.type === "tool_use" || value.type === "server_tool_use") &&
  typeof value.id === "string" &&
  typeof value.name === "string";

export const isToolResultBlock = (
  value: unknown,
): value is ClaudeCodeToolResultBlock =>
  isContentBlock(value) &&
  (value.type === "tool_result" ||
    value.type === "web_search_tool_result" ||
    value.type === "web_fetch_tool_result") &&
  typeof value.tool_use_id === "string";

/** The content blocks of a message; none when its content is plain text. */
export const blocksOf = (
  entry: ClaudeCodeAssistantEntry | ClaudeCodeUserEntry,
): ClaudeCodeContentBlock[] =>
  Array.isArray(entry.message.content)
    ? entry.message.content.filter(isContentBlock)
    : [];
