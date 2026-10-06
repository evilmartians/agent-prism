import type { RunErrorEntry } from "@evilmartians/agent-prism-data";
import type { ReactElement } from "react";

import { formatRunErrorsForAgent } from "@evilmartians/agent-prism-data";
import { useMemo } from "react";

import { CollapsibleSection } from "../CollapsibleSection";
import { CopyButton } from "../CopyButton";
import { ErrorCountBadge } from "../ErrorCountBadge";
import { DetailsViewErrorEntryList } from "./DetailsViewErrorEntryList";

type DetailsViewRunErrorsSummaryProps = {
  entries: RunErrorEntry[];
};

/**
 * Collapsible "Run errors" section listing every failed span in the run, with
 * a total count badge and a copy-all-for-agent button.
 */
export const DetailsViewRunErrorsSummary = ({
  entries,
}: DetailsViewRunErrorsSummaryProps): ReactElement | null => {
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
          <CopyButton label="all errors for agent" content={agentContent} />
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
