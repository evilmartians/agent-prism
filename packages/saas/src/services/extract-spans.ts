import type {
  LangfuseDocument,
  OpenTelemetryDocument,
  TraceSpan,
} from "@evilmartians/agent-prism-types";

import {
  langfuseSpanAdapter,
  openTelemetrySpanAdapter,
} from "@evilmartians/agent-prism-data";

import { isValidTraceSpan } from "./is-valid-trace-span";

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

  if (Array.isArray(data) && data.length > 0 && data.every(isValidTraceSpan)) {
    return data;
  }

  if (
    "spans" in data &&
    Array.isArray(data.spans) &&
    data.spans.every(isValidTraceSpan)
  ) {
    return data.spans;
  }

  if (
    "data" in data &&
    Array.isArray(data.data) &&
    data.data.every(isValidTraceSpan)
  ) {
    return data.data;
  }

  if (isValidTraceSpan(data)) {
    return [data];
  }

  throw new Error("Invalid trace format. Expected OpenTelemetry or Langfuse.");
};
