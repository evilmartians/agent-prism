import type {
  ClaudeCodeAssistantEntry,
  ClaudeCodeDocument,
  ClaudeCodeLogEntry,
  ClaudeCodeSubagentMeta,
  ClaudeCodeToolResultBlock,
  ClaudeCodeToolUseBlock,
  ClaudeCodeUserEntry,
  InputOutputData,
  TokenType,
  TokenUsage,
  TraceReasoning,
  TraceSpan,
  TraceSpanAttribute,
  TraceSpanCategory,
  TraceSpanStatus,
  TraceTodo,
  TraceTodoStatus,
} from "@evilmartians/agent-prism-types";

import {
  CLAUDE_CODE_ATTRIBUTES,
  OPENTELEMETRY_GENAI_ATTRIBUTES,
} from "@evilmartians/agent-prism-types";

import type { SpanAdapter } from "../types";

import { addTokenUsage, getTotalTokens } from "../common/token-usage.js";
import {
  addMissingAttributes,
  compactAttributes,
  isUsageAttribute,
  passthroughAttributes,
  toAttribute,
  usageAttributes,
} from "./utils/build-attributes.js";
import { buildContextItem } from "./utils/build-context-item.js";
import {
  type ClaudeCodeEntryClass,
  classifyEntry,
  SYNTHETIC_MODEL,
} from "./utils/classify-entry.js";
import {
  entryText,
  promptTitle,
  thinkingOfBlocks,
  titleFromText,
  toolInput,
  toolResultText,
  toolTitle,
} from "./utils/entry-text.js";
import { timestampOf } from "./utils/entry-timestamp.js";
import { extractToolError } from "./utils/extract-tool-error.js";
import {
  blocksOf,
  isAssistantEntry,
  isAttachmentEntry,
  isLogEntry,
  isRecord,
  isSubagentMeta,
  isToolUseBlock,
} from "./utils/guards.js";
import { parseClaudeCodeJSONL } from "./utils/parse-claude-code-jsonl.js";

const GENAI = OPENTELEMETRY_GENAI_ATTRIBUTES;
const CLAUDE = CLAUDE_CODE_ATTRIBUTES;

// Fields the span model takes up itself. Every other field of a record is
// passed through as an attribute.
const HANDLED_ENTRY_KEYS = new Set([
  "type",
  "message",
  "attachment",
  "toolUseResult",
  "timestamp",
]);
const HANDLED_MESSAGE_KEYS = new Set([
  "id",
  "type",
  "role",
  "model",
  "content",
  "stop_reason",
  "usage",
]);
const HANDLED_TOOL_USE_KEYS = new Set(["type", "id", "name", "input"]);
const HANDLED_TOOL_INPUT_KEYS = new Set(["command", "description"]);
const HANDLED_TOOL_RESULT_KEYS = new Set(["stdout"]);
const HANDLED_SUBAGENT_META_KEYS = new Set(["toolUseId"]);

const USAGE_TOKEN_TYPES: [string, TokenType][] = [
  ["input_tokens", "input"],
  ["output_tokens", "output"],
  ["cache_read_input_tokens", "cache_read"],
  ["cache_creation_input_tokens", "cache_write"],
];

const TODO_STATUSES: Record<TraceTodoStatus, true> = {
  pending: true,
  in_progress: true,
  completed: true,
};

// Tools that run a subagent.
const SUBAGENT_TOOLS = new Set(["Agent", "Task"]);
const AGENT_ID_IN_RESULT = /\bagentId: ([0-9a-f]{8,})\b/;

const isTodoStatus = (value: unknown): value is TraceTodoStatus =>
  typeof value === "string" && Object.hasOwn(TODO_STATUSES, value);

const later = (a: Date, b: Date): Date => (b.getTime() > a.getTime() ? b : a);

const joinText = (
  current: string | undefined,
  incoming: string | undefined,
): string | undefined =>
  current && incoming ? `${current}\n\n${incoming}` : current || incoming;

const attributeText = (span: TraceSpan, key: string): string | undefined =>
  span.attributes?.find((attribute) => attribute.key === key)?.value
    .stringValue;

