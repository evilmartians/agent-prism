import type {
  DeepReadonly,
  OpenTelemetrySpan,
} from "@evilmartians/agent-prism-types";

import {
  getAttributeNumber,
  reviveAttributeValue,
} from "../../common/attribute-value.js";

export function getOpenTelemetryAttributeValue(
  span: DeepReadonly<Pick<OpenTelemetrySpan, "attributes">>,
  key: string,
): boolean | number | string | undefined {
  const value = reviveAttributeValue(
    span.attributes?.find((a) => a.key === key)?.value,
  );

  if (value === undefined) {
    return undefined;
  }

  if (value.stringValue !== undefined) {
    return value.stringValue;
  }

  if (value.boolValue !== undefined) {
    return value.boolValue;
  }

  return getAttributeNumber(value);
}
