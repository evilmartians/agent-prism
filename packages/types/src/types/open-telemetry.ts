import type { TraceSpanAttributeValue } from "./index.js";

/**
 * An `AnyValue` in OTLP/JSON: an empty list has no `values`, and a double
 * that is not finite is written as a string.
 */
export type OpenTelemetryAnyValue = Omit<
  TraceSpanAttributeValue,
  "arrayValue" | "doubleValue" | "kvlistValue"
> & {
  arrayValue?: { values?: null | OpenTelemetryAnyValue[] };
  doubleValue?: "-Infinity" | "Infinity" | "NaN" | number;
  kvlistValue?: { values?: null | OpenTelemetryAttribute[] };
};

export type OpenTelemetryAttribute = {
  key?: null | string;
  value?: null | OpenTelemetryAnyValue;
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
  name?: null | string;
  timeUnixNano?: null | OpenTelemetryUnixNano;
};

export type OpenTelemetryLink = {
  attributes?: null | OpenTelemetryAttribute[];
  droppedAttributesCount?: null | number;
  spanId?: null | string;
  traceId?: null | string;
  traceState?: null | string;
};

export type OpenTelemetryResource = {
  attributes?: null | OpenTelemetryAttribute[];
};

export type OpenTelemetryResourceSpan = {
  resource?: null | OpenTelemetryResource;
  schemaUrl?: null | string;
  scopeSpans?: null | OpenTelemetryScopeSpan[];
};

export type OpenTelemetryScope = {
  name?: null | string;
  version?: null | string;
};

export type OpenTelemetryScopeSpan = {
  schemaUrl?: null | string;
  scope?: null | OpenTelemetryScope;
  spans?: null | OpenTelemetrySpan[];
};

export type OpenTelemetrySpan = {
  attributes?: null | OpenTelemetryAttribute[];
  droppedAttributesCount?: null | number;
  droppedEventsCount?: null | number;
  droppedLinksCount?: null | number;
  endTimeUnixNano?: null | OpenTelemetryUnixNano;
  events?: null | OpenTelemetryEvent[];
  flags?: null | number;
  kind?: null | number | OpenTelemetrySpanKind;
  links?: null | OpenTelemetryLink[];
  name?: null | string;
  parentSpanId?: null | string;

  spanId: string;
  startTimeUnixNano?: null | OpenTelemetryUnixNano;
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
