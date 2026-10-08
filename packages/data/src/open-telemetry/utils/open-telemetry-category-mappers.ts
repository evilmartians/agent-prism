import {
  type DeepReadonly,
  type OpenTelemetrySpan,
  STANDARD_OPENTELEMETRY_ATTRIBUTES,
  STANDARD_OPENTELEMETRY_PATTERNS,
} from "@evilmartians/agent-prism-types";

import { getOpenTelemetryAttributeValue } from "./get-open-telemetry-attribute-value.js";

const nameHasKeyword = (
  span: DeepReadonly<OpenTelemetrySpan>,
  keywords: readonly string[],
): boolean => {
  const name = (span.name ?? "").toLowerCase();

  return keywords.some((keyword) => name.includes(keyword));
};

export const openTelemetryCategoryMappers = {
  isAgentOperation: (span: DeepReadonly<OpenTelemetrySpan>): boolean =>
    nameHasKeyword(span, STANDARD_OPENTELEMETRY_PATTERNS.AGENT_KEYWORDS),

  isChainOperation: (span: DeepReadonly<OpenTelemetrySpan>): boolean =>
    nameHasKeyword(span, STANDARD_OPENTELEMETRY_PATTERNS.CHAIN_KEYWORDS),

  isDatabaseCall: (span: DeepReadonly<OpenTelemetrySpan>): boolean => {
    return (
      getOpenTelemetryAttributeValue(
        span,
        STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM,
      ) !== undefined
    );
  },

  isFunctionCall: (span: DeepReadonly<OpenTelemetrySpan>): boolean =>
    nameHasKeyword(span, STANDARD_OPENTELEMETRY_PATTERNS.FUNCTION_KEYWORDS) ||
    getOpenTelemetryAttributeValue(
      span,
      STANDARD_OPENTELEMETRY_ATTRIBUTES.FUNCTION_NAME,
    ) !== undefined,

  isHttpCall: (span: DeepReadonly<OpenTelemetrySpan>): boolean => {
    return (
      getOpenTelemetryAttributeValue(
        span,
        STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD,
      ) !== undefined
    );
  },

  isLLMCall: (span: DeepReadonly<OpenTelemetrySpan>): boolean =>
    nameHasKeyword(span, STANDARD_OPENTELEMETRY_PATTERNS.LLM_KEYWORDS),

  isRetrievalOperation: (span: DeepReadonly<OpenTelemetrySpan>): boolean =>
    nameHasKeyword(span, STANDARD_OPENTELEMETRY_PATTERNS.RETRIEVAL_KEYWORDS),
};
