import {
  type DeepReadonly,
  OPENTELEMETRY_GENAI_ATTRIBUTES,
  type OpenTelemetrySpan,
  STANDARD_OPENTELEMETRY_ATTRIBUTES,
} from "@evilmartians/agent-prism-types";

import { getOpenTelemetryAttributeValue } from "./get-open-telemetry-attribute-value.js";

export function generateOpenTelemetrySpanTitle(
  span: DeepReadonly<OpenTelemetrySpan>,
): string {
  const { name } = span;

  const model = getOpenTelemetryAttributeValue(
    span,
    OPENTELEMETRY_GENAI_ATTRIBUTES.MODEL,
  );

  const hasModel = Boolean(model);

  if (hasModel) {
    return `${model} - ${name}`;
  }

  const collection = getOpenTelemetryAttributeValue(
    span,
    STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_COLLECTION,
  );
  const operation = getOpenTelemetryAttributeValue(
    span,
    STANDARD_OPENTELEMETRY_ATTRIBUTES.DB_OPERATION,
  );

  if (Boolean(collection) && Boolean(operation)) {
    return `${collection} - ${operation}`;
  }

  const method = getOpenTelemetryAttributeValue(
    span,
    STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_METHOD,
  );
  const url = getOpenTelemetryAttributeValue(
    span,
    STANDARD_OPENTELEMETRY_ATTRIBUTES.HTTP_URL,
  );

  if (Boolean(method) && Boolean(url)) {
    return `${method} ${url}`;
  }

  return name;
}