const errorAttribute = (message: string): TraceSpanAttribute => ({
  key: CLAUDE.ERROR_MESSAGE,
  value: { stringValue: message },
});

// ---------------------------------------------------------------------------
// One record
// ---------------------------------------------------------------------------

const tokenUsageOf = (
  entry: ClaudeCodeAssistantEntry,
): TokenUsage | undefined => {
  const { usage } = entry.message;

  if (!isRecord(usage)) return undefined;

  // Anthropic reports cached prompt tokens next to input_tokens, not inside
  // it, so the four counts are already disjoint.
  const tokenUsage = USAGE_TOKEN_TYPES.reduce<TokenUsage>(
    (result, [field, type]) => {
      const tokens = usage[field];

      return typeof tokens === "number" && Number.isFinite(tokens)
        ? addTokenUsage(result, type, tokens)
        : result;
    },
    {},
  );

  // The records Claude Code writes itself report zeros, which is no usage.
  return getTotalTokens(tokenUsage) > 0 ? tokenUsage : undefined;
};

const reasoningOf = (
  entry: ClaudeCodeAssistantEntry,
): TraceReasoning | undefined => {
  const content = thinkingOfBlocks(blocksOf(entry)) ?? "";
  const tokens = entry.message.usage?.output_tokens_details?.thinking_tokens;

  // Newer transcripts keep a thinking block's signature but not its text; the
  // usage still says how much thinking there was.
  if (typeof tokens === "number" && tokens > 0) return { content, tokens };

  return content === "" ? undefined : { content };
};

const todosOfToolUse = (
  block: ClaudeCodeToolUseBlock,
): TraceTodo[] | undefined => {
  if (block.name !== "TodoWrite" || !isRecord(block.input)) return undefined;

  const { todos } = block.input;

  return Array.isArray(todos)
    ? todos.flatMap((todo: unknown) =>
        isRecord(todo) &&
        typeof todo.content === "string" &&
        isTodoStatus(todo.status)
          ? [{ title: todo.content, status: todo.status }]
          : [],
      )
    : undefined;
};

// Each TodoWrite call restates the whole list, so the last one is the list.
const todosOf = (entry: ClaudeCodeAssistantEntry): TraceTodo[] | undefined =>
  blocksOf(entry)
    .filter(isToolUseBlock)
    .map(todosOfToolUse)
    .filter((todos): todos is TraceTodo[] => todos !== undefined)
    .at(-1);

const isWarning = (classified: ClaudeCodeEntryClass): boolean => {
  if (classified.kind !== "context") return false;

  const { contextKind, entry } = classified;
  const fields: Record<string, unknown> = entry;

  return (
    contextKind === "interrupt" ||
    (isAttachmentEntry(entry) &&
      entry.attachment.type === "hook_blocking_error") ||
    (contextKind === "system" && fields.level === "error")
  );
};

const categoryOf = (classified: ClaudeCodeEntryClass): TraceSpanCategory => {
  switch (classified.kind) {
    case "assistant":
      return "llm_call";
    case "prompt":
      return "agent_invocation";
    case "tool_result":
      return "tool_execution";
    default:
      return "event";
  }
};

const statusOf = (classified: ClaudeCodeEntryClass): TraceSpanStatus => {
  switch (classified.kind) {
    case "assistant":
      return classified.entry.isApiErrorMessage === true ? "error" : "success";
    case "tool_result":
      return classified.results.some((result) => result.is_error === true)
        ? "error"
        : "success";
    default:
      return isWarning(classified) ? "warning" : "success";
  }
};

const inputOutputOf = (classified: ClaudeCodeEntryClass): InputOutputData => {
  switch (classified.kind) {
    case "assistant":
      return { output: entryText(classified.entry) };
    case "prompt":
      return { input: classified.text || undefined };
    case "tool_result":
      return { output: toolResultText(classified.results[0]?.content) };
    default:
      return {};
  }
};

const toolNamesOf = (entry: ClaudeCodeAssistantEntry): string[] =>
  blocksOf(entry)
    .filter(isToolUseBlock)
    .map((block) => block.name);

