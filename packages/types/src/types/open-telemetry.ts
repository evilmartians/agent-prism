import type { TraceSpanAttributeValue } from "./index.js";

export type OpenTelemetryAttribute = {
  key: string;
  value?: null | TraceSpanAttributeValue;
};

/**
 * OTLP/JSON, as the OTLP specification encodes it over the Protobuf JSON
 * mapping: a field may be omitted or `null` when it holds its default value,
 * 64-bit integers are decimal strings or numbers, enums are integers or names.
 */
export type OpenTelemetryDocument = {
  resourceSpans: OpenTelemetryResourceSpan[];
};

export type OpenTelemetryEvent = {
  attributes?: null | OpenTelemetryAttribute[];
  droppedAttributesCount?: null | number;
  name: string;
  timeUnixNano: OpenTelemetryUnixNano;
};

export type OpenTelemetryLink = {
  attributes?: null | OpenTelemetryAttribute[];
  droppedAttributesCount?: null | number;
  spanId: string;
  traceId: string;
  traceState?: null | string;
};

export type OpenTelemetryResource = {
  attributes?: null | OpenTelemetryAttribute[];
};

export type OpenTelemetryResourceSpan = {
  resource?: null | OpenTelemetryResource;
  schemaUrl?: null | string;
  scopeSpans: OpenTelemetryScopeSpan[];
};

export type OpenTelemetryScope = {
  name?: null | string;
  version?: null | string;
};

export type OpenTelemetryScopeSpan = {
  schemaUrl?: null | string;
  scope?: null | OpenTelemetryScope;
  spans: OpenTelemetrySpan[];
};

export type OpenTelemetrySpan = {
  attributes?: null | OpenTelemetryAttribute[];
  droppedAttributesCount?: null | number;
  droppedEventsCount?: null | number;
  droppedLinksCount?: null | number;
  endTimeUnixNano: OpenTelemetryUnixNano;
  events?: null | OpenTelemetryEvent[];
  flags?: null | number;
  kind?: null | number | OpenTelemetrySpanKind;
  links?: null | OpenTelemetryLink[];
  name: string;
  parentSpanId?: null | string;

  spanId: string;
  startTimeUnixNano: OpenTelemetryUnixNano;
  status?: null | OpenTelemetryStatus;
  traceId: string;
  traceState?: null | string;
};

export type OpenTelemetrySpanKind =
  | "SPAN_KIND_CLIENT"
  | "SPAN_KIND_CONSUMER"
  | "SPAN_KIND_INTERNAL"
  | "SPAN_KIND_PRODUCER"
  | "SPAN_KIND_SERVER"
  | "SPAN_KIND_UNSPECIFIED";

export type OpenTelemetryStandard =
  | "openinference"
  | "opentelemetry_genai"
  | "standard";

export type OpenTelemetryStatus = {
  code?: null | number | OpenTelemetryStatusCode;
  message?: null | string;
};

export type OpenTelemetryStatusCode =
  | "STATUS_CODE_ERROR"
  | "STATUS_CODE_OK"
  | "STATUS_CODE_UNSET";

/** Nanoseconds since the Unix epoch: a decimal string, or a number. */
export type OpenTelemetryUnixNano = number | string;
