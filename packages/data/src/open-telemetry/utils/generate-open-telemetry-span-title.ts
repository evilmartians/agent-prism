import {
  OPENTELEMETRY_GENAI_ATTRIBUTES,
  STANDARD_OPENTELEMETRY_ATTRIBUTES,
  type OpenTelemetrySpan,
} from "@evilmartians/agent-prism-types";

import { getOpenTelemetryAttributeValue } from "./get-open-telemetry-attribute-value.js";

export function generateOpenTelemetrySpanTitle(
  span: OpenTelemetrySpan,
): string {
  const { name } = span;

  // For LLM operations, use model name
  const model = getOpenTelemetryAttributeValue(
    span,
    OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL,
  );

  if (model) {
    return `${model} - ${name}`;
  }

  // For vector DB operations, use collection name
  const collection = getOpenTelemetryAttributeValue(
    span,
    STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_COLLECTION,
  );
  const operation = getOpenTelemetryAttributeValue(
    span,
    STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_OPERATION,
  );

  if (collection && operation) {
    return `${collection} - ${operation}`;
  }

  // For HTTP operations, use method and URL
  const method = getOpenTelemetryAttributeValue(
    span,
    STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD,
  );
  const url = getOpenTelemetryAttributeValue(
    span,
    STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_URL,
  );

  if (method && url) {
    return `${method} ${url}`;
  }

  return name;
}