/**
 * A response has no input, so its title comes from what it put out: the first
 * line of its text or, as most responses only call tools, the tools it called.
 */
const responseTitle = (
  output: string | undefined,
  toolNames: string[],
  model: unknown,
): string => {
  const fromText = titleFromText(output);

  if (fromText) return fromText;

  if (toolNames.length > 0) {
    const label = toolNames.length === 1 ? "Tool call" : "Tool calls";

    return `${label}: ${[...new Set(toolNames)].join(", ")}`;
  }

  return typeof model === "string" && model !== "" ? model : "Assistant";
};

const promptAttributes = (entry: ClaudeCodeUserEntry): TraceSpanAttribute[] => [
  ...compactAttributes([toAttribute(GENAI.OPERATION_NAME, "invoke_agent")]),
  ...passthroughAttributes(entry, CLAUDE.PREFIX, HANDLED_ENTRY_KEYS),
];

const responseAttributes = (
  entry: ClaudeCodeAssistantEntry,
): TraceSpanAttribute[] => {
  const { message } = entry;
  const failure =
    entry.isApiErrorMessage === true ? entryText(entry) : undefined;

  return [
    ...compactAttributes([
      toAttribute(GENAI.SYSTEM, "anthropic"),
      toAttribute(GENAI.OPERATION_NAME, "chat"),
      toAttribute(GENAI.MODEL, message.model),
      toAttribute(CLAUDE.RESPONSE_ID, message.id),
      toAttribute(CLAUDE.RESPONSE_FINISH_REASONS, message.stop_reason),
      failure === undefined ? undefined : errorAttribute(failure),
    ]),
    ...usageAttributes(message.usage),
    ...passthroughAttributes(
      message,
      CLAUDE.MESSAGE_PREFIX,
      HANDLED_MESSAGE_KEYS,
    ),
    ...passthroughAttributes(entry, CLAUDE.PREFIX, HANDLED_ENTRY_KEYS),
  ];
};

const toolResultAttributes = (
  entry: ClaudeCodeUserEntry,
  result: ClaudeCodeToolResultBlock,
): TraceSpanAttribute[] => [
  ...compactAttributes([
    toAttribute(CLAUDE.TOOL_CALL_ID, result.tool_use_id),
    result.is_error === true
      ? errorAttribute(extractToolError(entry.toolUseResult, result.content))
      : undefined,
  ]),
  ...passthroughAttributes(
    entry.toolUseResult,
    CLAUDE.TOOL_RESULT_PREFIX,
    HANDLED_TOOL_RESULT_KEYS,
  ),
  ...passthroughAttributes(entry, CLAUDE.PREFIX, HANDLED_ENTRY_KEYS),
];

// What one result block of a record says about its tool call. A record
// normally holds a single block.
const toolResultFields = (
  entry: ClaudeCodeUserEntry,
  result: ClaudeCodeToolResultBlock,
): Pick<TraceSpan, "attributes" | "output" | "status"> => ({
  output: toolResultText(result.content),
  status: result.is_error === true ? "error" : "success",
  attributes: toolResultAttributes(entry, result),
});

/**
 * Turns one record into a span of its own. The single pass then either keeps
 * that span or folds it into the span the record belongs to.
 */
const toSpanPart = (
  classified: ClaudeCodeEntryClass,
  fallbackTime: Date = new Date(0),
): TraceSpan => {
  const recordedAt = timestampOf(classified.entry) ?? fallbackTime;
  const base = {
    id: classified.entry.uuid,
    type: categoryOf(classified),
    status: statusOf(classified),
    startTime: recordedAt,
    endTime: recordedAt,
    raw: [JSON.stringify(classified.entry, null, 2)],
    children: [],
    ...inputOutputOf(classified),
  };

  switch (classified.kind) {
    case "assistant": {
      const { entry } = classified;

      return {
        ...base,
        title: responseTitle(
          base.output,
          toolNamesOf(entry),
          entry.message.model,
        ),
        tokenUsage: tokenUsageOf(entry),
        reasoning: reasoningOf(entry),
        todos: todosOf(entry),
        attributes: responseAttributes(entry),
        metadata: { brand: { type: "anthropic" } },
      };
    }

    case "context": {
      const item = buildContextItem(
        classified.entry,
        classified.contextKind,
        classified.text,
      );

      return { ...base, title: item.title, context: [item] };
    }

    case "prompt":
      return {
        ...base,
        title: promptTitle(classified.text) ?? "User prompt",
        attributes: promptAttributes(classified.entry),
      };

    case "tool_result":
      return {
        ...base,
        title: "Tool result",
        ...toolResultFields(classified.entry, classified.results[0]),
      };

    default:
      return { ...base, title: classified.entry.type };
  }
};

