import type {
  LangfuseDocument,
  OpenTelemetryDocument,
  TraceSpan,
} from "@evilmartians/agent-prism-types";

import {
  isTraceSpanLike,
  langfuseSpanAdapter,
  openTelemetrySpanAdapter,
  reviveTraceSpan,
} from "@evilmartians/agent-prism-data";

// Parsed JSON carries timestamps as strings; reviving turns them back into
// Dates.
const isTraceSpanList = (value: unknown): value is unknown[] =>
  Array.isArray(value) && value.every(isTraceSpanLike);

export const extractSpans = (data: object): TraceSpan[] => {
  if ("resourceSpans" in data && Array.isArray(data.resourceSpans)) {
    return openTelemetrySpanAdapter.convertRawDocumentsToSpans(
      data as OpenTelemetryDocument,
    );
  }

  if (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "resourceSpans" in item &&
        Array.isArray(item.resourceSpans),
    )
  ) {
    return openTelemetrySpanAdapter.convertRawDocumentsToSpans(
      data as OpenTelemetryDocument[],
    );
  }

  if ("trace" in data || "observations" in data) {
    return langfuseSpanAdapter.convertRawDocumentsToSpans([
      data as LangfuseDocument,
    ]);
  }

  if (Array.isArray(data) && data.length > 0 && isTraceSpanList(data)) {
    return data.map(reviveTraceSpan);
  }

  if ("spans" in data && isTraceSpanList(data.spans)) {
    return data.spans.map(reviveTraceSpan);
  }

  if ("data" in data && isTraceSpanList(data.data)) {
    return data.data.map(reviveTraceSpan);
  }

  if (isTraceSpanLike(data)) {
    return [reviveTraceSpan(data)];
  }

  throw new Error("Invalid trace format. Expected OpenTelemetry or Langfuse.");
};
