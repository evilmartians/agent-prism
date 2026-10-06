import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import { hasTodos, spanHasErrorSurface } from "@evilmartians/agent-prism-data";
import { useMemo } from "react";

import { DetailsViewErrorBlocks } from "./DetailsViewErrorBlocks";
import { DetailsViewIOSection } from "./DetailsViewIOSection";
import { DetailsViewTodosSection } from "./DetailsViewTodosSection";

type DetailsViewInputOutputTabProps = {
  allSpans?: TraceSpan[] | undefined;
  data: TraceSpan;
};

const STABLE_EMPTY_SPANS: TraceSpan[] = [];

/**
 * Input, output and todos of a span. Its own error is shown even when the full
 * trace isn't supplied, and replaces the "no data" placeholder.
 */
export const DetailsViewInputOutputTab = ({
  allSpans,
  data,
}: DetailsViewInputOutputTabProps): ReactElement => {
  const hasInput = Boolean(data.input);
  const hasOutput = Boolean(data.output);

  const resolvedSpans = allSpans ?? STABLE_EMPTY_SPANS;

  const errorBlocks = (
    <DetailsViewErrorBlocks allSpans={resolvedSpans} span={data} />
  );

  const errorBlocksRenderContent = useMemo(
    () => spanHasErrorSurface(data, resolvedSpans),
    [data, resolvedSpans],
  );

  if (!hasInput && !hasOutput && !hasTodos(data)) {
    return (
      <div className="space-y-4">
        {errorBlocks}

        {!errorBlocksRenderContent && (
          <div className="border-agentprism-border rounded-md border p-4">
            <p className="text-agentprism-muted-foreground text-sm">
              No input or output data available for this span
            </p>
          </div>
        )}
      </div>
    );
  }

  let parsedInput: unknown = null;
  let parsedOutput: unknown = null;

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
          content={data.input}
          parsedContent={parsedInput}
          section="Input"
        />
      )}
      {typeof data.output === "string" && (
        <DetailsViewIOSection
          content={data.output}
          parsedContent={parsedOutput}
          section="Output"
        />
      )}
    </div>
  );
};