// A record can call several tools, so tool spans are built from the call
// blocks rather than from records.
const toToolSpan = (
  entry: ClaudeCodeAssistantEntry,
  block: ClaudeCodeToolUseBlock,
  part: TraceSpan,
): TraceSpan => ({
  id: block.id,
  title: toolTitle(block),
  type: "tool_execution",
  // Pending until the record with its result comes along.
  status: "pending",
  startTime: part.endTime,
  endTime: part.endTime,
  raw: [...part.raw],
  children: [],
  input: toolInput(block),
  todos: todosOfToolUse(block),
  attributes: [
    ...compactAttributes([
      toAttribute(GENAI.OPERATION_NAME, "execute_tool"),
      toAttribute(GENAI.TOOL_NAME, block.name),
      toAttribute(CLAUDE.TOOL_CALL_ID, block.id),
    ]),
    ...passthroughAttributes(
      block.input,
      CLAUDE.TOOL_INPUT_PREFIX,
      HANDLED_TOOL_INPUT_KEYS,
    ),
    ...passthroughAttributes(
      block,
      CLAUDE.TOOL_USE_PREFIX,
      HANDLED_TOOL_USE_KEYS,
    ),
    ...passthroughAttributes(entry, CLAUDE.PREFIX, HANDLED_ENTRY_KEYS),
  ],
});

// ---------------------------------------------------------------------------
// Joins
// ---------------------------------------------------------------------------

type Join = "context" | "prompt" | "response" | "tool_result";

const joinReasoning = (
  current: TraceReasoning | undefined,
  incoming: TraceReasoning | undefined,
): TraceReasoning | undefined => {
  if (!current || !incoming) return current ?? incoming;

  const content = joinText(current.content, incoming.content) ?? "";
  // A count for the whole response, repeated on its records: never summed.
  const tokens = incoming.tokens ?? current.tokens;

  return tokens === undefined ? { content } : { content, tokens };
};

// The records of one response repeat its usage: the same numbers in a main
// transcript, snapshots that grow in a subagent's. The latest one is the
// response's usage, and adding them up would count its tokens several times.
const isNewerUsage = (
  current: TokenUsage | undefined,
  incoming: TokenUsage | undefined,
): boolean =>
  incoming !== undefined &&
  (incoming.output?.tokens ?? 0) >= (current?.output?.tokens ?? 0);

const joinResponseAttributes = (
  current: TraceSpanAttribute[] = [],
  incoming: TraceSpanAttribute[] = [],
  takeUsage: boolean,
): TraceSpanAttribute[] => {
  const replaced = (key: string): boolean =>
    key === CLAUDE.RESPONSE_FINISH_REASONS ||
    (takeUsage && isUsageAttribute(key));
  const replacements = incoming.filter((attribute) => replaced(attribute.key));
  const replacedKeys = new Set(replacements.map((attribute) => attribute.key));

  return addMissingAttributes(
    [
      ...current.filter(
        (attribute) =>
          !replacedKeys.has(attribute.key) &&
          !(takeUsage && isUsageAttribute(attribute.key)),
      ),
      ...replacements,
    ],
    incoming,
  );
};

/**
 * Folds the span built from one record into the span that record belongs to.
 * The record is always added to the target's raw, so the span lists every
 * record it was built from; what else changes depends on the join:
 *
 * - `context`: a record that never becomes a span (an attachment, a system
 *   notice) adds its item to the span it follows;
 * - `response`: another record of the same API response adds its text and
 *   thinking, and its usage replaces the one recorded so far;
 * - `tool_result`: the result completes the tool call;
 * - `prompt`: the prompt takes over a span that so far only held context.
 */
