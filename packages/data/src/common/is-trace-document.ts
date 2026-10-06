import type {
  LangfuseCostDetails,
  LangfuseDocument,
  LangfuseObservation,
  LangfuseObservationLevel,
  LangfuseObservationType,
  LangfuseScore,
  LangfuseScoreDataType,
  LangfuseScoreSource,
  LangfuseTrace,
  OpenTelemetryDocument,
  OpenTelemetryEvent,
  OpenTelemetryLink,
  OpenTelemetryResourceSpan,
  OpenTelemetryScope,
  OpenTelemetryScopeSpan,
  OpenTelemetrySpan,
  OpenTelemetrySpanKind,
  OpenTelemetryStatus,
  OpenTelemetryStatusCode,
  TraceSpanAttribute,
  TraceSpanAttributeValue,
} from "@evilmartians/agent-prism-types";

import {
  hasShape,
  isArrayOf,
  isBoolean,
  isNullable,
  isNumber,
  isOneOf,
  isOptional,
  isPlainRecord,
  isString,
  isUnknown,
} from "./guards.js";

const isOptionalNumber = isOptional(isNumber);
const isOptionalString = isOptional(isString);
const isNullableString = isNullable(isString);
const isOptionalNullableNumber = isOptional(isNullable(isNumber));
const isOptionalNullableString = isOptional(isNullableString);

const isAttributes = isArrayOf(
  hasShape<TraceSpanAttribute>({
    key: isString,
    value: hasShape<TraceSpanAttributeValue>({
      boolValue: isOptional(isBoolean),
      intValue: isOptionalString,
      stringValue: isOptionalString,
    }),
  }),
);

const isOptionalAttributes = isOptional(isAttributes);

const SPAN_KINDS: Record<OpenTelemetrySpanKind, true> = {
  SPAN_KIND_CLIENT: true,
  SPAN_KIND_CONSUMER: true,
  SPAN_KIND_INTERNAL: true,
  SPAN_KIND_PRODUCER: true,
  SPAN_KIND_SERVER: true,
};

const STATUS_CODES: Record<OpenTelemetryStatusCode, true> = {
  STATUS_CODE_ERROR: true,
  STATUS_CODE_OK: true,
  STATUS_CODE_UNSET: true,
};

const isOpenTelemetrySpan = hasShape<OpenTelemetrySpan>({
  attributes: isAttributes,
  droppedAttributesCount: isOptionalNumber,
  droppedEventsCount: isOptionalNumber,
  droppedLinksCount: isOptionalNumber,
  endTimeUnixNano: isString,
  events: isOptional(
    isArrayOf(
      hasShape<OpenTelemetryEvent>({
        attributes: isOptionalAttributes,
        droppedAttributesCount: isOptionalNumber,
        name: isString,
        timeUnixNano: isString,
      }),
    ),
  ),
  flags: isNumber,
  kind: isOneOf(SPAN_KINDS),
  links: isOptional(
    isArrayOf(
      hasShape<OpenTelemetryLink>({
        attributes: isOptionalAttributes,
        droppedAttributesCount: isOptionalNumber,
        spanId: isString,
        traceId: isString,
        traceState: isOptionalString,
      }),
    ),
  ),
  name: isString,
  parentSpanId: isOptionalString,
  spanId: isString,
  startTimeUnixNano: isString,
  status: hasShape<OpenTelemetryStatus>({
    code: isOptional(isOneOf(STATUS_CODES)),
    message: isOptionalString,
  }),
  traceId: isString,
  traceState: isOptionalString,
});

const isResourceSpan = hasShape<OpenTelemetryResourceSpan>({
  resource: hasShape({ attributes: isAttributes }),
  schemaUrl: isOptionalString,
  scopeSpans: isArrayOf(
    hasShape<OpenTelemetryScopeSpan>({
      schemaUrl: isOptionalString,
      scope: hasShape<OpenTelemetryScope>({
        name: isString,
        version: isOptionalString,
      }),
      spans: isArrayOf(isOpenTelemetrySpan),
    }),
  ),
});

/**
 * Checks that a value, typically parsed JSON, is an OTLP/JSON export:
 * resource spans, their scope spans and spans, with every field
 * `OpenTelemetryDocument` declares of the declared type.
 */
export const isOpenTelemetryDocument = hasShape<OpenTelemetryDocument>({
  resourceSpans: isArrayOf(isResourceSpan),
});

