import {
  OPENINFERENCE_ATTRIBUTES,
  OPENINFERENCE_MAPPINGS,
  type OpenTelemetrySpan,
  type TraceSpanCategory,
} from "@evilmartians/agent-prism-types";

import { getOpenTelemetryAttributeValue } from "./get-open-telemetry-attribute-value";

export function categorizeOpenInference(
  span: OpenTelemetrySpan,
): TraceSpanCategory {
  const spanKind = getOpenTelemetryAttributeValue(
    span,
    OPENINFERENCE_ATTRIBUTES.SPAN_KIND,
  );

  if (typeof spanKind === "string") {
    const category = OPENINFERENCE_MAPPINGS[spanKind];

    if (category) return category;
  }

  return "unknown";
}