const mergeSpan = (target: TraceSpan, part: TraceSpan, join: Join): void => {
  target.raw.push(...part.raw);

  switch (join) {
    case "context":
      target.context = [...(target.context ?? []), ...(part.context ?? [])];

      if (part.status === "warning" && target.status === "success") {
        target.status = "warning";
      }

      break;

    case "prompt":
      target.title = part.title;
      target.input = part.input;
      target.startTime = part.startTime;
      target.endTime = later(part.endTime, target.endTime);
      target.attributes = part.attributes;
      break;

    case "response": {
      const takeUsage = isNewerUsage(target.tokenUsage, part.tokenUsage);

      target.output = joinText(target.output, part.output);
      target.reasoning = joinReasoning(target.reasoning, part.reasoning);
      target.todos = part.todos ?? target.todos;
      target.endTime = later(target.endTime, part.endTime);
      target.attributes = joinResponseAttributes(
        target.attributes,
        part.attributes,
        takeUsage,
      );

      if (takeUsage) target.tokenUsage = part.tokenUsage;
      if (part.status === "error") target.status = "error";

      break;
    }

    case "tool_result":
      target.output = part.output;
      target.status = part.status;
      target.endTime = later(target.startTime, part.endTime);
      target.attributes = addMissingAttributes(
        target.attributes,
        part.attributes,
      );
      break;
  }
};

// ---------------------------------------------------------------------------
// The single pass
// ---------------------------------------------------------------------------

type PassState = {
  /** Record uuid → the span that record created or was folded into. */
  spansByUuid: Map<string, TraceSpan>;
  mainSpans: TraceSpan[];
  parents: Map<TraceSpan, TraceSpan>;
  /** Response id → its span. */
  responses: Map<string, TraceSpan>;
  /** Response span → the tools it called. */
  responseTools: Map<TraceSpan, string[]>;
  /** Tool call id → its span. */
  tools: Map<string, TraceSpan>;
  /** Spans that hold context for a prompt that has not come yet. */
  placeholders: Set<TraceSpan>;
  /** Subagent id → the tool span that ran it. */
  subagentHosts: Map<string, TraceSpan>;
  subagentSpans: { agentId: string; span: TraceSpan }[];
  subagentMetas: ClaudeCodeSubagentMeta[];
  /** Record uuid → when it was written. */
  timestamps: Map<string, Date>;
  lastTimestamp: Date;
};

const createPassState = (): PassState => ({
  spansByUuid: new Map(),
  mainSpans: [],
  parents: new Map(),
  responses: new Map(),
  responseTools: new Map(),
  tools: new Map(),
  placeholders: new Set(),
  subagentHosts: new Map(),
  subagentSpans: [],
  subagentMetas: [],
  timestamps: new Map(),
  lastTimestamp: new Date(0),
});

const attach = (
  state: PassState,
  parent: TraceSpan,
  child: TraceSpan,
): void => {
  (parent.children ??= []).push(child);
  state.parents.set(child, parent);
};

/**
 * The span new spans attach to when a record chains off `span`. Records chain
 * off whatever was written last, so following the chain literally would nest
 * every step under the one before it. Spans attach to the turn instead: the
 * agent span that `span` is, or belongs to.
 */
const ownerOf = (state: PassState, span: TraceSpan): TraceSpan =>
  span.type === "agent_invocation" ? span : (state.parents.get(span) ?? span);

// A subagent's spans go under the tool call that ran it, which can sit in
// another file that has not been read yet. They are placed once the pass ends.
const registerAgentSpan = (
  state: PassState,
  entry: ClaudeCodeLogEntry,
  span: TraceSpan,
): void => {
  if (entry.isSidechain === true && typeof entry.agentId === "string") {
    state.subagentSpans.push({ agentId: entry.agentId, span });
  } else {
    state.mainSpans.push(span);
  }
};

