import type { RunErrorEntry } from "@evilmartians/agent-prism-data";
import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import {
  collectRunErrorEntries,
  collectSpanErrorEntry,
  formatRunErrorsForAgent,
  isRootTraceSpan,
} from "@evilmartians/agent-prism-data";
import { useMemo } from "react";

import { CollapsibleSection } from "../CollapsibleSection";
import { CopyButton } from "../CopyButton";
import { ErrorCountBadge } from "../ErrorCountBadge";
import { DetailsViewErrorEntryList } from "./DetailsViewErrorRunRow";

interface SpanErrorCalloutProps {
  span: TraceSpan;
}

/**
 * Renders the error for a single selected span (children excluded).
 */
const SpanErrorCallout = ({
  span,
}: SpanErrorCalloutProps): ReactElement | null => {
  const entry = collectSpanErrorEntry(span);

  if (!entry) return null;

  return <DetailsViewErrorEntryList entries={[entry]} />;
};

interface RunErrorsSummaryProps {
  entries: RunErrorEntry[];
}

/**
 * Collapsible "Run errors" section listing every failed span in the run, with
 * a total count badge and a copy-all-for-agent button.
 */
const RunErrorsSummary = ({
  entries,
}: RunErrorsSummaryProps): ReactElement | null => {
  // Memoized (hook must precede the early return) so the agent Markdown isn't
  // rebuilt on unrelated re-renders of this component.
  const agentContent = useMemo(
    () => formatRunErrorsForAgent(entries),
    [entries],
  );

  if (entries.length === 0) return null;

  return (
    <CollapsibleSection
      title="Run errors"
      defaultOpen
      rightContent={
        // The trigger toggles on click/Enter/Space; stop propagation so the
        // copy button acts (mouse and keyboard) without collapsing the section.
        <div
          className="flex items-center gap-1"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <CopyButton
            label="all errors for agent"
            content={agentContent}
          />
          <ErrorCountBadge count={entries.length} />
        </div>
      }
      triggerClassName="text-agentprism-foreground"
      contentClassName="pb-1"
    >
      <DetailsViewErrorEntryList entries={entries} />
    </CollapsibleSection>
  );
};

export interface DetailsViewErrorBlocksProps {
  /**
   * The currently selected span.
   */
  span: TraceSpan;

  /**
   * All spans of the selected trace — enables run-level error blocks when the
   * root span is selected. Pass an empty array to show only the selected
   * span's own error.
   */
  allSpans: TraceSpan[];
}

/**
 * Error surface for the DetailsView Input/Output tab.
 *
 * - Root span selected → run-level summary of every failed span in the run.
 * - Any other span selected → that span's own error only.
 * - Otherwise renders nothing.
 */
export const DetailsViewErrorBlocks = ({
  span,
  allSpans,
}: DetailsViewErrorBlocksProps): ReactElement | null => {
  // Scope run errors to the selected root's own subtree ([span]), not the
  // whole forest, so sibling roots' errors don't leak in. Memoized so
  // unrelated parent re-renders don't re-walk/parse the tree.
  const runEntries = useMemo(
    () => (isRootTraceSpan(span, allSpans) ? collectRunErrorEntries([span]) : []),
    [span, allSpans],
  );
  const showRunErrors = runEntries.length > 0;
  const showSpanError = !showRunErrors && span.status === "error";

  if (!showRunErrors && !showSpanError) return null;

  return (
    <div className="space-y-4">
      {showRunErrors ? <RunErrorsSummary entries={runEntries} /> : null}
      {showSpanError ? <SpanErrorCallout span={span} /> : null}
    </div>
  );
};
