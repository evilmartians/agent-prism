import type {
  LangfuseObservation,
  TraceSpanAttribute,
} from "@evilmartians/agent-prism-types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const ATTRIBUTE_SECTIONS = ["attributes", "resourceAttributes"] as const;

export function getLangfuseAttributes(
  span: LangfuseObservation,
): TraceSpanAttribute[] {
  if (!span.metadata || typeof span.metadata !== "string") {
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

function getAttributeValues(attributes: object): TraceSpanAttribute[] {
  const result: TraceSpanAttribute[] = [];

  Object.entries(attributes).forEach(([key, value]) => {
    if (typeof value === "string") {
      result.push({ key, value: { stringValue: value } });
    } else if (typeof value === "number") {
      result.push({ key, value: { intValue: String(value) } });
    } else if (typeof value === "boolean") {
      result.push({ key, value: { boolValue: value } });
    }
  });

  return result;
}
