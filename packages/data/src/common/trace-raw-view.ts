/**
 * View state for the per-trace "view original payload" affordance.
 * Mirrors the backend `TraceRawResult`, plus an `error` state the UI needs for a
 * transport/server failure that the backend union does not model.
 */
export type TraceRawView =
  | { kind: "body"; body: unknown; sizeBytes: number }
  | { kind: "too_large"; sizeBytes: number }
  | { kind: "absent" }
  | { kind: "error" };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * Maps a `GET /traces/:id/raw` response (HTTP status + parsed JSON) to a view
 * state. `404` → `absent` (the trace has no stored original; hide the affordance).
 * A `200` carries the backend's discriminated `{ tooLarge, sizeBytes, body? }`
 * payload. Anything else — non-200/404, a missing `sizeBytes`, or an unexpected
 * shape — is surfaced as `error` rather than guessed at.
 */
export const interpretTraceRawResponse = (
  status: number,
  json: unknown,
): TraceRawView => {
  if (status === 404) return { kind: "absent" };

  if (status !== 200 || !isRecord(json) || typeof json.sizeBytes !== "number") {
    return { kind: "error" };
  }

  if (json.tooLarge === true) {
    return { kind: "too_large", sizeBytes: json.sizeBytes };
  }

  if (json.tooLarge === false && "body" in json) {
    return { kind: "body", body: json.body, sizeBytes: json.sizeBytes };
  }

  return { kind: "error" };
};

/** Compact human-readable byte size for the "too large to show" notice. */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;

  const kb = bytes / 1024;

  if (kb < 1024) return `${kb.toFixed(1)} KB`;

  return `${(kb / 1024).toFixed(1)} MB`;
};