const knownParentOf = (
  state: PassState,
  entry: ClaudeCodeLogEntry,
): TraceSpan | undefined => {
  const parentUuid = entry.parentUuid ?? entry.logicalParentUuid;

  return typeof parentUuid === "string"
    ? state.spansByUuid.get(parentUuid)
    : undefined;
};

/**
 * The span a record chains off. When the transcript does not hold it (the
 * first records of a session are hook output with no parent; a transcript can
 * also start mid-conversation), a session span stands in for it.
 */
const parentOf = (
  state: PassState,
  entry: ClaudeCodeLogEntry,
  part: TraceSpan,
): TraceSpan => {
  const known = knownParentOf(state, entry);

  if (known) return known;

  const session: TraceSpan = {
    id: `${entry.uuid}:session`,
    title: "Session",
    type: "agent_invocation",
    status: "success",
    startTime: part.startTime,
    endTime: part.endTime,
    raw: [],
    children: [],
  };

  state.placeholders.add(session);
  registerAgentSpan(state, entry, session);

  return session;
};

const placePrompt = (
  state: PassState,
  entry: ClaudeCodeUserEntry,
  part: TraceSpan,
): TraceSpan => {
  const parent = knownParentOf(state, entry);

  if (
    parent &&
    state.placeholders.has(parent) &&
    (parent.children ?? []).length === 0
  ) {
    state.placeholders.delete(parent);
    mergeSpan(parent, part, "prompt");

    return parent;
  }

  registerAgentSpan(state, entry, part);

  return part;
};

const placeToolCall = (
  state: PassState,
  entry: ClaudeCodeAssistantEntry,
  block: ClaudeCodeToolUseBlock,
  response: TraceSpan,
  part: TraceSpan,
): TraceSpan => {
  const known = state.tools.get(block.id);

  if (known) return known;

  const tool = toToolSpan(entry, block, part);

  attach(state, ownerOf(state, response), tool);
  state.tools.set(block.id, tool);
  state.responseTools.set(response, [
    ...(state.responseTools.get(response) ?? []),
    block.name,
  ]);

  return tool;
};

const placeAssistant = (
  state: PassState,
  entry: ClaudeCodeAssistantEntry,
  part: TraceSpan,
): TraceSpan => {
  const responseId = entry.message.id ?? entry.uuid;
  const known = state.responses.get(responseId);
  // The tool spans are built from the part as the record left it.
  const recorded = { ...part, raw: [...part.raw] };

  if (known) {
    mergeSpan(known, part, "response");
  } else {
    // The transcript does not say when a request was sent. It was sent when
    // the step before it ended, which is when the record this one chains off
    // was written. Without this a response would span only the moments between
    // its own records, and the model's latency would not show at all.
    const requestedAt =
      entry.message.model !== SYNTHETIC_MODEL &&
      typeof entry.parentUuid === "string"
        ? state.timestamps.get(entry.parentUuid)
        : undefined;

    if (requestedAt && requestedAt.getTime() < part.startTime.getTime()) {
      part.startTime = requestedAt;
    }

    attach(state, ownerOf(state, parentOf(state, entry, part)), part);
    state.responses.set(responseId, part);
  }

  const response = known ?? part;
  const tools = blocksOf(entry)
    .filter(isToolUseBlock)
    .map((block) => placeToolCall(state, entry, block, response, recorded));

  // What follows a tool call (its result, the hooks run on it) chains off the
  // record that made the call, so that record stands for the tool span.
  return tools.length === 1 ? tools[0] : response;
};

const subagentIdOf = (
  entry: ClaudeCodeUserEntry,
  tool: TraceSpan,
): string | undefined => {
  const result = entry.toolUseResult;

  if (isRecord(result) && typeof result.agentId === "string") {
    return result.agentId;
  }

  // A subagent's own transcript leaves toolUseResult out, so a subagent it
  // ran in turn is only named in the text of the result.
  return SUBAGENT_TOOLS.has(attributeText(tool, GENAI.TOOL_NAME) ?? "")
    ? AGENT_ID_IN_RESULT.exec(tool.output ?? "")?.[1]
    : undefined;
};

