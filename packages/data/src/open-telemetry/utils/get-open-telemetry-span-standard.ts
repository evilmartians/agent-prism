import {
  OPENTELEMETRY_GENAI_ATTRIBUTES,
  OPENINFERENCE_ATTRIBUTES,
  type OpenTelemetrySpan,
  type OpenTelemetryStandard,
} from "@evilmartians/agent-prism-types";

import { getOpenTelemetryAttributeValue } from "./get-open-telemetry-attribute-value.js";

export function getOpenTelemetrySpanStandard(
  span: OpenTelemetrySpan,
): OpenTelemetryStandard {
  // Check for OpenTelemetry GenAI attributes
  if (
    getOpenTelemetryAttributeValue(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME,
    ) ||
    getOpenTelemetryAttributeValue(span, OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM)
  ) {
    return "opentelemetry_genai";
  }

  // Check for OpenInference attributes
  if (
    getOpenTelemetryAttributeValue(span, OPENINFERENCE_ATTRIBUTES.SPAN_KIND) ||
    getOpenTelemetryAttributeValue(span, OPENINFERENCE_ATTRIBUTES.LLM_MODEL)
  ) {
    return "openinference";
  }

  // Default to standard OpenTelemetry
  return "standard";
}
