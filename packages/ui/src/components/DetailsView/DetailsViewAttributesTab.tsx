import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import type { ReadonlyProps } from "../ReadonlyProps";

import { DetailsViewAttributeSection } from "./DetailsViewAttributeSection";

type AttributesTabProps = {
  data: TraceSpan;
};

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
        const stringValue = attribute.value.stringValue;
        const intValue = attribute.value.intValue;
        const simpleValue =
          stringValue !== undefined && stringValue !== ""
            ? stringValue
            : intValue !== undefined && intValue !== ""
              ? intValue
              : (attribute.value.boolValue?.toString() ?? "N/A");

        let parsedJson: unknown = null;
        if (typeof stringValue === "string") {
          try {
            parsedJson = JSON.parse(stringValue);
          } catch {
            parsedJson = null;
          }
        }

        if (stringValue !== undefined && Boolean(parsedJson)) {
          return (
            <DetailsViewAttributeSection
              attributeKey={attribute.key}
              content={stringValue}
              id={`${data.id}-${attribute.key}-${index}`}
              key={`${attribute.key}-${index}`}
              parsedContent={parsedJson}
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
