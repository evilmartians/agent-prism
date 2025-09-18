import type { TraceSpanAttribute } from ".";

export type OpenTelemetryDocument = {
  resourceSpans: OpenTelemetryResourceSpan[];
};

export type OpenTelemetryResourceSpan = {
  resource: OpenTelemetryResource;
  scopeSpans: OpenTelemetryScopeSpan[];
  schemaUrl?: string;
};

export type OpenTelemetryResource = {
  attributes: TraceSpanAttribute[];
};

export type OpenTelemetryScopeSpan = {
  scope: OpenTelemetryScope;
  spans: OpenTelemetrySpan[];
  schemaUrl?: string;
};

export type OpenTelemetryScope = {
  name: string;
  version?: string;
};

export type OpenTelemetrySpan = {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  kind: OpenTelemetrySpanKind;
  startTimeUnixNano: string;
  endTimeUnixNano: string;
  attributes: TraceSpanAttribute[];
  status: OpenTelemetryStatus;
  flags: number;
  events?: OpenTelemetryEvent[];

  traceState?: string;
  droppedAttributesCount?: number;
  droppedEventsCount?: number;
  droppedLinksCount?: number;
  links?: OpenTelemetryLink[];
};

export type OpenTelemetryEvent = {
  timeUnixNano: string;
  name: string;
  attributes?: TraceSpanAttribute[];
  droppedAttributesCount?: number;
};

export type OpenTelemetryLink = {
  traceId: string;
  spanId: string;
  traceState?: string;
  attributes?: TraceSpanAttribute[];
  droppedAttributesCount?: number;
};

export type OpenTelemetryStatus = {
  code?: OpenTelemetryStatusCode;
  message?: string;
};

export type OpenTelemetrySpanKind =
  | "SPAN_KIND_INTERNAL"
  | "SPAN_KIND_SERVER"
  | "SPAN_KIND_CLIENT"
  | "SPAN_KIND_PRODUCER"
  | "SPAN_KIND_CONSUMER";

export type OpenTelemetryStatusCode =
  | "STATUS_CODE_OK"
  | "STATUS_CODE_ERROR"
  | "STATUS_CODE_UNSET";

export type OpenTelemetryStandard =
  | "opentelemetry_genai"
  | "openinference"
  | "standard";
