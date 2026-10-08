import type {
  OpenTelemetryDocument,
  TraceSpan,
} from "@evilmartians/agent-prism-types";

import {
  isLangfuseDocument,
  isOpenTelemetryDocument,
  isTraceSpanLike,
  langfuseSpanAdapter,
  openTelemetrySpanAdapter,
  reviveTraceSpan,
} from "@evilmartians/agent-prism-data";

const isTraceSpanList = (value: unknown): value is unknown[] =>
  Array.isArray(value) && value.every(isTraceSpanLike);

const isOpenTelemetryDocumentList = (
  value: unknown,
): value is OpenTelemetryDocument[] =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every(isOpenTelemetryDocument);

export const extractSpans = (data: object): TraceSpan[] => {
  if (isOpenTelemetryDocument(data) || isOpenTelemetryDocumentList(data)) {
    return openTelemetrySpanAdapter.convertRawDocumentsToSpans(data);
  }

  if (isLangfuseDocument(data)) {
    return langfuseSpanAdapter.convertRawDocumentsToSpans([data]);
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
