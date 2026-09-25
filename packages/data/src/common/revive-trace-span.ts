import type {
  TokenUsage,
  TraceReasoning,
  TraceReasoningLevel,
  TraceSpan,
  TraceSpanCategory,
  TraceSpanStatus,
  TraceTodo,
  TraceTodoStatus,
} from "@evilmartians/agent-prism-types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isTodoStatus = (value: unknown): value is TraceTodoStatus =>
  value === "pending" || value === "in_progress" || value === "completed";

const isReasoningLevel = (value: unknown): value is TraceReasoningLevel =>
  value === "high" || value === "medium" || value === "low";

// Records rather than arrays, so adding a status or category to the union
// without listing it here is a type error.
const SPAN_STATUSES: Record<TraceSpanStatus, true> = {
  success: true,
  error: true,
  pending: true,
  warning: true,
};

const SPAN_CATEGORIES: Record<TraceSpanCategory, true> = {
  llm_call: true,
  tool_execution: true,
  agent_invocation: true,
  chain_operation: true,
  retrieval: true,
  embedding: true,
  create_agent: true,
  span: true,
  event: true,
  guardrail: true,
  unknown: true,
};

const isSpanStatus = (value: unknown): value is TraceSpanStatus =>
  typeof value === "string" && Object.hasOwn(SPAN_STATUSES, value);

const isSpanCategory = (value: unknown): value is TraceSpanCategory =>
  typeof value === "string" && Object.hasOwn(SPAN_CATEGORIES, value);

const isTimestamp = (value: unknown): value is string | number | Date =>
  (typeof value === "string" ||
    typeof value === "number" ||
    value instanceof Date) &&
  !Number.isNaN(new Date(value).getTime());

/**
 * Structural check for a span that arrived as plain JSON (an uploaded file,
 * say). Derived values such as a duration are not required.
 */
export const isTraceSpanLike = (
  value: unknown,
): value is Record<string, unknown> & {
  id: string;
  title: string;
  type: TraceSpanCategory;
  status: TraceSpanStatus;
  raw: string[];
  startTime: string | number | Date;
  endTime: string | number | Date;
} =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.title === "string" &&
  isSpanCategory(value.type) &&
  isSpanStatus(value.status) &&
  Array.isArray(value.raw) &&
  value.raw.every((entry) => typeof entry === "string") &&
  isTimestamp(value.startTime) &&
  isTimestamp(value.endTime);

// The optional structures below come from an untrusted file. Malformed parts
// are dropped here rather than handed to views that would crash on them.

const reviveTokenUsage = (value: unknown): TokenUsage | undefined => {
  if (!isRecord(value)) return undefined;

  const usage: TokenUsage = {};

  Object.entries(value).forEach(([type, entry]) => {
    if (isRecord(entry) && isFiniteNumber(entry.tokens)) {
      usage[type] = isFiniteNumber(entry.cost)
        ? { tokens: entry.tokens, cost: entry.cost }
        : { tokens: entry.tokens };
    }
  });

  return Object.keys(usage).length > 0 ? usage : undefined;
};

const reviveReasoning = (value: unknown): TraceReasoning | undefined => {
  if (!isRecord(value)) return undefined;

  const content = typeof value.content === "string" ? value.content : "";
  const tokens = isFiniteNumber(value.tokens) ? value.tokens : undefined;

  if (!content && tokens === undefined) return undefined;

  return {
    content,
    tokens,
    level: isReasoningLevel(value.level) ? value.level : undefined,
    triggers: Array.isArray(value.triggers)
      ? value.triggers.filter(
          (trigger): trigger is string => typeof trigger === "string",
        )
      : undefined,
  };
};

const reviveTodos = (value: unknown): TraceTodo[] | undefined =>
  Array.isArray(value)
    ? value.flatMap((item: unknown) =>
        isRecord(item) &&
        typeof item.title === "string" &&
        isTodoStatus(item.status)
          ? [{ title: item.title, status: item.status }]
          : [],
      )
    : undefined;

/**
 * Turns a parsed-JSON span tree back into `TraceSpan`s: JSON has no dates, so
 * the timestamps arrive as strings and are converted back, and malformed token
 * usage, reasoning or todos are dropped.
 */
export const reviveTraceSpan = (value: unknown): TraceSpan => {
  if (!isTraceSpanLike(value)) {
    throw new TypeError(
      "Cannot revive a TraceSpan: the value is missing required fields.",
    );
  }

  return {
    ...(value as unknown as TraceSpan),
    startTime: new Date(value.startTime),
    endTime: new Date(value.endTime),
    children: Array.isArray(value.children)
      ? value.children.map(reviveTraceSpan)
      : undefined,
    tokenUsage: reviveTokenUsage(value.tokenUsage),
    reasoning: reviveReasoning(value.reasoning),
    todos: reviveTodos(value.todos),
  };
};
