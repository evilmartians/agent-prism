/**
 * An `AnyValue` in OTLP/JSON: any field may be omitted or `null`, an empty
 * list has no `values`, and a double may be a string, `"NaN"` and
 * `"Infinity"` included.
 */
export type OpenTelemetryAnyValue = {
  arrayValue?: null | { values?: null | OpenTelemetryAnyValue[] };
  boolValue?: boolean | null;
  bytesValue?: null | string;
  doubleValue?: null | number | string;
  intValue?: null | number | string;
  kvlistValue?: null | { values?: null | OpenTelemetryAttribute[] };
  stringValue?: null | string;
};

export type OpenTelemetryAttribute = {
  key?: null | string;
  value?: null | OpenTelemetryAnyValue;
};

/**
 * OTLP/JSON, as the OTLP specification encodes it over the Protobuf JSON
 * mapping: a field may be omitted or `null` when it holds its default value,
 * numbers may be written as strings, enums are integers or names.
 */
export type OpenTelemetryDocument = {
  resourceSpans: OpenTelemetryResourceSpan[];
};

export type OpenTelemetryEvent = {
  attributes?: null | OpenTelemetryAttribute[];
  droppedAttributesCount?: null | number | string;
  name?: null | string;
  timeUnixNano?: null | OpenTelemetryUnixNano;
};

export type OpenTelemetryLink = {
  attributes?: null | OpenTelemetryAttribute[];
  droppedAttributesCount?: null | number | string;
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
  droppedAttributesCount?: null | number | string;
  droppedEventsCount?: null | number | string;
  droppedLinksCount?: null | number | string;
  endTimeUnixNano?: null | OpenTelemetryUnixNano;
  events?: null | OpenTelemetryEvent[];
  flags?: null | number | string;
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
