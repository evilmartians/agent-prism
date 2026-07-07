import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import { spanHasErrorSurface } from "@evilmartians/agent-prism-data";
import { useState, useEffect, useMemo } from "react";

import type { TabItem } from "../Tabs";

import { CollapsibleSection } from "../CollapsibleSection";
import { TabSelector } from "../TabSelector";
import {
  DetailsViewContentViewer,
  type DetailsViewContentViewMode,
} from "./DetailsViewContentViewer";
import { DetailsViewErrorBlocks } from "./DetailsViewErrorBlocks";

interface DetailsViewInputOutputTabProps {
  data: TraceSpan;
  allSpans?: TraceSpan[];
}

// Stable reference so memo deps don't change when allSpans is omitted.
const EMPTY_SPANS: TraceSpan[] = [];

type IOSection = "Input" | "Output";

export const DetailsViewInputOutputTab = ({
  data,
  allSpans,
}: DetailsViewInputOutputTabProps): ReactElement => {
  const hasInput = Boolean(data.input);
  const hasOutput = Boolean(data.output);

  const resolvedSpans = allSpans ?? EMPTY_SPANS;

  // Always rendered: shows the selected span's own error even when the full
  // trace isn't supplied. Renders nothing when there is no error to show.
  const errorBlocks = (
    <DetailsViewErrorBlocks span={data} allSpans={resolvedSpans} />
  );

  // Whether errorBlocks will render content — used to hide the redundant
  // "no data" placeholder when an error is already shown.
  const hasErrorContent = useMemo(
    () => spanHasErrorSurface(data, resolvedSpans),
    [data, resolvedSpans],
  );

  if (!hasInput && !hasOutput) {
    return (
      <div className="space-y-4">
        {errorBlocks}

        {!hasErrorContent && (
          <div className="border-agentprism-border rounded-md border p-4">
            <p className="text-agentprism-muted-foreground text-sm">
              No input or output data available for this span
            </p>
          </div>
        )}
      </div>
    );
  }

  let parsedInput: string | null = null;
  let parsedOutput: string | null = null;

  if (typeof data.input === "string") {
    try {
      parsedInput = JSON.parse(data.input);
    } catch {
      parsedInput = null;
    }
  }

  if (typeof data.output === "string") {
    try {
      parsedOutput = JSON.parse(data.output);
    } catch {
      parsedOutput = null;
    }
  }

  return (
    <div className="space-y-4">
      {errorBlocks}

      {typeof data.input === "string" && (
        <IOSection
          section="Input"
          content={data.input}
          parsedContent={parsedInput}
        />
      )}
      {typeof data.output === "string" && (
        <IOSection
          section="Output"
          content={data.output}
          parsedContent={parsedOutput}
        />
      )}
    </div>
  );
};

interface IOSectionProps {
  section: IOSection;
  content: string;
  parsedContent: string | null;
}

const IOSection = ({
  section,
  content,
  parsedContent,
}: IOSectionProps): ReactElement => {
  const [tab, setTab] = useState<DetailsViewContentViewMode>(
    parsedContent ? "json" : "plain",
  );

  useEffect(() => {
    if (tab === "json" && !parsedContent) {
      setTab("plain");
    }
  }, [tab, parsedContent]);

  const tabItems: TabItem<DetailsViewContentViewMode>[] = [
    { value: "json", label: "JSON", disabled: !parsedContent },
    { value: "plain", label: "Plain" },
  ];

  return (
    <CollapsibleSection
      title={section}
      defaultOpen
      rightContent={
        <TabSelector<DetailsViewContentViewMode>
          items={tabItems}
          defaultValue={parsedContent ? "json" : "plain"}
          value={tab}
          onValueChange={setTab}
          theme="pill"
          onClick={(event) => event.stopPropagation()}
        />
      }
    >
      <DetailsViewContentViewer
        content={content}
        parsedContent={parsedContent}
        mode={tab}
        label={section}
        id={section}
      />
    </CollapsibleSection>
  );
};
