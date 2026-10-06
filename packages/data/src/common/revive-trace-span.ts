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

import { reviveAttribute } from "./attribute-value.js";
import {
  isArrayOf,
  isFiniteNumber,
  isOneOf,
  isPlainRecord,
  isRecord,
  isString,
} from "./guards.js";

const isTodoStatus = isOneOf<TraceTodoStatus>({
  completed: true,
  in_progress: true,
  pending: true,
});

const isReasoningLevel = isOneOf<TraceReasoningLevel>({
  high: true,
  low: true,
  medium: true,
});

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

const isSpanStatus = isOneOf(SPAN_STATUSES);

const isSpanCategory = isOneOf(SPAN_CATEGORIES);

type TimestampInput = Date | number | string;

const isTimestamp = (value: unknown): value is TimestampInput =>
  (isString(value) || typeof value === "number" || value instanceof Date) &&
  !Number.isNaN(new Date(value).getTime());

const isStringList = isArrayOf(isString);

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
  isString(value["id"]) &&
  isString(value["title"]) &&
  isSpanCategory(value["type"]) &&
  isSpanStatus(value["status"]) &&
  isStringList(value["raw"]) &&
  isTimestamp(value["startTime"]) &&
  isTimestamp(value["endTime"]);

const reviveTokenUsage = (value: unknown): TokenUsage | undefined => {
  if (!isRecord(value)) return undefined;

  const usage: TokenUsage = {};

  Object.entries(value).forEach(([type, entry]: readonly [string, unknown]) => {
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

  const content = isString(value["content"]) ? value["content"] : "";
  const tokens = isFiniteNumber(value["tokens"]) ? value["tokens"] : undefined;

  if (!content && tokens === undefined) return undefined;

  return {
    content,
    level: isReasoningLevel(value["level"]) ? value["level"] : undefined,
    tokens,
    triggers: Array.isArray(value["triggers"])
      ? value["triggers"].filter(isString)
      : undefined,
  };
};

const reviveTodos = (value: unknown): TraceTodo[] | undefined =>
  Array.isArray(value)
    ? value.flatMap((item: unknown) =>
        isRecord(item) &&
        isString(item["title"]) &&
        isTodoStatus(item["status"])
          ? [{ status: item["status"], title: item["title"] }]
          : [],
      )
    : undefined;

const reviveOptionalFields = (
  value: Readonly<Record<string, unknown>>,
): Pick<TraceSpan, "attributes" | "input" | "metadata" | "output"> => ({
  ...(Array.isArray(value["attributes"])
    ? { attributes: value["attributes"].flatMap(reviveAttribute) }
    : {}),
  ...(isString(value["input"]) ? { input: value["input"] } : {}),
  ...(isPlainRecord(value["metadata"]) ? { metadata: value["metadata"] } : {}),
  ...(isString(value["output"]) ? { output: value["output"] } : {}),
});

/**
 * Turns a parsed-JSON span tree back into `TraceSpan`s: JSON has no dates, so
 * the timestamps arrive as strings and are converted back. Every field is
 * checked against `TraceSpan`: keys it does not declare are left out, and a
 * malformed optional field (or entry of one, such as an attribute) is dropped.
 *
 * @throws {TypeError} When the span or any of its children is missing a
 * required field or has one of the wrong type.
 */
export const reviveTraceSpan = (value: unknown): TraceSpan => {
  if (!isTraceSpanLike(value)) {
    throw new TypeError(
      "Cannot revive a TraceSpan: the value is missing required fields.",
    );
  }

  return {
    ...reviveOptionalFields(value),
    children: Array.isArray(value["children"])
      ? value["children"].map(reviveTraceSpan)
      : undefined,
    endTime: new Date(value.endTime),
    id: value.id,
    raw: value.raw,
    reasoning: reviveReasoning(value["reasoning"]),
    startTime: new Date(value.startTime),
    status: value.status,
    title: value.title,
    todos: reviveTodos(value["todos"]),
    tokenUsage: reviveTokenUsage(value["tokenUsage"]),
    type: value.type,
  };
};
