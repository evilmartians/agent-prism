/**
 * Resolves the records the per-span RAW tab shows: the verbatim vendor span,
 * as a single record, when a slice exists, else the span's own `raw` records.
 * A `null` slice (non-OTLP bodies like n8n, manual uploads, or an unknown span)
 * falls back to those records unchanged.
 */
export const resolveSpanRaw = (
  vendorSlice: unknown | null,
  spanRaw: string[],
): string[] => {
  if (vendorSlice === null) return spanRaw;

  return [JSON.stringify(vendorSlice, null, 2)];
};

/** A fetched vendor slice tagged with the span it was resolved for. */
export type ResolvedSpanSlice = { spanId: string; slice: unknown };

/**
 * Returns the resolved slice only when it belongs to the span currently on
 * screen, else `null` (fall back to normalized). A slice fetched for a previous
 * span can still be in state when a new span renders; tagging the result by
 * `spanId` and checking it here means a stale slice is never shown for the
 * wrong span.
 */
export const selectSliceForSpan = (
  resolved: ResolvedSpanSlice | null,
  spanId: string,
): unknown =>
  resolved !== null && resolved.spanId === spanId ? resolved.slice : null;
