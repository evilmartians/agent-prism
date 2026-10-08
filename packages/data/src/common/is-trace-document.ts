import type {
  LangfuseDocument,
  OpenTelemetryDocument,
  OpenTelemetryEvent,
  OpenTelemetryLink,
  OpenTelemetryResource,
  OpenTelemetryResourceSpan,
  OpenTelemetryScope,
  OpenTelemetryScopeSpan,
  OpenTelemetrySpan,
  OpenTelemetrySpanKind,
  OpenTelemetryStatus,
  OpenTelemetryStatusCode,
  OpenTelemetryUnixNano,
} from "@evilmartians/agent-prism-types";

import { isOpenTelemetryAttribute } from "./attribute-value.js";
import {
  hasShape,
  isArrayOf,
  isFiniteNumber,
  isNumber,
  isNumericString,
  isOneOf,
  isOptionalNullable,
  isPlainRecord,
  isString,
} from "./guards.js";

const isOptionalNullableNumber = isOptionalNullable(
  (value: unknown): value is number | string =>
    isNumber(value) || isNumericString(value),
);
const isOptionalNullableString = isOptionalNullable(isString);

const isInteger = (value: unknown): value is number =>
  isFiniteNumber(value) && Number.isInteger(value);

const isUnixNano = isOptionalNullable(
  (value: unknown): value is OpenTelemetryUnixNano =>
    (isString(value) && /^\d+$/.test(value)) ||
    (isInteger(value) && value >= 0),
);

const isEnum =
  <T extends string>(names: Readonly<Record<T, true>>) =>
  (value: unknown): value is number | T =>
    isInteger(value) || isOneOf(names)(value);

const isAttributes = isOptionalNullable(isArrayOf(isOpenTelemetryAttribute));

const SPAN_KINDS: Record<OpenTelemetrySpanKind, true> = {
  SPAN_KIND_CLIENT: true,
  SPAN_KIND_CONSUMER: true,
  SPAN_KIND_INTERNAL: true,
  SPAN_KIND_PRODUCER: true,
  SPAN_KIND_SERVER: true,
  SPAN_KIND_UNSPECIFIED: true,
};

const STATUS_CODES: Record<OpenTelemetryStatusCode, true> = {
  STATUS_CODE_ERROR: true,
  STATUS_CODE_OK: true,
  STATUS_CODE_UNSET: true,
};

const isOpenTelemetrySpan = hasShape<OpenTelemetrySpan>({
  attributes: isAttributes,
  droppedAttributesCount: isOptionalNullableNumber,
  droppedEventsCount: isOptionalNullableNumber,
  droppedLinksCount: isOptionalNullableNumber,
  endTimeUnixNano: isUnixNano,
  events: isOptionalNullable(
    isArrayOf(
      hasShape<OpenTelemetryEvent>({
        attributes: isAttributes,
        droppedAttributesCount: isOptionalNullableNumber,
        name: isOptionalNullableString,
        timeUnixNano: isUnixNano,
      }),
    ),
  ),
  flags: isOptionalNullableNumber,
  kind: isOptionalNullable(isEnum(SPAN_KINDS)),
  links: isOptionalNullable(
    isArrayOf(
      hasShape<OpenTelemetryLink>({
        attributes: isAttributes,
        droppedAttributesCount: isOptionalNullableNumber,
        spanId: isOptionalNullableString,
        traceId: isOptionalNullableString,
        traceState: isOptionalNullableString,
      }),
    ),
  ),
  name: isOptionalNullableString,
  parentSpanId: isOptionalNullableString,
  spanId: isString,
  startTimeUnixNano: isUnixNano,
  status: isOptionalNullable(
    hasShape<OpenTelemetryStatus>({
      code: isOptionalNullable(isEnum(STATUS_CODES)),
      message: isOptionalNullableString,
    }),
  ),
  traceId: isString,
  traceState: isOptionalNullableString,
});

const isResourceSpan = hasShape<OpenTelemetryResourceSpan>({
  resource: isOptionalNullable(
    hasShape<OpenTelemetryResource>({ attributes: isAttributes }),
  ),
  schemaUrl: isOptionalNullableString,
  scopeSpans: isOptionalNullable(
    isArrayOf(
      hasShape<OpenTelemetryScopeSpan>({
        schemaUrl: isOptionalNullableString,
        scope: isOptionalNullable(
          hasShape<OpenTelemetryScope>({
            name: isOptionalNullableString,
            version: isOptionalNullableString,
          }),
        ),
        spans: isOptionalNullable(isArrayOf(isOpenTelemetrySpan)),
      }),
    ),
  ),
});

/**
 * Checks that a value, typically parsed JSON, is an OTLP/JSON export:
 * resource spans, their scope spans and spans, with every field
 * `OpenTelemetryDocument` declares in a form the OTLP specification allows.
 */
export const isOpenTelemetryDocument = hasShape<OpenTelemetryDocument>({
  resourceSpans: isArrayOf(isResourceSpan),
});

/**
 * Tells a Langfuse trace export by its `observations` list, the only part the
 * adapter reads. Observation fields are not checked.
 */
export const isLangfuseDocument = (value: unknown): value is LangfuseDocument =>
  isPlainRecord(value) && Array.isArray(value["observations"]);
