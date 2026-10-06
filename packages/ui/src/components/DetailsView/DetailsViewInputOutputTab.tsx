import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import { hasTodos, spanHasErrorSurface } from "@evilmartians/agent-prism-data";
import { useMemo } from "react";

import { DetailsViewErrorBlocks } from "./DetailsViewErrorBlocks";
import { DetailsViewIOSection } from "./DetailsViewIOSection";
import { DetailsViewTodosSection } from "./DetailsViewTodosSection";

type DetailsViewInputOutputTabProps = {
  data: TraceSpan;
  allSpans?: TraceSpan[] | undefined;
};

// Stable reference so memo deps don't change when allSpans is omitted.
const EMPTY_SPANS: TraceSpan[] = [];

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

  if (!hasInput && !hasOutput && !hasTodos(data)) {
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

      <DetailsViewTodosSection data={data} />
      {typeof data.input === "string" && (
        <DetailsViewIOSection
          section="Input"
          content={data.input}
          parsedContent={parsedInput}
        />
      )}
      {typeof data.output === "string" && (
        <DetailsViewIOSection
          section="Output"
          content={data.output}
          parsedContent={parsedOutput}
        />
      )}
    </div>
  );
};
