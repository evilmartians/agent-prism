import type { TraceSpanAttribute } from "./index.js";

export type OpenTelemetryDocument = {
  resourceSpans: OpenTelemetryResourceSpan[];
};

export type OpenTelemetryEvent = {
  attributes?: TraceSpanAttribute[];
  droppedAttributesCount?: number;
  name: string;
  timeUnixNano: string;
};

export type OpenTelemetryLink = {
  attributes?: TraceSpanAttribute[];
  droppedAttributesCount?: number;
  spanId: string;
  traceId: string;
  traceState?: string;
};

export type OpenTelemetryResource = {
  attributes: TraceSpanAttribute[];
};

export type OpenTelemetryResourceSpan = {
  resource: OpenTelemetryResource;
  schemaUrl?: string;
  scopeSpans: OpenTelemetryScopeSpan[];
};

export type OpenTelemetryScope = {
  name: string;
  version?: string;
};

export type OpenTelemetryScopeSpan = {
  schemaUrl?: string;
  scope: OpenTelemetryScope;
  spans: OpenTelemetrySpan[];
};

export type OpenTelemetrySpan = {
  attributes: TraceSpanAttribute[];
  droppedAttributesCount?: number;
  droppedEventsCount?: number;
  droppedLinksCount?: number;
  endTimeUnixNano: string;
  events?: OpenTelemetryEvent[];
  flags: number;
  kind: OpenTelemetrySpanKind;
  links?: OpenTelemetryLink[];
  name: string;
  parentSpanId?: string;

  spanId: string;
  startTimeUnixNano: string;
  status: OpenTelemetryStatus;
  traceId: string;
  traceState?: string;
};

export type OpenTelemetrySpanKind =
  | "SPAN_KIND_CLIENT"
  | "SPAN_KIND_CONSUMER"
  | "SPAN_KIND_INTERNAL"
  | "SPAN_KIND_PRODUCER"
  | "SPAN_KIND_SERVER";

export type OpenTelemetryStandard =
  | "openinference"
  | "opentelemetry_genai"
  | "standard";

export type OpenTelemetryStatus = {
  code?: OpenTelemetryStatusCode;
  message?: string;
};

export type OpenTelemetryStatusCode =
  | "STATUS_CODE_ERROR"
  | "STATUS_CODE_OK"
  | "STATUS_CODE_UNSET";
