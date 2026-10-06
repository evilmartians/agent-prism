import {
  type DeepReadonly,
  type OpenTelemetrySpan,
  STANDARD_OPENTELEMETRY_ATTRIBUTES,
  STANDARD_OPENTELEMETRY_PATTERNS,
} from "@evilmartians/agent-prism-types";

import { getOpenTelemetryAttributeValue } from "./get-open-telemetry-attribute-value.js";

export const openTelemetryCategoryMappers = {
  isAgentOperation: (span: DeepReadonly<OpenTelemetrySpan>): boolean => {
    const name = span.name.toLowerCase();

    return STANDARD_OPENTELEMETRY_PATTERNS.AGENT_KEYWORDS.some((keyword) =>
      name.includes(keyword),
    );
  },

  isChainOperation: (span: DeepReadonly<OpenTelemetrySpan>): boolean => {
    const name = span.name.toLowerCase();

    return STANDARD_OPENTELEMETRY_PATTERNS.CHAIN_KEYWORDS.some((keyword) =>
      name.includes(keyword),
    );
  },

  isDatabaseCall: (span: DeepReadonly<OpenTelemetrySpan>): boolean => {
    return (
      getOpenTelemetryAttributeValue(
        span,
        STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_SYSTEM,
      ) !== undefined
    );
  },

  isFunctionCall: (span: DeepReadonly<OpenTelemetrySpan>): boolean => {
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

  isHttpCall: (span: DeepReadonly<OpenTelemetrySpan>): boolean => {
    return (
      getOpenTelemetryAttributeValue(
        span,
        STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD,
      ) !== undefined
    );
  },

  isLLMCall: (span: DeepReadonly<OpenTelemetrySpan>): boolean => {
    const name = span.name.toLowerCase();

    return STANDARD_OPENTELEMETRY_PATTERNS.LLM_KEYWORDS.some((keyword) =>
      name.includes(keyword),
    );
  },

  isRetrievalOperation: (span: DeepReadonly<OpenTelemetrySpan>): boolean => {
    const name = span.name.toLowerCase();

    return STANDARD_OPENTELEMETRY_PATTERNS.RETRIEVAL_KEYWORDS.some((keyword) =>
      name.includes(keyword),
    );
  },
};
