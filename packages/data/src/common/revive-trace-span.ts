import type {
  TraceSpan,
  TraceSpanCategory,
  TraceSpanStatus,
} from "@evilmartians/agent-prism-types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

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
} =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.title === "string" &&
  typeof value.type === "string" &&
  typeof value.status === "string" &&
  Array.isArray(value.raw) &&
  value.startTime !== undefined &&
  value.endTime !== undefined;

/**
 * Turns a parsed-JSON span tree back into `TraceSpan`s: JSON has no dates, so
 * the timestamps arrive as strings and are converted back.
 */
export const reviveTraceSpan = (value: unknown): TraceSpan => {
  if (!isTraceSpanLike(value)) {
    throw new TypeError(
      "Cannot revive a TraceSpan: the value is missing required fields.",
    );
  }

  return {
    ...(value as unknown as TraceSpan),
    startTime: new Date(value.startTime as string | number | Date),
    endTime: new Date(value.endTime as string | number | Date),
    children: Array.isArray(value.children)
      ? value.children.map(reviveTraceSpan)
      : undefined,
  };
};
