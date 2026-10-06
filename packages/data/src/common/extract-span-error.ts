import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { flattenSpans } from "./flatten-spans.js";

export interface RunErrorEntry {
  details: SpanErrorDetails;
  span: TraceSpan;
}

export interface SpanErrorDetails {
  message: string;
  nodeName: string;
  stack?: string | undefined;
}

export type TraceRunStatus = "error" | "success";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const nonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
};

const nonBlankUntrimmedString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim().length > 0 ? value : undefined;

const ERROR_MESSAGE_KEYS = [
  "error.message",
  "status.message",
  "exception.message",
] as const;

const ERROR_STACK_KEYS = [
  "error.stack",
  "exception.stacktrace",
  "exception.stack",
] as const;

const readAttribute = (
  span: TraceSpan,
  keys: readonly string[],
  normalize: (value: unknown) => string | undefined = nonEmptyString,
): string | undefined => {
  for (const key of keys) {
    const match = span.attributes?.find((entry) => entry.key === key);
    const value = normalize(match?.value.stringValue);

    if (value !== undefined && value !== "") return value;
  }

  return undefined;
};

const parseRawRecords = (raw: string[]): Record<string, unknown>[] =>
  raw.flatMap((entry) => {
    try {
      const parsed: unknown = JSON.parse(entry);

      return isRecord(parsed) ? [parsed] : [];
    } catch {
      return [];
    }
  });

const findFirstInRecords = (
  records: Record<string, unknown>[],
  read: (record: Record<string, unknown>) => string | undefined,
): string | undefined => {
  for (const record of records) {
    const value = read(record);

    if (value !== undefined && value !== "") return value;
  }

  return undefined;
};

/**
 * Extracts a human-readable error from a span, reading first from its `raw`
 * source records and falling back to well-known attribute keys.
 * Returns `null` for spans that are not in the `error` state.
 */
export const extractSpanError = (span: TraceSpan): null | SpanErrorDetails => {
  if (span.status !== "error") return null;

  const records = parseRawRecords(span.raw);

  const rawMessage = findFirstInRecords(records, (record) =>
    isRecord(record["status"])
      ? nonEmptyString(record["status"]["message"])
      : undefined,
  );
  const langfuseStatusMessage = findFirstInRecords(records, (record) =>
    nonEmptyString(record["statusMessage"]),
  );
  const rawName = findFirstInRecords(records, (record) =>
    nonEmptyString(record["name"]),
  );

  const message =
    rawMessage ??
    langfuseStatusMessage ??
    readAttribute(span, ERROR_MESSAGE_KEYS) ??
    "Error (no message in span payload)";

  return {
    message,
    nodeName: rawName ?? span.title,
    stack: readAttribute(span, ERROR_STACK_KEYS, nonBlankUntrimmedString),
  };
};

/**
 * Walks the span tree and returns every span in the `error` state.
 */
export const collectErrorSpans = (spans: TraceSpan[]): TraceSpan[] =>
  flattenSpans(spans).filter((span) => span.status === "error");

/**
 * Whether the run (span tree) contains at least one failed span.
 */
export const traceRunHasErrors = (spans: TraceSpan[]): boolean =>
  collectErrorSpans(spans).length > 0;

/**
 * Collects one entry per failed span in the run, each paired with its
 * extracted error details.
 */
export const collectRunErrorEntries = (spans: TraceSpan[]): RunErrorEntry[] =>
  collectErrorSpans(spans).flatMap((span) => {
    const details = extractSpanError(span);

    return details ? [{ details, span }] : [];
  });

/**
 * Collects the error entry for a single span (children excluded), or `null`
 * when the span has no error.
 */
export const collectSpanErrorEntry = (
  span: TraceSpan,
): null | RunErrorEntry => {
  const details = extractSpanError(span);

  return details ? { details, span } : null;
};

/**
 * Whether the given span is the root (run parent) of the provided span tree.
 */
export const isRootTraceSpan = (
  span: TraceSpan,
  rootSpans: TraceSpan[],
): boolean => rootSpans.some((rootSpan) => rootSpan.id === span.id);

/**
 * Whether the DetailsView error surface has anything to show for a selected
 * span: for a root, any failure in its own subtree; otherwise the span's own
 * error. Status-only (no payload parsing), so it is safe to call on render.
 */
export const spanHasErrorSurface = (
  span: TraceSpan,
  allSpans: TraceSpan[],
): boolean =>
  isRootTraceSpan(span, allSpans)
    ? traceRunHasErrors([span])
    : span.status === "error";

/**
 * Derives the overall run status from its span tree.
 */
export const deriveTraceRunStatus = (spans: TraceSpan[]): TraceRunStatus =>
  traceRunHasErrors(spans) ? "error" : "success";

/**
 * Singular/plural label for a run error count, e.g. `"1 error"` / `"3 errors"`.
 */
export const errorCountLabel = (count: number): string =>
  count === 1 ? "1 error" : `${count} errors`;
