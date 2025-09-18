import {
  STANDARD_OPENTELEMETRY_ATTRIBUTES,
  STANDARD_OPENTELEMETRY_PATTERNS,
  type OpenTelemetrySpan,
} from "@evilmartians/agent-prism-types";

import { getOpenTelemetryAttributeValue } from "./get-open-telemetry-attribute-value";

export const openTelemetryCategoryMappers = {
  isHttpCall: (span: OpenTelemetrySpan): boolean => {
    return (
      getOpenTelemetryAttributeValue(
        span,
        STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD,
      ) !== undefined
    );
  },

  isDatabaseCall: (span: OpenTelemetrySpan): boolean => {
    return (
      getOpenTelemetryAttributeValue(
        span,
        STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM,
      ) !== undefined
    );
  },

  isFunctionCall: (span: OpenTelemetrySpan): boolean => {
    const name = span.name.toLowerCase();

    return (
      STANDARD_OPENTELEMETRY_PATTERNS.FUNCTION_KEYWORDS.some((keyword) =>
        name.includes(keyword),
      ) ||
      getOpenTelemetryAttributeValue(
        span,
        STANDARD_OPENTELEMETRY_ATTRIBUTES.FUNCTION_NAME,
      ) !== undefined
    );
  },

  isLLMCall: (span: OpenTelemetrySpan): boolean => {
    const name = span.name.toLowerCase();

    return STANDARD_OPENTELEMETRY_PATTERNS.LLM_KEYWORDS.some((keyword) =>
      name.includes(keyword),
    );
  },

  isChainOperation: (span: OpenTelemetrySpan): boolean => {
    const name = span.name.toLowerCase();

    return STANDARD_OPENTELEMETRY_PATTERNS.CHAIN_KEYWORDS.some((keyword) =>
      name.includes(keyword),
    );
  },

  isAgentOperation: (span: OpenTelemetrySpan): boolean => {
    const name = span.name.toLowerCase();

    return STANDARD_OPENTELEMETRY_PATTERNS.AGENT_KEYWORDS.some((keyword) =>
      name.includes(keyword),
    );
  },

  isRetrievalOperation: (span: OpenTelemetrySpan): boolean => {
    const name = span.name.toLowerCase();

    return STANDARD_OPENTELEMETRY_PATTERNS.RETRIEVAL_KEYWORDS.some((keyword) =>
      name.includes(keyword),
    );
  },
};
