/**
 * Records of a Claude Code session transcript
 * (`~/.claude/projects/<project>/<sessionId>.jsonl`, one JSON object per line).
 * The format is internal to Claude Code and changes between versions, so every
 * payload field is optional and unknown keys are allowed: narrow at runtime
 * rather than trusting these shapes.
 */

/** Fields shared by the records that form the conversation chain. */
export type ClaudeCodeEntryEnvelope = {
  uuid: string;
  parentUuid: string | null;
  type: string;
  timestamp?: string; // ISO date string
  sessionId?: string;
  version?: string;
  gitBranch?: string;
  cwd?: string;
  slug?: string;
  userType?: string;
  entrypoint?: string;
  isSidechain?: boolean;
  /** Set on the records of a subagent (`subagents/agent-<agentId>.jsonl`). */
  agentId?: string;
  isMeta?: boolean;
  /** On a compaction boundary: the parent from before the history was cut. */
  logicalParentUuid?: string | null;
};

export type ClaudeCodeContentBlock = { type: string } & Record<string, unknown>;

export type ClaudeCodeTextBlock = { type: "text"; text: string };

export type ClaudeCodeThinkingBlock = {
  type: "thinking";
  /** Empty in newer transcripts, which keep only the signature. */
  thinking: string;
  signature?: string;
};

export type ClaudeCodeToolUseBlock = {
  type: "tool_use" | "server_tool_use";
  id: string;
  name: string;
  input?: unknown;
  caller?: { type?: string } & Record<string, unknown>;
};

export type ClaudeCodeToolResultBlock = {
  type: "tool_result" | "web_search_tool_result" | "web_fetch_tool_result";
  tool_use_id: string;
  content?: unknown;
  is_error?: boolean;
};

export type ClaudeCodeUsage = {
  /** Prompt tokens that were neither read from nor written to the cache. */
  input_tokens?: number;
  output_tokens?: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
  output_tokens_details?: { thinking_tokens?: number } | null;
  service_tier?: string | null;
  inference_geo?: string | null;
  speed?: string | null;
} & Record<string, unknown>;

export type ClaudeCodeAssistantMessage = {
  /** Shared by every record of one API response. */
  id?: string;
  model?: string;
  role?: string;
  content?: string | ClaudeCodeContentBlock[];
  stop_reason?: string | null;
  /** Repeated on every record of the response, not split between them. */
  usage?: ClaudeCodeUsage;
} & Record<string, unknown>;

export type ClaudeCodeAssistantEntry = ClaudeCodeEntryEnvelope & {
  type: "assistant";
  message: ClaudeCodeAssistantMessage;
  requestId?: string;
  effort?: string;
  /** Set on the record Claude Code writes in place of a failed response. */
  isApiErrorMessage?: boolean;
} & Record<string, unknown>;

export type ClaudeCodeUserMessage = {
  role?: string;
  /** Text for a prompt; blocks for tool results and interrupt markers. */
  content?: string | ClaudeCodeContentBlock[];
} & Record<string, unknown>;

export type ClaudeCodeUserEntry = ClaudeCodeEntryEnvelope & {
  type: "user";
  message: ClaudeCodeUserMessage;
  promptId?: string;
  origin?: { kind?: string } & Record<string, unknown>;
  permissionMode?: string;
  /** The tool's own result: an object, or a string when the tool failed. */
  toolUseResult?: unknown;
  sourceToolAssistantUUID?: string;
  isCompactSummary?: boolean;
} & Record<string, unknown>;

export type ClaudeCodeAttachmentEntry = ClaudeCodeEntryEnvelope & {
  type: "attachment";
  attachment: { type: string } & Record<string, unknown>;
} & Record<string, unknown>;

export type ClaudeCodeSystemEntry = ClaudeCodeEntryEnvelope & {
  type: "system";
  subtype?: string;
  level?: string;
} & Record<string, unknown>;

/** A chain record of a type that has no shape of its own here. */
export type ClaudeCodeUnknownEntry = ClaudeCodeEntryEnvelope &
  Record<string, unknown>;

export type ClaudeCodeLogEntry =
  | ClaudeCodeAssistantEntry
  | ClaudeCodeUserEntry
  | ClaudeCodeAttachmentEntry
  | ClaudeCodeSystemEntry
  | ClaudeCodeUnknownEntry;

/**
 * `subagents/agent-<agentId>.meta.json`. It names the tool call that spawned
 * the subagent, not the subagent's id.
 */
export type ClaudeCodeSubagentMeta = {
  toolUseId: string;
  agentType?: string;
  description?: string;
  spawnDepth?: number;
} & Record<string, unknown>;

/** A record outside the chain: a queue operation, a title, the last prompt. */
export type ClaudeCodeSidecarRecord = { type: string } & Record<
  string,
  unknown
>;

export type ClaudeCodeRecord =
  | ClaudeCodeLogEntry
  | ClaudeCodeSubagentMeta
  | ClaudeCodeSidecarRecord;

/**
 * A parsed record, or transcript text: one line, or a whole file.
 */
export type ClaudeCodeDocument = ClaudeCodeRecord | string;
