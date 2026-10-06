import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import {
  collectRunErrorEntries,
  isRootTraceSpan,
} from "@evilmartians/agent-prism-data";
import { useMemo } from "react";

import { DetailsViewRunErrorsSummary } from "./DetailsViewRunErrorsSummary";
import { DetailsViewSpanErrorCallout } from "./DetailsViewSpanErrorCallout";

export type DetailsViewErrorBlocksProps = {
  /**
   * All spans of the selected trace — enables run-level error blocks when the
   * root span is selected. Pass an empty array to show only the selected
   * span's own error.
   */
  allSpans: TraceSpan[];

  /**
   * The currently selected span.
   */
  span: TraceSpan;
};

/**
 * Error surface for the DetailsView Input/Output tab.
 *
 * - Root span selected → run-level summary of every failed span in its own
 *   subtree, so sibling roots' errors don't leak in.
 * - Any other span selected → that span's own error only.
 * - Otherwise renders nothing.
 */
export const DetailsViewErrorBlocks = ({
  allSpans,
  span,
}: DetailsViewErrorBlocksProps): null | ReactElement => {
  const runEntries = useMemo(
    () =>
      isRootTraceSpan(span, allSpans) ? collectRunErrorEntries([span]) : [],
    [span, allSpans],
  );
  const showRunErrors = runEntries.length > 0;
  const showSpanError = !showRunErrors && span.status === "error";

  if (!showRunErrors && !showSpanError) return null;

  return (
    <div className="space-y-4">
      {showRunErrors ? (
        <DetailsViewRunErrorsSummary entries={runEntries} />
      ) : null}
      {showSpanError ? <DetailsViewSpanErrorCallout span={span} /> : null}
    </div>
  );
};
