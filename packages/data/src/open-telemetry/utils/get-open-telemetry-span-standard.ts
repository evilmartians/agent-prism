import {
  OPENINFERENCE_ATTRIBUTES,
  OPENTELEMETRY_GENAI_ATTRIBUTES,
  type OpenTelemetrySpan,
  type OpenTelemetryStandard,
} from "@evilmartians/agent-prism-types";

import { getOpenTelemetryAttributeValue } from "./get-open-telemetry-attribute-value.js";

export function getOpenTelemetrySpanStandard(
  span: OpenTelemetrySpan,
): OpenTelemetryStandard {
  if (
    getOpenTelemetryAttributeValue(
      span,
      OPENTELEMETRY_GENAI_ATTRIBUTES.OPERATION_NAME,
    ) ||
    getOpenTelemetryAttributeValue(span, OPENTELEMETRY_GENAI_ATTRIBUTES.SYSTEM)
  ) {
    return "opentelemetry_genai";
  }

  if (
    getOpenTelemetryAttributeValue(span, OPENINFERENCE_ATTRIBUTES.SPAN_KIND) ||
    getOpenTelemetryAttributeValue(span, OPENINFERENCE_ATTRIBUTES.LLM_MODEL)
  ) {
    return "openinference";
  }

  return "standard";
}