const placeToolResult = (
  state: PassState,
  entry: ClaudeCodeUserEntry,
  results: ClaudeCodeToolResultBlock[],
  part: TraceSpan,
): TraceSpan => {
  const tools = results.map((result, index) => {
    // The part was built from the first result, which is normally the only one.
    const resultPart: TraceSpan =
      index === 0
        ? part
        : {
            ...part,
            ...toolResultFields(entry, result),
            raw: [...part.raw],
            children: [],
          };
    const known = state.tools.get(result.tool_use_id);

    if (known) {
      mergeSpan(known, resultPart, "tool_result");

      const agentId = subagentIdOf(entry, known);

      if (agentId !== undefined) state.subagentHosts.set(agentId, known);

      return known;
    }

    // The call is not in the transcript (it was cut, or compacted away), so
    // the result stands for the whole call.
    const tool = { ...resultPart, id: result.tool_use_id };

    attach(state, ownerOf(state, parentOf(state, entry, part)), tool);
    state.tools.set(result.tool_use_id, tool);

    return tool;
  });

  return tools[0];
};

const placeContext = (
  state: PassState,
  classified: Extract<ClaudeCodeEntryClass, { kind: "context" }>,
  part: TraceSpan,
): TraceSpan => {
  const parent = parentOf(state, classified.entry, part);

  mergeSpan(parent, part, "context");

  // An interrupt ends the turn, wherever in the turn it landed.
  if (classified.contextKind === "interrupt") {
    const turn = ownerOf(state, parent);

    turn.endTime = later(turn.endTime, part.endTime);

    if (turn.status === "success") turn.status = "warning";
  }

  return parent;
};

const placeRecord = (
  state: PassState,
  classified: Exclude<ClaudeCodeEntryClass, { kind: "link" }>,
  part: TraceSpan,
): TraceSpan => {
  switch (classified.kind) {
    case "assistant":
      return placeAssistant(state, classified.entry, part);
    case "context":
      return placeContext(state, classified, part);
    case "prompt":
      return placePrompt(state, classified.entry, part);
    case "tool_result":
      return placeToolResult(state, classified.entry, classified.results, part);
  }
};

// ---------------------------------------------------------------------------
// After the pass
// ---------------------------------------------------------------------------

const applySubagentMetas = (state: PassState): void => {
  state.subagentMetas.forEach((meta) => {
    const tool = state.tools.get(meta.toolUseId);

    if (!tool) return;

    tool.raw.push(JSON.stringify(meta, null, 2));
    tool.attributes = addMissingAttributes(
      tool.attributes,
      passthroughAttributes(
        meta,
        CLAUDE.SUBAGENT_PREFIX,
        HANDLED_SUBAGENT_META_KEYS,
      ),
    );
  });
};

const placeSubagentSpans = (state: PassState): void => {
  state.subagentSpans.forEach(({ agentId, span }) => {
    const host = state.subagentHosts.get(agentId);

    if (host) {
      attach(state, host, span);
    } else {
      // The tool call that ran it is not among the records.
      state.mainSpans.push(span);
    }
  });
};

const byStartTime = (a: TraceSpan, b: TraceSpan): number =>
  a.startTime.getTime() - b.startTime.getTime();

const settleSpan = (state: PassState, span: TraceSpan): void => {
  const children = [...(span.children ?? [])].sort(byStartTime);

  children.forEach((child) => settleSpan(state, child));
  span.children = children;
  span.endTime = children.reduce(
    (end, child) => later(end, child.endTime),
    span.endTime,
  );

  if (span.type === "llm_call") {
    span.title = responseTitle(
      span.output,
      state.responseTools.get(span) ?? [],
      attributeText(span, GENAI.MODEL),
    );
  }

  // A turn's answer is its last response, unless that one went on to call
  // tools: then the turn was cut short and has no answer.
  if (span.type === "agent_invocation" && span.output === undefined) {
    const last = children.filter((child) => child.type === "llm_call").at(-1);

    if (last && !state.responseTools.has(last)) span.output = last.output;
  }
};

