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

const SPAN_STATUSES: Record<TraceSpanStatus, true> = {
  error: true,
  pending: true,
  success: true,
  warning: true,
};

const SPAN_CATEGORIES: Record<TraceSpanCategory, true> = {
  agent_invocation: true,
  chain_operation: true,
  create_agent: true,
  embedding: true,
  event: true,
  guardrail: true,
  llm_call: true,
  retrieval: true,
  span: true,
  tool_execution: true,
  unknown: true,
};

const isSpanStatus = (value: unknown): value is TraceSpanStatus =>
  typeof value === "string" && Object.hasOwn(SPAN_STATUSES, value);

const isSpanCategory = (value: unknown): value is TraceSpanCategory =>
  typeof value === "string" && Object.hasOwn(SPAN_CATEGORIES, value);

type TimestampInput = Date | number | string;

const isTimestamp = (value: unknown): value is TimestampInput =>
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
  endTime: Date | number | string;
  id: string;
  raw: string[];
  startTime: Date | number | string;
  status: TraceSpanStatus;
  title: string;
  type: TraceSpanCategory;
} =>
  isRecord(value) &&
  typeof value["id"] === "string" &&
  typeof value["title"] === "string" &&
  isSpanCategory(value["type"]) &&
  isSpanStatus(value["status"]) &&
  Array.isArray(value["raw"]) &&
  value["raw"].every((entry) => typeof entry === "string") &&
  isTimestamp(value["startTime"]) &&
  isTimestamp(value["endTime"]);

const reviveTokenUsage = (value: unknown): TokenUsage | undefined => {
  if (!isRecord(value)) return undefined;

  const usage: TokenUsage = {};

  Object.entries(value).forEach(([type, entry]) => {
    if (isRecord(entry) && isFiniteNumber(entry["tokens"])) {
      usage[type] = isFiniteNumber(entry["cost"])
        ? { cost: entry["cost"], tokens: entry["tokens"] }
        : { tokens: entry["tokens"] };
    }
  });

  return Object.keys(usage).length > 0 ? usage : undefined;
};

const reviveReasoning = (value: unknown): TraceReasoning | undefined => {
  if (!isRecord(value)) return undefined;

  const content = typeof value["content"] === "string" ? value["content"] : "";
  const tokens = isFiniteNumber(value["tokens"]) ? value["tokens"] : undefined;

  if (!content && tokens === undefined) return undefined;

  return {
    content,
    level: isReasoningLevel(value["level"]) ? value["level"] : undefined,
    tokens,
    triggers: Array.isArray(value["triggers"])
      ? value["triggers"].filter(
          (trigger): trigger is string => typeof trigger === "string",
        )
      : undefined,
  };
};

const reviveTodos = (value: unknown): TraceTodo[] | undefined =>
  Array.isArray(value)
    ? value.flatMap((item: unknown) =>
        isRecord(item) &&
        typeof item["title"] === "string" &&
        isTodoStatus(item["status"])
          ? [{ status: item["status"], title: item["title"] }]
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
    children: Array.isArray(value["children"])
      ? value["children"].map(reviveTraceSpan)
      : undefined,
    endTime: new Date(value.endTime),
    reasoning: reviveReasoning(value["reasoning"]),
    startTime: new Date(value.startTime),
    todos: reviveTodos(value["todos"]),
    tokenUsage: reviveTokenUsage(value["tokenUsage"]),
  };
};
