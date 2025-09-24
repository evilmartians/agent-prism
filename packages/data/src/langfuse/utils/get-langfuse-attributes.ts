import type {
  LangfuseObservation,
  TraceSpanAttribute,
} from "@evilmartians/agent-prism-types";

export function getLangfuseAttributes(
  span: LangfuseObservation,
): TraceSpanAttribute[] {
  if (!span.metadata || typeof span.metadata !== "string") {
    return [];
  }

  const result: TraceSpanAttribute[] = [];

  try {
    const record = JSON.parse(span.metadata) as unknown;

    if (
      typeof record === "object" &&
      record !== null &&
      "attributes" in record &&
      typeof record.attributes === "object" &&
      record.attributes !== null
    ) {
      result.push(...getAttributeValues(record.attributes));
    }

    if (
      typeof record === "object" &&
      record !== null &&
      "resourceAttributes" in record &&
      typeof record.resourceAttributes === "object" &&
      record.resourceAttributes !== null
    ) {
      result.push(...getAttributeValues(record.resourceAttributes));
    }
  } catch {
    return result;
  }

  return result;
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
