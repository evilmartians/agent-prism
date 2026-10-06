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
}: DetailsViewRunErrorsSummaryProps): null | ReactElement => {
  const agentContent = useMemo(
    () => formatRunErrorsForAgent(entries),
    [entries],
  );

  if (entries.length === 0) return null;

  return (
    <CollapsibleSection
      contentClassName="pb-1"
      defaultOpen
      rightContent={
        <div className="flex items-center gap-1">
          <CopyButton content={agentContent} label="all errors for agent" />
          <ErrorCountBadge count={entries.length} />
        </div>
      }
      title="Run errors"
      triggerClassName="text-agentprism-foreground"
    >
      <DetailsViewErrorEntryList entries={entries} />
    </CollapsibleSection>
  );
};