const OBSERVATION_LEVELS: Record<LangfuseObservationLevel, true> = {
  DEBUG: true,
  DEFAULT: true,
  ERROR: true,
  WARNING: true,
};

const OBSERVATION_TYPES: Record<LangfuseObservationType, true> = {
  AGENT: true,
  CHAIN: true,
  EMBEDDING: true,
  EVALUATOR: true,
  EVENT: true,
  GENERATION: true,
  GUARDRAIL: true,
  RETRIEVER: true,
  SPAN: true,
  TOOL: true,
  UNKNOWN: true,
};

const SCORE_DATA_TYPES: Record<LangfuseScoreDataType, true> = {
  BOOLEAN: true,
  CATEGORICAL: true,
  NUMERIC: true,
};

const SCORE_SOURCES: Record<LangfuseScoreSource, true> = {
  ANNOTATION: true,
  API: true,
  EVAL: true,
  USER: true,
};

const isDetails = isOptional(
  isNullable(
    hasShape<LangfuseCostDetails>({
      input: isOptionalNumber,
      input_cached_tokens: isOptionalNumber,
      output: isOptionalNumber,
      output_reasoning_tokens: isOptionalNumber,
      total: isOptionalNumber,
    }),
  ),
);

const isObservation = hasShape<LangfuseObservation>({
  costDetails: isDetails,
  createdAt: isString,
  endTime: isNullableString,
  environment: isString,
  id: isString,
  input: isOptionalNullableString,
  inputCost: isOptionalNullableNumber,
  inputUsage: isOptionalNullableNumber,
  internalModelId: isOptionalNullableString,
  latency: isOptionalNumber,
  level: isOptional(isOneOf(OBSERVATION_LEVELS)),
  metadata: isUnknown,
  model: isOptionalNullableString,
  name: isString,
  output: isOptionalNullableString,
  outputCost: isOptionalNullableNumber,
  outputUsage: isOptionalNullableNumber,
  parentObservationId: isNullableString,
  projectId: isString,
  promptId: isOptionalNullableString,
  promptName: isOptionalNullableString,
  promptVersion: isOptionalNullableNumber,
  providedCostDetails: isOptional(isPlainRecord),
  startTime: isString,
  statusMessage: isOptionalNullableString,
  timeToFirstToken: isOptionalNullableNumber,
  totalCost: isOptionalNullableNumber,
  totalUsage: isOptionalNullableNumber,
  traceId: isString,
  type: isOptional(isOneOf(OBSERVATION_TYPES)),
  updatedAt: isString,
  usageDetails: isDetails,
  version: isOptionalNullableString,
});

const isScore = hasShape<LangfuseScore>({
  authorUserId: isNullableString,
  comment: isNullableString,
  configId: isNullableString,
  createdAt: isString,
  dataType: isOneOf(SCORE_DATA_TYPES),
  id: isString,
  name: isString,
  observationId: isNullableString,
  projectId: isString,
  queueId: isNullableString,
  source: isOneOf(SCORE_SOURCES),
  stringValue: isNullableString,
  timestamp: isString,
  traceId: isString,
  updatedAt: isString,
  value: isNullable(isNumber),
});

const isTraceMetadata = (
  value: unknown,
): value is Record<string, unknown> | string =>
  isPlainRecord(value) || isString(value);

const isTrace = hasShape<LangfuseTrace>({
  bookmarked: isBoolean,
  createdAt: isString,
  environment: isString,
  id: isString,
  input: isOptionalNullableString,
  latency: isOptionalNumber,
  metadata: isOptional(isNullable(isTraceMetadata)),
  name: isString,
  observations: isOptional(isArrayOf(isObservation)),
  output: isOptionalNullableString,
  projectId: isString,
  public: isBoolean,
  release: isNullableString,
  scores: isArrayOf(isScore),
  sessionId: isOptionalNullableString,
  tags: isArrayOf(isString),
  timestamp: isString,
  updatedAt: isString,
  userId: isOptionalNullableString,
  version: isNullableString,
});

/**
 * Checks that a value, typically parsed JSON, is a Langfuse trace export: the
 * trace and its observations, with every field `LangfuseDocument` declares of
 * the declared type.
 */
export const isLangfuseDocument = hasShape<LangfuseDocument>({
  observations: isArrayOf(isObservation),
  trace: isTrace,
});
