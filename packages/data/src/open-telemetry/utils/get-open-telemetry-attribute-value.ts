import type {
  DeepReadonly,
  OpenTelemetrySpan,
} from "@evilmartians/agent-prism-types";

import { getAttributeNumber } from "../../common/attribute-value.js";

export function getOpenTelemetryAttributeValue(
  span: DeepReadonly<Pick<OpenTelemetrySpan, "attributes">>,
  key: string,
): boolean | number | string | undefined {
  const attr = span.attributes.find((a) => a.key === key);

  if (!attr) {
    return undefined;
  }

  const { value } = attr;

  if (value.stringValue !== undefined) {
    return value.stringValue;
  }

  if (value.boolValue !== undefined) {
    return value.boolValue;
  }

  return getAttributeNumber(value);
}
