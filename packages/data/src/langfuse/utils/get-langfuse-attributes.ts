import type {
  LangfuseObservation,
  TraceSpanAttribute,
} from "@evilmartians/agent-prism-types";

import { toAttributes } from "../../common/attribute-value.js";
import { isPlainRecord, isRecord } from "../../common/guards.js";

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

    return isPlainRecord(attributes) ? toAttributes(attributes) : [];
  });
}
