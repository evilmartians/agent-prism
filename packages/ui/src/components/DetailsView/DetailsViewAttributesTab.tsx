import type {
  DeepReadonly,
  TraceSpan,
  TraceSpanAttributeValue,
} from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import { toPlainAttributeValue } from "@evilmartians/agent-prism-data";

import type { ReadonlyProps } from "../ReadonlyProps";

import { DetailsViewAttributeSection } from "./DetailsViewAttributeSection";

type AttributesTabProps = {
  data: TraceSpan;
};

const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const getJsonContent = (
  value: DeepReadonly<TraceSpanAttributeValue>,
  plainValue: unknown,
): undefined | { content: string; parsed: unknown } => {
  if (value.arrayValue !== undefined || value.kvlistValue !== undefined) {
    return { content: JSON.stringify(plainValue, null, 2), parsed: plainValue };
  }

  if (value.stringValue === undefined) return undefined;

  const parsed = parseJson(value.stringValue);

  const isEmpty =
    parsed === null || parsed === false || parsed === 0 || parsed === "";

  return isEmpty ? undefined : { content: value.stringValue, parsed };
};

const toDisplayText = (plainValue: unknown): string =>
  (typeof plainValue === "string" && plainValue !== "") ||
  typeof plainValue === "number" ||
  typeof plainValue === "boolean"
    ? String(plainValue)
    : "N/A";

export const DetailsViewAttributesTab = ({
  data,
}: ReadonlyProps<AttributesTabProps>): ReactElement => {
  if (!data.attributes || data.attributes.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-agentprism-muted-foreground">
          No attributes available for this span.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.attributes.map((attribute, index) => {
        const plainValue = toPlainAttributeValue(attribute.value);
        const simpleValue = toDisplayText(plainValue);
        const json = getJsonContent(attribute.value, plainValue);

        if (json) {
          return (
            <DetailsViewAttributeSection
              attributeKey={attribute.key}
              content={json.content}
              id={`${data.id}-${attribute.key}-${index}`}
              key={`${attribute.key}-${index}`}
              parsedContent={json.parsed}
            />
          );
        }

        return (
          <div
            className="border-agentprism-border rounded-md border p-4"
            key={`${attribute.key}-${index}`}
          >
            <dt className="text-agentprism-muted-foreground mb-1 text-sm">
              {attribute.key}
            </dt>
            <dd className="text-agentprism-foreground break-words text-sm">
              {simpleValue}
            </dd>
          </div>
        );
      })}
    </div>
  );
};
