import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import { DetailsViewAttributeSection } from "./DetailsViewAttributeSection";

type AttributesTabProps = {
  data: TraceSpan;
};

export const DetailsViewAttributesTab = ({
  data,
}: AttributesTabProps): ReactElement => {
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
        const simpleValue =
          stringValue ||
          attribute.value.intValue?.toString() ||
          attribute.value.boolValue?.toString() ||
          "N/A";

        let parsedJson: string | null = null;
        if (typeof stringValue === "string") {
          try {
            parsedJson = JSON.parse(stringValue);
          } catch {
            parsedJson = null;
          }
        }

        const isComplex = parsedJson !== null;

        if (isComplex && parsedJson && stringValue) {
          return (
            <DetailsViewAttributeSection
              key={`${attribute.key}-${index}`}
              attributeKey={attribute.key}
              content={stringValue}
              parsedContent={parsedJson}
              id={`${data.id}-${attribute.key}-${index}`}
            />
          );
        }

        return (
          <div
            key={`${attribute.key}-${index}`}
            className="border-agentprism-border rounded-md border p-4"
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