const finalizeSpans = (state: PassState): TraceSpan[] => {
  applySubagentMetas(state);
  placeSubagentSpans(state);
  state.mainSpans.forEach((span) => settleSpan(state, span));

  return [...state.mainSpans].sort(byStartTime);
};

/**
 * Builds the span tree in one pass over the records, in the order they were
 * written. Each record is turned into a span, which then either joins the tree
 * or is folded into the span it belongs to:
 *
 * - a prompt opens a turn: a main span, or a subagent's;
 * - the records of one API response fold into one LLM span under the turn;
 * - each tool call gets a span under the turn, and its result folds into it;
 * - everything else (attachments, system notices, interrupts) folds into the
 *   span of the record it chains off, as context.
 *
 * `spansByUuid` is what ties it together: every record registers the span it
 * ended up in under its own uuid, so the records chaining off it find that
 * span, and several uuids lead to the same one.
 */
const buildSpanTree = (records: readonly unknown[]): TraceSpan[] => {
  const state = createPassState();

  records.forEach((record) => {
    if (isSubagentMeta(record)) {
      state.subagentMetas.push(record);

      return;
    }

    if (!isLogEntry(record) || state.spansByUuid.has(record.uuid)) return;

    const classified = classifyEntry(record);
    // A record without a usable timestamp is taken to follow the last one.
    const recordedAt = timestampOf(record) ?? state.lastTimestamp;

    state.lastTimestamp = recordedAt;
    state.timestamps.set(record.uuid, recordedAt);

    // A link holds nothing to keep; the records chaining off it only need to
    // find the span it followed.
    const span =
      classified.kind === "link"
        ? knownParentOf(state, record)
        : placeRecord(state, classified, toSpanPart(classified, recordedAt));

    if (span) state.spansByUuid.set(record.uuid, span);
  });

  return finalizeSpans(state);
};

// ---------------------------------------------------------------------------
// Adapter
// ---------------------------------------------------------------------------

/**
 * Adapter for Claude Code session transcripts: the JSONL files under
 * `~/.claude/projects/`, with or without their `subagents/` files.
 *
 * A record does not map to a span one to one, so the methods that take a single
 * record describe the span that record would be on its own, and
 * `convertRawDocumentsToSpans` / `convertRawSpansToSpanTree` combine them.
 */
export const claudeCodeSpanAdapter: SpanAdapter<
  ClaudeCodeDocument,
  ClaudeCodeLogEntry
> = {
  convertRawDocumentsToSpans(
    documents: ClaudeCodeDocument | ClaudeCodeDocument[],
  ): TraceSpan[] {
    const documentList = Array.isArray(documents) ? documents : [documents];

    return buildSpanTree(
      documentList.flatMap((document): unknown[] =>
        typeof document === "string"
          ? parseClaudeCodeJSONL(document)
          : [document],
      ),
    );
  },

  convertRawSpansToSpanTree(entries: ClaudeCodeLogEntry[]): TraceSpan[] {
    return buildSpanTree(entries);
  },

  convertRawSpanToTraceSpan(entry: ClaudeCodeLogEntry): TraceSpan {
    return toSpanPart(classifyEntry(entry));
  },

  getTokenUsage(entry: ClaudeCodeLogEntry): TokenUsage | undefined {
    return isAssistantEntry(entry) ? tokenUsageOf(entry) : undefined;
  },

  getTraceReasoning(entry: ClaudeCodeLogEntry): TraceReasoning | undefined {
    return isAssistantEntry(entry) ? reasoningOf(entry) : undefined;
  },

  getTraceTodos(entry: ClaudeCodeLogEntry): TraceTodo[] | undefined {
    return isAssistantEntry(entry) ? todosOf(entry) : undefined;
  },

  getSpanInputOutput(entry: ClaudeCodeLogEntry): InputOutputData {
    return inputOutputOf(classifyEntry(entry));
  },

  getSpanStatus(entry: ClaudeCodeLogEntry): TraceSpanStatus {
    return statusOf(classifyEntry(entry));
  },

  getSpanCategory(entry: ClaudeCodeLogEntry): TraceSpanCategory {
    return categoryOf(classifyEntry(entry));
  },
};
