import { type OpenTelemetrySpan } from "@evilmartians/agent-prism-types";

export function getOpenTelemetryAttributeValue(
  span: OpenTelemetrySpan,
  key: string,
): string | number | boolean | undefined {
  const attr = span.attributes.find((a) => a.key === key);

  if (!attr) {
    return undefined;
  }

  const { value } = attr;

  if (value.stringValue !== undefined) {
    return value.stringValue;
  }

  if (value.intValue !== undefined) {
    return parseFloat(value.intValue);
  }

  if (value.boolValue !== undefined) {
    return value.boolValue;
  }

  return undefined;
}
