import type {
  LangfuseObservation,
  TraceSpanAttribute,
} from "@evilmartians/agent-prism-types";

import { isRecord } from "../../common/guards.js";

const ATTRIBUTE_SECTIONS = ["attributes", "resourceAttributes"] as const;

export function getLangfuseAttributes(
  span: Readonly<Pick<LangfuseObservation, "metadata">>,
): TraceSpanAttribute[] {
  if (typeof span.metadata !== "string") {
    return [];
  }

  let record: unknown;

  try {
    record = JSON.parse(span.metadata);
  } catch {
    return [];
  }

  if (!isRecord(record)) {
    return [];
  }

  return ATTRIBUTE_SECTIONS.flatMap((section) => {
    const attributes = record[section];

    return isRecord(attributes) ? getAttributeValues(attributes) : [];
  });
}

function getAttributeValues(
  attributes: Readonly<Record<string, unknown>>,
): TraceSpanAttribute[] {
  const result: TraceSpanAttribute[] = [];

  Object.entries(attributes).forEach(
    ([key, value]: readonly [string, unknown]) => {
      if (typeof value === "string") {
        result.push({ key, value: { stringValue: value } });
      } else if (typeof value === "number") {
        result.push({ key, value: { intValue: String(value) } });
      } else if (typeof value === "boolean") {
        result.push({ key, value: { boolValue: value } });
      }
    },
  );

  return result;
}
